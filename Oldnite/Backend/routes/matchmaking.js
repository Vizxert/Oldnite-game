const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Active matchmaking sessions
const matchmakingSessions = new Map();

// Matchmaking session endpoint
router.get('/session/findPlayer/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    
    // Create or get existing session
    let session = matchmakingSessions.get(accountId);
    if (!session) {
        session = {
            id: uuidv4(),
            accountId: accountId,
            playlist: 'playlist_defaultsolo',
            region: 'NAE',
            status: 'Waiting',
            created: new Date().toISOString()
        };
        matchmakingSessions.set(accountId, session);
    }
    
    res.json({
        id: session.id,
        ownerId: accountId,
        ownerName: '[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968',
        serverName: '',
        serverAddress: '127.0.0.1',
        serverPort: 7777,
        maxPublicPlayers: 220,
        openPublicPlayers: 175,
        maxPrivatePlayers: 0,
        openPrivatePlayers: 0,
        attributes: {
            REGION_s: 'NAE',
            GAMEMODE_s: 'FORTATHENA',
            ALLOWBROADCASTING_b: true,
            SUBREGION_s: 'GB',
            DCID_s: 'FORTNITE-LIVEEUGCEC1C2E30UBRCORE0A-14840880',
            tenant_s: 'Fortnite',
            MATCHMAKINGPOOL_s: 'Any',
            STORMSHIELDDEFENSETYPE_i: 0,
            HOTFIXVERSION_i: 0,
            PLAYLISTNAME_s: 'Playlist_DefaultSolo',
            SESSIONKEY_s: uuidv4(),
            TENANT_s: 'Fortnite',
            BEACONPORT_i: 15009
        },
        publicPlayers: [],
        privatePlayers: [],
        totalPlayers: 45,
        allowJoinInProgress: false,
        shouldAdvertise: false,
        isDedicated: false,
        usesStats: false,
        allowInvites: false,
        usesPresence: false,
        allowJoinViaPresence: true,
        allowJoinViaPresenceFriendsOnly: false,
        buildUniqueId: '1870186',
        lastUpdated: new Date().toISOString(),
        started: false
    });
});

// Join matchmaking session
router.post('/session/:sessionId/join', (req, res) => {
    res.status(204).send();
});

// Leave matchmaking session  
router.post('/session/:sessionId/leave', (req, res) => {
    res.status(204).send();
});

// Get session by ID
router.get('/session/:sessionId', (req, res) => {
    const sessionId = req.params.sessionId;
    
    // Find session by ID
    for (const [accountId, session] of matchmakingSessions.entries()) {
        if (session.id === sessionId) {
            return res.json({
                id: session.id,
                ownerId: accountId,
                ownerName: '[DS]fortnite-liveeugcec1c2e30ubrcore0a-z8hj-1968',
                serverName: '',
                serverAddress: '127.0.0.1',
                serverPort: 7777,
                maxPublicPlayers: 220,
                openPublicPlayers: 175,
                attributes: {
                    REGION_s: 'NAE',
                    GAMEMODE_s: 'FORTATHENA',
                    PLAYLISTNAME_s: 'Playlist_DefaultSolo'
                },
                started: false
            });
        }
    }
    
    res.status(404).json({ error: 'Session not found' });
});

module.exports = router;