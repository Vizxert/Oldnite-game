const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { sslBypassMiddleware, forceHttpMiddleware } = require('./ssl-bypass');

// Import route handlers
const authRoutes = require('./routes/Auth');
const cloudstorageRoutes = require('./routes/cloudstorage');
const friendsRoutes = require('./routes/friends');
const lightswitchRoutes = require('./routes/lightswitch');
const mainRoutes = require('./routes/main');
const matchmakingRoutes = require('./routes/matchmaking');
const mcpRoutes = require('./routes/mcp');
const storefrontRoutes = require('./routes/storefront');
const userRoutes = require('./routes/user');
const encryptionRoutes = require('./routes/encryption');
const keyserviceRoutes = require('./routes/keyservice');
const pakchunkRoutes = require('./routes/pakchunk');

const app = express();
const PORT = process.env.PORT || 3551;

// Middleware
app.use(cors());
app.use(forceHttpMiddleware);
app.use(sslBypassMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Static files for cloudstorage
app.use('/cloudstorage', express.static(path.join(__dirname, '../Cloudstorage')));

// API Routes
app.use('/account/api/oauth', authRoutes);
app.use('/fortnite/api/cloudstorage', cloudstorageRoutes);
app.use('/friends/api', friendsRoutes);
app.use('/lightswitch/api', lightswitchRoutes);
app.use('/fortnite/api/game/v2/profile', mcpRoutes);
app.use('/fortnite/api/matchmaking', matchmakingRoutes);
app.use('/fortnite/api/storefront', storefrontRoutes);
app.use('/account/api/public/account', userRoutes);
app.use('/fortnite/api/encryption', encryptionRoutes);
app.use('/keyservice', keyserviceRoutes);
app.use('/pakchunk', pakchunkRoutes);
app.use('/', mainRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    console.log(`404 - Route not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                 Fortnite Season 7.00 Backend                ║
║                      Server Started                         ║
╠══════════════════════════════════════════════════════════════╣
║  Port: ${PORT}                                                ║
║  Time: ${new Date().toISOString()}                    ║
║  Environment: Development                                    ║
╚══════════════════════════════════════════════════════════════╝
    `);
    
    console.log('Available endpoints:');
    console.log('- Authentication: /account/api/oauth/*');
    console.log('- Cloud Storage: /fortnite/api/cloudstorage/*');
    console.log('- Friends: /friends/api/*');
    console.log('- Lightswitch: /lightswitch/api/*');
    console.log('- MCP (Profiles): /fortnite/api/game/v2/profile/*');
    console.log('- Matchmaking: /fortnite/api/matchmaking/*');
    console.log('- Storefront: /fortnite/api/storefront/*');
    console.log('- User Accounts: /account/api/public/account/*');
});

module.exports = app;
