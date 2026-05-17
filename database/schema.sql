USE grand_mafia_bot;
-- ============================================
-- GRAND MAFIA BOT - DATABASE SCHEMA
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    avatar VARCHAR(255),
    discriminator VARCHAR(10),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- ============================================
-- MEMBERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discordId VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    avatar VARCHAR(255),
    role VARCHAR(100) DEFAULT 'member',
    joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastSeen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    notes TEXT,
    warnings INT DEFAULT 0,
    muted BOOLEAN DEFAULT FALSE,
    banned BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_discordId (discordId),
    INDEX idx_username (username),
    INDEX idx_role (role),
    INDEX idx_banned (banned)
);

-- ============================================
-- ROLES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(7) DEFAULT '#808080',
    permissions JSON,
    memberCount INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- ============================================
-- MEMBER ROLES TABLE (Junction)
-- ============================================

CREATE TABLE IF NOT EXISTS member_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memberId INT NOT NULL,
    roleId INT NOT NULL,
    assignedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assignedBy VARCHAR(255),
    FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_member_role (memberId, roleId),
    INDEX idx_memberId (memberId),
    INDEX idx_roleId (roleId)
);

-- ============================================
-- CHANNELS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    discordChannelId VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_discordChannelId (discordChannelId),
    INDEX idx_name (name),
    INDEX idx_category (category)
);

-- ============================================
-- CHANNEL PERMISSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS channel_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    channelId INT NOT NULL,
    roleId INT NOT NULL,
    canView BOOLEAN DEFAULT FALSE,
    canSend BOOLEAN DEFAULT FALSE,
    canManage BOOLEAN DEFAULT FALSE,
    canDelete BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (channelId) REFERENCES channels(id) ON DELETE CASCADE,
    FOREIGN KEY (roleId) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_channel_role (channelId, roleId),
    INDEX idx_channelId (channelId),
    INDEX idx_roleId (roleId)
);

-- ============================================
-- GUIDES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS guides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    content LONGTEXT NOT NULL,
    style VARCHAR(50) DEFAULT 'formatted',
    author VARCHAR(255) NOT NULL,
    views INT DEFAULT 0,
    likes INT DEFAULT 0,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    publishedAt TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_category (category),
    INDEX idx_author (author),
    INDEX idx_publishedAt (publishedAt)
);

-- ============================================
-- GUIDE VERSIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS guide_versions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    guideId INT NOT NULL,
    content LONGTEXT NOT NULL,
    author VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (guideId) REFERENCES guides(id) ON DELETE CASCADE,
    INDEX idx_guideId (guideId),
    INDEX idx_createdAt (createdAt)
);

-- ============================================
-- ANNOUNCEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS announcements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message LONGTEXT NOT NULL,
    channel VARCHAR(255) NOT NULL,
    color VARCHAR(7) DEFAULT '#FF6B6B',
    author VARCHAR(255) NOT NULL,
    posted BOOLEAN DEFAULT FALSE,
    postedAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_channel (channel),
    INDEX idx_author (author),
    INDEX idx_posted (posted)
);

-- ============================================
-- MODERATION LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS moderation_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    targetUser VARCHAR(255) NOT NULL,
    targetUserId INT,
    moderator VARCHAR(255) NOT NULL,
    moderatorId INT,
    reason TEXT,
    duration INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (targetUserId) REFERENCES members(id) ON DELETE SET NULL,
    FOREIGN KEY (moderatorId) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_action (action),
    INDEX idx_targetUser (targetUser),
    INDEX idx_moderator (moderator),
    INDEX idx_createdAt (createdAt)
);

-- ============================================
-- WARNINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS warnings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memberId INT NOT NULL,
    reason TEXT NOT NULL,
    issuedBy VARCHAR(255) NOT NULL,
    issuedById INT,
    expiresAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (issuedById) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_memberId (memberId),
    INDEX idx_expiresAt (expiresAt)
);

-- ============================================
-- MUTES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS mutes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memberId INT NOT NULL,
    reason TEXT,
    mutedBy VARCHAR(255) NOT NULL,
    mutedById INT,
    expiresAt TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (mutedById) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_memberId (memberId),
    INDEX idx_expiresAt (expiresAt)
);

-- ============================================
-- BANS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS bans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    memberId INT NOT NULL,
    reason TEXT,
    bannedBy VARCHAR(255) NOT NULL,
    bannedById INT,
    expiresAt TIMESTAMP,
    permanent BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (memberId) REFERENCES members(id) ON DELETE CASCADE,
    FOREIGN KEY (bannedById) REFERENCES members(id) ON DELETE SET NULL,
    INDEX idx_memberId (memberId),
    INDEX idx_permanent (permanent),
    INDEX idx_expiresAt (expiresAt)
);

-- ============================================
-- TRANSLATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS translations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    originalText LONGTEXT NOT NULL,
    translatedText LONGTEXT NOT NULL,
    sourceLanguage VARCHAR(10) NOT NULL,
    targetLanguage VARCHAR(10) NOT NULL,
    requestedBy VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_sourceLanguage (sourceLanguage),
    INDEX idx_targetLanguage (targetLanguage)
);

-- ============================================
-- SERVER SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS server_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    value LONGTEXT,
    type VARCHAR(50) DEFAULT 'string',
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key)
);


-- ============================================
-- ACTIVITY LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS activity_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    details JSON,
    ipAddress VARCHAR(45),
    userAgent TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_userId (userId),
    INDEX idx_action (action),
    INDEX idx_createdAt (createdAt)
);

-- ============================================
-- AUDIT LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS audit_log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    entityType VARCHAR(100) NOT NULL,
    entityId INT,
    action VARCHAR(100) NOT NULL,
    changes JSON,
    performedBy VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_entityType (entityType),
    INDEX idx_action (action),
    INDEX idx_performedBy (performedBy),
    INDEX idx_createdAt (createdAt)
);

-- ============================================
-- DEFAULT ROLES
-- ============================================

INSERT IGNORE INTO roles (name, color, permissions) VALUES
('Admin', '#FF0000', '["*"]'),
('Moderator', '#FF6B6B', '["kick", "ban", "mute", "warn"]'),
('Enforcer', '#FFA94D', '["manage_messages", "manage_roles"]'),
('Scout', '#4ECDC4', '["send_messages", "read_messages"]'),
('Member', '#74C0FC', '["send_messages", "read_messages"]');

-- ============================================
-- DEFAULT CHANNELS
-- ============================================

INSERT IGNORE INTO channels (discordChannelId, name, category, description) VALUES
('general-chat', 'general-chat', 'General Communication', 'General chat for all members'),
('game-chat', 'game-chat', 'General Communication', 'Game-related discussions'),
('announcements', 'announcements', 'Information and rules', 'Important announcements'),
('guides', 'guides', 'Game Guides', 'Game guides and strategies');

-- ============================================
-- DEFAULT SETTINGS
-- ============================================

INSERT IGNORE INTO server_settings (setting_key, value, type) VALUES
('server_name', 'Grand Mafia', 'string'),
('bot_prefix', '!', 'string'),
('default_language', 'en', 'string'),
('timezone', 'UTC', 'string'),
('enable_auto_moderation', 'true', 'boolean'),
('enable_announcements', 'true', 'boolean'),
('enable_translation', 'true', 'boolean'),
('enable_guides', 'true', 'boolean'),
('enable_roles', 'true', 'boolean'),
('max_warnings', '3', 'number'),
('warning_expiry_days', '30', 'number');

