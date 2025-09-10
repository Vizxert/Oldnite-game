const express = require('express');
const { ENCRYPTION_KEYS, validateKey } = require('../crypto');
const router = express.Router();

// Fortnite encryption key service endpoints
router.get('/api/v1/key/:keyId', (req, res) => {
    const keyId = req.params.keyId;
    
    // Set proper headers for Fortnite client
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    
    // Check if we have this key
    const key = ENCRYPTION_KEYS[keyId.toLowerCase()] || 
                ENCRYPTION_KEYS['pakchunk' + keyId.toLowerCase()] ||
                ENCRYPTION_KEYS[keyId];
    
    if (key) {
        res.json({
            keyId: keyId,
            key: key,
            status: 'success'
        });
    } else {
        // Return a default key to prevent crashes
        res.json({
            keyId: keyId,
            key: '00000000000000000000000000000000',
            status: 'default'
        });
    }
});

// Bulk key endpoint
router.get('/api/v1/keys', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    
    const allKeys = {};
    
    // Add all our encryption keys
    Object.keys(ENCRYPTION_KEYS).forEach(keyName => {
        allKeys[keyName] = ENCRYPTION_KEYS[keyName];
    });
    
    res.json({
        keys: allKeys,
        count: Object.keys(allKeys).length
    });
});

// Key registration for missing keys
router.post('/api/v1/key/register', (req, res) => {
    const { keyId, key } = req.body;
    
    if (keyId && key && validateKey(key)) {
        ENCRYPTION_KEYS[keyId] = key;
        console.log(`Registered new encryption key: ${keyId}`);
        
        res.json({
            success: true,
            keyId: keyId,
            message: 'Key registered successfully'
        });
    } else {
        res.status(400).json({
            success: false,
            error: 'Invalid key data'
        });
    }
});

module.exports = router;
