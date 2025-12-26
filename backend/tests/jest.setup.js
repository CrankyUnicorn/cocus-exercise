const path = require("path");
require("dotenv").config();

// set an absolute sqlite url for tests (ensures Prisma reads a "file:" URL)
process.env.DATABASE_URL =
  process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("file:")
    ? process.env.DATABASE_URL
    : `file:${path.join(__dirname, "..", "prisma", "dev.db")}`;