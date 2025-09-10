const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Cloud storage system files
router.get('/system', (req, res) => {
    const cloudStoragePath = path.join(__dirname, '../../Cloudstorage');
    
    // Set headers for libcurl compatibility
    res.header('Content-Type', 'application/json');
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    
    try {
        const files = [];
        
        // Read all .ini files from cloudstorage directory
        const configFiles = ['DefaultEngine.ini', 'DefaultGame.ini', 'DefaultInput.ini'];
        
        configFiles.forEach(filename => {
            const filePath = path.join(cloudStoragePath, filename);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const stats = fs.statSync(filePath);
                const hash256 = require('crypto').createHash('sha256').update(content).digest('hex');
                
                files.push({
                    uniqueFilename: filename,
                    filename: filename,
                    hash: hash256,
                    hash256: hash256,
                    length: content.length,
                    contentType: 'application/octet-stream',
                    uploaded: stats.mtime.toISOString(),
                    storageType: 'S3',
                    storageIds: {},
                    doNotCache: true
                });
            }
        });
        
        console.log(`Cloud storage system files requested: ${files.length} files found`);
        res.json(files);
    } catch (error) {
        console.error('Cloud storage error:', error);
        res.status(500).json({ error: 'Failed to read cloud storage files' });
    }
});

// Get specific cloud storage file
router.get('/system/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../../Cloudstorage', filename);
    
    // Set proper headers for .ini files
    res.header('Content-Type', 'application/octet-stream');
    res.header('Cache-Control', 'no-cache');
    res.header('Access-Control-Allow-Origin', '*');
    
    if (fs.existsSync(filePath)) {
        console.log(`Serving cloud storage file: ${filename}`);
        res.sendFile(path.resolve(filePath));
    } else {
        console.log(`Cloud storage file not found: ${filename}`);
        res.status(404).json({ error: 'File not found' });
    }
});

// User cloud storage (empty for Season 7.00)
router.get('/user/:accountId', (req, res) => {
    res.json([]);
});

// User cloud storage file operations
router.get('/user/:accountId/:filename', (req, res) => {
    res.status(404).json({ error: 'User file not found' });
});

router.put('/user/:accountId/:filename', (req, res) => {
    // For Season 7.00, we don't store user files
    res.status(204).send();
});

router.delete('/user/:accountId/:filename', (req, res) => {
    res.status(204).send();
});

module.exports = router;