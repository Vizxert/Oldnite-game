const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Friends system for Season 7.00
const friends = new Map();
const friendRequests = new Map();

// Get friends list
router.get('/public/friends/:accountId', (req, res) => {
    const accountId = req.params.accountId;
    const userFriends = friends.get(accountId) || [];
    
    res.json(userFriends.map(friend => ({
        accountId: friend.accountId,
        status: 'ACCEPTED',
        direction: 'OUTBOUND',
        created: friend.created || new Date().toISOString(),
        favorite: false
    })));
});

// Get friend requests
router.get('/public/blocklist/:accountId', (req, res) => {
    res.json({
        blockedUsers: []
    });
});

// Get recent players
router.get('/public/recent/:accountId', (req, res) => {
    res.json([]);
});

// Add friend
router.post('/public/friends/:accountId/:friendId', (req, res) => {
    const accountId = req.params.accountId;
    const friendId = req.params.friendId;
    
    let userFriends = friends.get(accountId) || [];
    
    // Check if already friends
    if (!userFriends.find(f => f.accountId === friendId)) {
        userFriends.push({
            accountId: friendId,
            created: new Date().toISOString()
        });
        friends.set(accountId, userFriends);
    }
    
    res.status(204).send();
});

// Remove friend
router.delete('/public/friends/:accountId/:friendId', (req, res) => {
    const accountId = req.params.accountId;
    const friendId = req.params.friendId;
    
    let userFriends = friends.get(accountId) || [];
    userFriends = userFriends.filter(f => f.accountId !== friendId);
    friends.set(accountId, userFriends);
    
    res.status(204).send();
});

module.exports = router;