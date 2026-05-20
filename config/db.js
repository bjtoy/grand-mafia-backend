const { PrismaClient } = require("@prisma/client");
const { PrismaPostgreSQL } = require("@prisma/adapter-postgresql");

const adapter = new PrismaPostgreSQL(process.env.DATABASE_URL);

const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;
