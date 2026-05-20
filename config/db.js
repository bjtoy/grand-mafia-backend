// ============================================
// PRISMA DATABASE CLIENT (NEON POSTGRES)
// ============================================

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Create a single Prisma client instance
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error']
});

// Test connection on startup (optional but helpful)
async function testConnection() {
    try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('✔ Prisma connected to Neon Postgres');
    } catch (err) {
        console.error('❌ Prisma failed to connect:', err);
    }
}

testConnection();

module.exports = prisma;
