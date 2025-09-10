// SSL Certificate bypass for Fortnite Season 7.00 libcurl
const https = require('https');
const tls = require('tls');
const http = require('http');

// Disable SSL verification globally for libcurl compatibility
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

// Create a custom HTTPS agent that bypasses SSL verification
const createBypassAgent = () => {
    return new https.Agent({
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
        secureProtocol: 'TLSv1_2_method',
        requestCert: false,
        agent: false
    });
};

// Override default TLS settings for Fortnite libcurl compatibility
const originalCreateSecureContext = tls.createSecureContext;
tls.createSecureContext = function(options) {
    const context = originalCreateSecureContext.call(this, {
        ...options,
        secureProtocol: 'TLSv1_2_method',
        ciphers: 'ALL:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA',
        honorCipherOrder: false,
        requestCert: false,
        rejectUnauthorized: false
    });
    return context;
};

// Middleware to handle SSL bypass for Fortnite libcurl requests
const sslBypassMiddleware = (req, res, next) => {
    // Set headers for libcurl compatibility
    res.header('X-SSL-Bypass', 'active');
    res.header('X-Fortnite-Compatible', 'true');
    res.header('X-Libcurl-Compatible', 'true');
    
    // Disable SSL verification headers
    res.header('Strict-Transport-Security', 'max-age=0');
    res.header('X-Content-Type-Options', 'nosniff');
    res.header('X-Frame-Options', 'DENY');
    
    // Handle libcurl specific headers
    if (req.headers['user-agent'] && (req.headers['user-agent'].includes('libcurl') || req.headers['user-agent'].includes('Fortnite'))) {
        res.header('Connection', 'keep-alive');
        res.header('Keep-Alive', 'timeout=5, max=1000');
    }
    
    next();
};

// Force HTTP instead of HTTPS for local development
const forceHttpMiddleware = (req, res, next) => {
    if (req.headers['x-forwarded-proto'] === 'https') {
        req.headers['x-forwarded-proto'] = 'http';
    }
    next();
};

module.exports = {
    createBypassAgent,
    sslBypassMiddleware,
    forceHttpMiddleware
};
