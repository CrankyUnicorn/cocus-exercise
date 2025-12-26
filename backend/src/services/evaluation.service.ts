import crypto from "crypto";

export function isFlagActive(
  enabled: boolean,
  rolloutPercentage: number,
  userId: string
): boolean {
  if (!enabled) return false;

  const hash = crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex");

  const bucket = parseInt(hash.substring(0, 8), 16) % 100;
  return bucket < rolloutPercentage;
}
