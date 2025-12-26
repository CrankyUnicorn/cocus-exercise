import dotenv from "dotenv";
import path from "path";
dotenv.config();

// Normalize DATABASE_URL so it always has the `file:` scheme and an absolute path
const raw = process.env.DATABASE_URL || "file:./prisma/dev.db";
let dbUrl = raw;

if (!raw.startsWith("file:")) {
  // raw might be relative like ./prisma/dev.db or a bare path; resolve to absolute
  const resolved = path.isAbsolute(raw) ? raw : path.resolve(raw);
  dbUrl = `file:${resolved}`;
} else {
  // has file: prefix — ensure path after `file:` is absolute
  const after = raw.slice("file:".length);
  const resolved = path.isAbsolute(after) ? after : path.resolve(after);
  dbUrl = `file:${resolved}`;
}

process.env.DATABASE_URL = dbUrl;

import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export default prisma;
