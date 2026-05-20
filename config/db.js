const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  // Prisma 7 fallback mode — works with normal postgres:// URLs
  engine: "binary",
});

module.exports = prisma;
