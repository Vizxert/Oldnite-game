const express = require('express');
const crypto = require('crypto');
const { ENCRYPTION_KEYS } = require('../crypto');
const router = express.Router();

// Handle pakchunk encryption key requests
router.get('/pakchunk/:chunkId/key', (req, res) => {
    const chunkId = req.params.chunkId;
    
    // Set headers for libcurl compatibility
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Cache-Control', 'no-cache');
    
    let key = null;
    
    // Check for specific pakchunk keys
    if (chunkId === '1000') {
        key = ENCRYPTION_KEYS.pakchunk1000;
    } else if (chunkId === '1001') {
        key = ENCRYPTION_KEYS.pakchunk1001;
    } else {
        // Try to find key by name
        key = ENCRYPTION_KEYS[`pakchunk${chunkId}`] || 
              ENCRYPTION_KEYS[chunkId];
    }
    
    if (key) {
        console.log(`Providing encryption key for pakchunk${chunkId}`);
        res.json({
            keyId: `pakchunk${chunkId}`,
            key: key,
            status: 'success'
        });
    } else {
        console.log(`No encryption key found for pakchunk${chunkId}, providing default`);
        res.json({
            keyId: `pakchunk${chunkId}`,
            key: '00000000000000000000000000000000',
            status: 'default'
        });
    }
});

// Bulk pakchunk key endpoint
router.get('/pakchunk/keys', (req, res) => {
    res.header('Content-Type', 'application/json');
    res.header('Access-Control-Allow-Origin', '*');
    
    const pakchunkKeys = {};
    
    // Add all pakchunk keys
    Object.keys(ENCRYPTION_KEYS).forEach(keyName => {
        if (keyName.startsWith('pakchunk')) {
            pakchunkKeys[keyName] = ENCRYPTION_KEYS[keyName];
        }
    });
    
    console.log(`Providing ${Object.keys(pakchunkKeys).length} pakchunk keys`);
    res.json({
        keys: pakchunkKeys,
        count: Object.keys(pakchunkKeys).length
    });
});

module.exports = router;
