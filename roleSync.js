// ============================================
// ROLE SYNC ENGINE (SECTION D)
// Maps Discord roles → Internal roles
// Syncs member + member_roles tables
// ============================================

const pool = require('./config/db');
const INTERNAL_ROLES = require('./config/roles');

// ============================================
// DISCORD → INTERNAL ROLE MAP
// (You will update these IDs to match your server)
// ============================================

const DISCORD_ROLE_MAP = {
    Admin: process.env.ADMIN_ROLE_ID,
    Mod: process.env.MODERATOR_ROLE_ID,
    Enforcer: process.env.ENFORCER_ROLE_ID,
    Scout: process.env.SCOUT_ROLE_ID,
    Member: process.env.MEMBER_ROLE_ID
};

// ============================================
// 1. Convert Discord role IDs → Internal roles
// ============================================

function mapDiscordRolesToInternal(discordRoleIds = []) {
    const internalRoles = [];

    for (const [internalName, discordId] of Object.entries(DISCORD_ROLE_MAP)) {
        if (discordRoleIds.includes(discordId)) {
            internalRoles.push(internalName);
        }
    }

    // Always guarantee Member at minimum
    if (!internalRoles.includes('Member')) {
        internalRoles.push('Member');
    }

    return internalRoles;
}

// ============================================
// 2. Ensure internal roles exist in DB
// ============================================

async function ensureRolesExist() {
    const internalRoleNames = Object.keys(INTERNAL_ROLES);

    for (const roleName of internalRoleNames) {
        const [rows] = await pool.query(
            'SELECT id FROM roles WHERE name = ?',
            [roleName]
        );

        if (rows.length === 0) {
            await pool.query(
                'INSERT INTO roles (name) VALUES (?)',
                [roleName]
            );
            console.log(`✔ Created missing role in DB: ${roleName}`);
        }
    }
}

// ============================================
// 3. Sync a single member’s roles
// ============================================

async function syncMemberRoles(discordId, discordRoleIds = []) {
    try {
        // Ensure roles table is correct
        await ensureRolesExist();

        // Map Discord → Internal
        const internalRoles = mapDiscordRolesToInternal(discordRoleIds);

        // Ensure member exists
        const [members] = await pool.query(
            'SELECT * FROM members WHERE discordId = ?',
            [discordId]
        );

        let memberId;

        if (members.length === 0) {
            // Auto-create member if missing
            const [result] = await pool.query(
                'INSERT INTO members (username, discordId) VALUES (?, ?)',
                ['Unknown', discordId]
            );
            memberId = result.insertId;
        } else {
            memberId = members[0].id;
        }

        // Clear old roles
        await pool.query(
            'DELETE FROM member_roles WHERE memberId = ?',
            [memberId]
        );

        // Insert new roles
        for (const roleName of internalRoles) {
            const [roleRows] = await pool.query(
                'SELECT id FROM roles WHERE name = ?',
                [roleName]
            );

            if (roleRows.length > 0) {
                await pool.query(
                    'INSERT INTO member_roles (memberId, roleId) VALUES (?, ?)',
                    [memberId, roleRows[0].id]
                );
            }
        }

        console.log(`✔ Synced roles for member ${discordId}: ${internalRoles.join(', ')}`);
        return internalRoles;

    } catch (error) {
        console.error('❌ Error syncing member roles:', error);
        return [];
    }
}

// ============================================
// 4. Sync ALL members (used on bot startup)
// ============================================

async function syncAllMembers(discordMembers) {
    for (const member of discordMembers.values()) {
        const discordId = member.id;
        const discordRoleIds = member.roles.cache.map(r => r.id);

        await syncMemberRoles(discordId, discordRoleIds);
    }

    console.log('✔ Completed full member role sync');
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
    syncMemberRoles,
    syncAllMembers,
    mapDiscordRolesToInternal,
    ensureRolesExist
};
