const prisma = require("../config/db");

module.exports = {
  async getAll() {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        discordId: true,
        createdAt: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return users;
  },

  async getById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        discordId: true,
        createdAt: true
      }
    });

    return user || null;
  },

  async create(username, email, passwordHash) {
    // Your schema does NOT have email or passwordHash.
    // For now, we only save username + a generated discordId placeholder.
    // Later we can expand the schema.

    const newUser = await prisma.user.create({
      data: {
        username,
        discordId: `placeholder_${Date.now()}`
      }
    });

    return newUser.id;
  },

  async update(id, username, email, passwordHash) {
    // Again, schema does not support email/passwordHash yet.
    // Only username can be updated.

    const updated = await prisma.user.update({
      where: { id },
      data: {
        username
      }
    });

    return !!updated;
  },

  async remove(id) {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (err) {
      // If user doesn't exist, Prisma throws an error
      return false;
    }
  }
};
