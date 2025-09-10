const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory storage for tokens and users
const tokens = new Map();
const users = new Map();

// Default user for Season 7.00
const defaultUser = {
    accountId: 'default-account-id',
    displayName: 'Season7Player',
    email: 'player@season7.com'
};

// OAuth token endpoint
router.post('/token', (req, res) => {
    const { grant_type, username, password, client_id } = req.body;
    
    console.log('Token request:', { grant_type, username, client_id });
    
    // Set CORS headers for Fortnite client
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (grant_type === 'password') {
        // Generate access token
        const accessToken = uuidv4();
        const refreshToken = uuidv4();
        const accountId = defaultUser.accountId;
        
        // Store token
        tokens.set(accessToken, {
            accountId,
            expires: Date.now() + (8 * 60 * 60 * 1000), // 8 hours
            type: 'bearer'
        });
        
        // Store user if not exists
        if (!users.has(accountId)) {
            users.set(accountId, defaultUser);
        }
        
        res.json({
            access_token: accessToken,
            expires_in: 28800,
            expires_at: new Date(Date.now() + 28800000).toISOString(),
            token_type: 'bearer',
            refresh_token: refreshToken,
            refresh_expires: 86400,
            refresh_expires_at: new Date(Date.now() + 86400000).toISOString(),
            account_id: accountId,
            client_id: client_id || 'ec684b8c687f479fadea3cb2ad83f5c6',
            internal_client: true,
            client_service: 'fortnite',
            displayName: defaultUser.displayName,
            app: 'fortnite',
            in_app_id: accountId,
            device_id: uuidv4(),
            product_id: 'prod-fn',
            sandbox_id: 'fn'
        });
    } else if (grant_type === 'client_credentials') {
        // Client credentials flow
        const accessToken = uuidv4();
        
        tokens.set(accessToken, {
            type: 'client',
            expires: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        });
        
        res.json({
            access_token: accessToken,
            expires_in: 86400,
            expires_at: new Date(Date.now() + 86400000).toISOString(),
            token_type: 'bearer',
            client_id: client_id || 'ec684b8c687f479fadea3cb2ad83f5c6',
            internal_client: true,
            client_service: 'fortnite',
            product_id: 'prod-fn',
            sandbox_id: 'fn'
        });
    } else if (grant_type === 'exchange_code') {
        // Exchange code flow for Season 7.00
        const accessToken = uuidv4();
        const refreshToken = uuidv4();
        const accountId = defaultUser.accountId;
        
        tokens.set(accessToken, {
            accountId,
            expires: Date.now() + (8 * 60 * 60 * 1000), // 8 hours
            type: 'bearer'
        });
        
        if (!users.has(accountId)) {
            users.set(accountId, defaultUser);
        }
        
        res.json({
            access_token: accessToken,
            expires_in: 28800,
            expires_at: new Date(Date.now() + 28800000).toISOString(),
            token_type: 'bearer',
            refresh_token: refreshToken,
            refresh_expires: 86400,
            refresh_expires_at: new Date(Date.now() + 86400000).toISOString(),
            account_id: accountId,
            client_id: client_id || 'ec684b8c687f479fadea3cb2ad83f5c6',
            internal_client: true,
            client_service: 'fortnite',
            displayName: defaultUser.displayName,
            app: 'fortnite',
            in_app_id: accountId,
            device_id: uuidv4(),
            product_id: 'prod-fn',
            sandbox_id: 'fn'
        });
    } else {
        res.status(400).json({
            error: 'unsupported_grant_type',
            error_description: 'Unsupported grant type'
        });
    }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'invalid_token',
            error_description: 'Token not provided'
        });
    }
    
    const token = authHeader.substring(7);
    const tokenData = tokens.get(token);
    
    if (!tokenData || tokenData.expires < Date.now()) {
        return res.status(401).json({
            error: 'invalid_token',
            error_description: 'Token expired or invalid'
        });
    }
    
    if (tokenData.type === 'client') {
        return res.json({
            token: token,
            session_id: uuidv4(),
            token_type: 'bearer',
            client_id: 'ec684b8c687f479fadea3cb2ad83f5c6',
            internal_client: true,
            client_service: 'fortnite'
        });
    }
    
    const user = users.get(tokenData.accountId);
    
    res.json({
        token: token,
        session_id: uuidv4(),
        token_type: 'bearer',
        client_id: 'ec684b8c687f479fadea3cb2ad83f5c6',
        internal_client: true,
        client_service: 'fortnite',
        account_id: tokenData.accountId,
        expires_in: Math.floor((tokenData.expires - Date.now()) / 1000),
        expires_at: new Date(tokenData.expires).toISOString(),
        auth_method: 'password',
        display_name: user?.displayName || 'Season7Player',
        app: 'fortnite',
        in_app_id: tokenData.accountId
    });
});

// Kill token endpoint
router.delete('/sessions/kill', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        tokens.delete(token);
    }
    
    res.status(204).send();
});

// Kill all tokens endpoint
router.delete('/sessions/kill/*', (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const tokenData = tokens.get(token);
        
        if (tokenData && tokenData.accountId) {
            // Remove all tokens for this account
            for (const [key, value] of tokens.entries()) {
                if (value.accountId === tokenData.accountId) {
                    tokens.delete(key);
                }
            }
        }
    }
    
    res.status(204).send();
});

module.exports = router;