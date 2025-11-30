const express = require('express');
const router = express.Router();
const axios = require('axios');

// Discord OAuth2 Configuration
const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID || '1412133846362755103';
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET || 'QVEr_zt09aNVepT7H-64mMG1Ck7PbyEj';
const REDIRECT_URI = process.env.REDIRECT_URI || 'https://aise-bot.onrender.com/api/auth/discord/callback';
const CLIENT_URL = process.env.CLIENT_URL || 'https://portfolio-auth-25d88.web.app';

// 1. Redirect to Discord
router.get('/discord/login', (req, res) => {
    const url = `https://discord.com/api/oauth2/authorize?client_id=${DISCORD_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
    res.redirect(url);
});

// 2. Callback from Discord
router.get('/discord/callback', async (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.redirect(`${CLIENT_URL}/report?error=no_code`);
    }

    try {
        // Exchange code for token
        const tokenResponse = await axios.post(
            'https://discord.com/api/oauth2/token',
            new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI,
            }),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        const { access_token } = tokenResponse.data;

        // Fetch User Profile
        const userResponse = await axios.get('https://discord.com/api/users/@me', {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });

        const user = userResponse.data;

        // Redirect back to frontend with user data (In production, use a secure cookie or session)
        // For this prototype, passing via query params is acceptable but not best practice for sensitive data
        const userData = encodeURIComponent(JSON.stringify({
            id: user.id,
            username: `${user.username}#${user.discriminator}`,
            avatar: user.avatar
        }));

        res.redirect(`${CLIENT_URL}/report?discord_auth=${userData}`);

    } catch (error) {
        console.error('Discord Auth Error:', error.response?.data || error.message);
        res.redirect(`${CLIENT_URL}/report?error=auth_failed`);
    }
});

// Roblox routes removed as per request (Manual Input)

module.exports = router;
