const express = require('express');
const router = express.Router();

// Main routes for Season 7.00 Backend
router.get('/', (req, res) => {
    res.json({
        message: 'Fortnite Season 7.00 Backend Server',
        version: '7.00',
        status: 'online',
        endpoints: {
            authentication: '/account/api/oauth/*',
            cloudstorage: '/fortnite/api/cloudstorage/*',
            friends: '/friends/api/*',
            lightswitch: '/lightswitch/api/*',
            mcp: '/fortnite/api/game/v2/profile/*',
            matchmaking: '/fortnite/api/matchmaking/*',
            storefront: '/fortnite/api/storefront/*',
            users: '/account/api/public/account/*'
        }
    });
});

// Health check endpoint
router.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Version endpoint
router.get('/version', (req, res) => {
    res.json({
        season: 7,
        version: '7.00',
        build: '1870186'
    });
});

module.exports = router;