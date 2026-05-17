// ============================================
// DATABASE PLACEHOLDER (OPTION C - CLEAN REBUILD)
// ============================================
//
// This file exists ONLY to keep the backend stable while we rebuild.
// In Option C, the dashboard will eventually pull LIVE data from your bot
// and Discord API instead of a SQL database.
//
// These placeholder functions prevent crashes and allow the dashboard UI
// to load without errors.
//
// When we integrate your bot, each function will be replaced with
// real logic that talks directly to Discord.
//
// ============================================

module.exports = {
    // Members
    getMembers: async () => [],
    getMemberById: async () => null,
    updateMember: async () => null,
    deleteMember: async () => null,
    getTotalMembers: async () => 0,

    // Guides
    getGuides: async () => [],
    getGuideById: async () => null,
    createGuide: async () => null,
    updateGuide: async () => null,
    deleteGuide: async () => null,
    getTotalGuides: async () => 0,

    // Announcements
    getAnnouncements: async () => [],
    createAnnouncement: async () => null,
    deleteAnnouncement: async () => null,

    // Roles
    getRoles: async () => [],
    getRoleById: async () => null,
    createRole: async () => null,
    updateRole: async () => null,
    deleteRole: async () => null,
    assignRoleToMember: async () => null,
    removeRoleFromMember: async () => null,

    // Moderation
    getModerationLog: async () => [],
    addModerationAction: async () => null,
    getTotalModerations: async () => 0,

    // Channel Permissions
    getChannelPermissions: async () => [],
    setChannelPermission: async () => null,

    // Statistics
    getTotalMessages: async () => 0,

    // Settings
    getSettings: async () => ({}),
    updateSettings: async (updates) => updates
};
