const crypto = require('crypto');

// Season 7.00 Encryption Keys
const ENCRYPTION_KEYS = {
    // Main key from your screenshot
    'main': '0x9342FF7507B9502F08DA069431876241436FC556F1AE2E285F96D143FC88DC',
    
    // Dynamic keys for pakchunks from log file
    'pakchunk1000': 'F7CAA8D040108722FFA35FAA63DFD63E',
    'pakchunk1001': 'F32262244DE021E18BF22F9BF7594474',
    
    // Additional keys from your screenshot
    'pakchunk1000_full': '0x58DC1859A90FA1EFC11B123CFB1B01E38EB31EFE11F40D64AF3F122B6CBC3E67F7CAA8D040108722FFA35FAA63DFD63E',
    'pakchunk1001_full': '0xD3C1C4ADD2AF055E7C4AD0C88C1F70BED63AEF97AEED92B706C32904C2AF4AB3F32262244DE021E18BF22F9BF7594474'
};

// Generate encryption key response for Fortnite
function generateKeyResponse(keyName) {
    const key = ENCRYPTION_KEYS[keyName];
    if (!key) {
        return null;
    }
    
    return {
        keyName: keyName,
        key: key,
        timestamp: new Date().toISOString()
    };
}

// Get all encryption keys
function getAllKeys() {
    return Object.keys(ENCRYPTION_KEYS).map(keyName => ({
        name: keyName,
        key: ENCRYPTION_KEYS[keyName],
        guid: keyName.toUpperCase()
    }));
}

// Validate encryption key format
function validateKey(key) {
    // Remove 0x prefix if present
    const cleanKey = key.replace(/^0x/, '');
    
    // Check if it's a valid hex string
    return /^[0-9A-Fa-f]+$/.test(cleanKey) && cleanKey.length >= 32;
}

module.exports = {
    ENCRYPTION_KEYS,
    generateKeyResponse,
    getAllKeys,
    validateKey
};
