const express = require('express');
const router = express.Router();

// Lightswitch service status
router.get('/service/bulk/status', (req, res) => {
    const services = [
        {
            serviceInstanceId: 'fortnite',
            status: 'UP',
            message: 'Fortnite is online',
            maintenanceUri: null,
            overrideCatalogIds: [],
            allowedActions: ['PLAY', 'DOWNLOAD'],
            banned: false,
            launcherInfoDTO: {
                appName: 'Fortnite',
                catalogItemId: '4fe75bbc5a674f4f9b356b5c90567da5',
                namespace: 'fn'
            }
        }
    ];
    
    res.json(services);
});

// Individual service status
router.get('/service/:serviceId/status', (req, res) => {
    const serviceId = req.params.serviceId;
    
    if (serviceId === 'fortnite' || serviceId === 'Fortnite') {
        res.json({
            serviceInstanceId: 'fortnite',
            status: 'UP',
            message: 'Season 7.00 is online and ready!',
            maintenanceUri: null,
            overrideCatalogIds: [],
            allowedActions: ['PLAY', 'DOWNLOAD'],
            banned: false,
            launcherInfoDTO: {
                appName: 'Fortnite',
                catalogItemId: '4fe75bbc5a674f4f9b356b5c90567da5',
                namespace: 'fn'
            }
        });
    } else {
        res.json({
            serviceInstanceId: serviceId,
            status: 'DOWN',
            message: 'Service not available',
            maintenanceUri: null,
            overrideCatalogIds: [],
            allowedActions: [],
            banned: false
        });
    }
});

module.exports = router;