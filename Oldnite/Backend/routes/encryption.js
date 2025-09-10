const express = require('express');
const crypto = require('./crypto');
const router = express.Router();

// Get encryption keys endpoint
router.get('/keys', (req, res) => {
    const keys = crypto.getAllKeys();
    res.json({
        keys: keys,
        count: keys.length,
        timestamp: new Date().toISOString()
    });
});

// Get specific encryption key
router.get('/keys/:keyName', (req, res) => {
    const keyName = req.params.keyName.toLowerCase();
    const keyResponse = crypto.generateKeyResponse(keyName);
    
    if (!keyResponse) {
        return res.status(404).json({
            error: 'Key not found',
            keyName: keyName
        });
    }
    
    res.json(keyResponse);
});

// Register encryption key (for dynamic key registration)
router.post('/keys/register', (req, res) => {
    const { keyName, key } = req.body;
    
    if (!keyName || !key) {
        return res.status(400).json({
            error: 'Missing keyName or key'
        });
    }
    
    if (!crypto.validateKey(key)) {
        return res.status(400).json({
            error: 'Invalid key format'
        });
    }
    
    // In a real implementation, you'd store this in a database
    crypto.ENCRYPTION_KEYS[keyName.toLowerCase()] = key;
    
    res.json({
        success: true,
        keyName: keyName,
        message: 'Key registered successfully'
    });
});

module.exports = router;
