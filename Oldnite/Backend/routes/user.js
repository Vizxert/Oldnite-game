const express = require('express');
const router = express.Router();

// Default user data for Season 7.00
const defaultUser = {
    id: 'default-account-id',
    displayName: 'Season7Player',
    name: 'Season7Player',
    email: 'player@season7.com',
    failedLoginAttempts: 0,
    lastLogin: new Date().toISOString(),
    numberOfDisplayNameChanges: 0,
    ageGroup: 'UNKNOWN',
    headless: false,
    country: 'US',
    lastName: 'Player',
    links: {},
    preferredLanguage: 'en',
    canUpdateDisplayName: false,
    tfaEnabled: false,
    emailVerified: true,
    minorVerified: false,
    minorExpected: false,
    minorStatus: 'UNKNOWN'
};

// Get user by account ID
router.get('/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    
    res.json({
        ...defaultUser,
        id: accountId
    });
});

// Get multiple users by account IDs
router.get('/', (req, res) => {
    const accountIds = req.query.accountId;
    
    if (Array.isArray(accountIds)) {
        const users = accountIds.map(id => ({
            ...defaultUser,
            id: id
        }));
        res.json(users);
    } else if (accountIds) {
        res.json([{
            ...defaultUser,
            id: accountIds
        }]);
    } else {
        res.json([]);
    }
});

// Get user by display name
router.get('/displayName/:displayName', (req, res) => {
    res.json({
        ...defaultUser,
        displayName: req.params.displayName
    });
});

// Search users by display name
router.get('/search/:displayName', (req, res) => {
    res.json([{
        ...defaultUser,
        displayName: req.params.displayName
    }]);
});

module.exports = router;