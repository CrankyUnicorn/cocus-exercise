import { Router } from "express";
import {
  createFlag,
  listFlags,
  getFlag,
  updateFlag,
  deleteFlag,
  evaluateFlag
} from "../controllers/flags.controller";

const router = Router();

router.post("/", createFlag);
router.get("/", listFlags);
router.get("/:id", getFlag);
router.patch("/:id", updateFlag);
router.delete("/:id", deleteFlag);
router.get("/evaluate", evaluateFlag);

export default router;
