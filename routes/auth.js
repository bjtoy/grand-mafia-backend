// ============================================
// DISCORD OAUTH2 AUTHENTICATION ROUTES
// ============================================

const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

// ============================================
// DISCORD CONFIG
// ============================================

const DISCORD_API = 'https://discord.com/api/v10';

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI =
    process.env.DISCORD_REDIRECT_URI || 'http://localhost:3000/api/auth/callback';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// ============================================
// LOGIN ROUTE
// ============================================

router.get('/login', (req, res) => {
    const scope = ['identify', 'email', 'guilds'];
    const permissions = '8'; // Admin permission

    const authUrl =
        `${DISCORD_API}/oauth2/authorize?client_id=${CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&response_type=code&scope=${scope.join('%20')}&permissions=${permissions}`;

    res.redirect(authUrl);
});

// ============================================
// OAUTH CALLBACK
// ============================================

router.get('/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ error: 'No authorization code provided' });
    }

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post(
            `${DISCORD_API}/oauth2/token`,
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
                scope: 'identify email guilds'
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token, refresh_token } = tokenResponse.data;

        // Fetch user info
        const userResponse = await axios.get(`${DISCORD_API}/users/@me`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const user = userResponse.data;

        // Fetch user guilds
        const guildsResponse = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const guilds = guildsResponse.data;

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                email: user.email,
                avatar: user.avatar
            },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Store session
        req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            accessToken: access_token,
            refreshToken: refresh_token,
            guilds
        };

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Redirect to dashboard
        res.redirect('/');
    } catch (err) {
        console.error('OAuth callback error:', err.message);
        res.status(500).json({ error: 'Authentication failed' });
    }
});

// ============================================
// GET CURRENT USER
// ============================================

router.get('/me', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json({
        user: {
            id: req.session.user.id,
            username: req.session.user.username,
            email: req.session.user.email,
            avatar: req.session.user.avatar,
            guilds: req.session.user.guilds
        }
    });
});

// ============================================
// LOGOUT
// ============================================

router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.clearCookie('token');
        res.json({ message: 'Logged out successfully' });
    });
});

// ============================================
// REFRESH TOKEN
// ============================================

router.post('/refresh', async (req, res) => {
    if (!req.session.user?.refreshToken) {
        return res.status(401).json({ error: 'No refresh token available' });
    }

    try {
        const tokenResponse = await axios.post(
            `${DISCORD_API}/oauth2/token`,
            new URLSearchParams({
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: req.session.user.refreshToken
            }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        const { access_token, refresh_token } = tokenResponse.data;

        req.session.user.accessToken = access_token;
        req.session.user.refreshToken = refresh_token;

        res.json({ message: 'Token refreshed' });
    } catch (err) {
        console.error('Token refresh error:', err.message);
        res.status(500).json({ error: 'Token refresh failed' });
    }
});

// ============================================
// GET USER GUILDS
// ============================================

router.get('/guilds', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const guildsResponse = await axios.get(`${DISCORD_API}/users/@me/guilds`, {
            headers: { Authorization: `Bearer ${req.session.user.accessToken}` }
        });

        res.json({ guilds: guildsResponse.data });
    } catch (err) {
        console.error('Get guilds error:', err.message);
        res.status(500).json({ error: 'Failed to fetch guilds' });
    }
});

module.exports = router;
