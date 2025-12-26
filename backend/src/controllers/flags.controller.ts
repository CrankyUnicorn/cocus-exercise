import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";
import { createFlagSchema, updateFlagSchema } from "../validators/flags.validator";
import { isFlagActive } from "../services/evaluation.service";
import { notifySlack } from "../services/slack.service";

// Create flag
export async function createFlag(req: Request, res: Response, next: NextFunction) {
  try {
    const { value, error } = createFlagSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const flag = await prisma.featureFlag.create({ data: value });
    await notifySlack(`🚩 Flag created: ${flag.key}`);
    res.status(201).json(flag);
  } catch (err: any) {
    if (err.code === "P2002") return res.status(409).json({ error: "Flag key already exists" });
    next(err);
  }
}

// Get all flags
export async function listFlags(req: Request, res: Response) {
  const limit = parseInt(String(req.query.limit)) || 10;
  const page = parseInt(String(req.query.page)) || 1;
  const skip = (page - 1) * limit;

  const flags = await prisma.featureFlag.findMany({ take: limit, skip });
  res.json(flags);
}

// Get flag by ID
export async function getFlag(req: Request, res: Response) {
  const flag = await prisma.featureFlag.findUnique({ where: { id: req.params.id } });
  if (!flag) return res.status(404).json({ error: "Flag not found" });
  res.json(flag);
}

// Update flag
export async function updateFlag(req: Request, res: Response, next: NextFunction) {
  try {
    const { value, error } = updateFlagSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.message });

    const flag = await prisma.featureFlag.update({
      where: { id: req.params.id },
      data: value,
    });

    await notifySlack(`✏️ Flag updated: ${flag.key}`);
    res.json(flag);
  } catch (err: any) {
    next(err);
  }
}

// Delete flag
export async function deleteFlag(req: Request, res: Response) {
  try {
    await prisma.featureFlag.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: "Flag not found" });
  }
}

// Evaluate flag for a user
export async function evaluateFlag(req: Request, res: Response) {
  const { key, userId } = req.query;
  if (!key || !userId) return res.status(400).json({ error: "key and userId are required" });

  const flag = await prisma.featureFlag.findUnique({ where: { key: String(key) } });
  if (!flag) return res.status(404).json({ error: "Flag not found" });

  const active = isFlagActive(flag.enabled, flag.rolloutPercentage, String(userId));
  res.json({
    active,
    reason: flag.enabled
      ? `User falls ${active ? "inside" : "outside"} rollout`
      : "Flag disabled",
  });
}
