const express = require('express');
const router = express.Router();

// Season 7.00 Storefront Data
const season7Storefront = {
    refreshIntervalHrs: 24,
    dailyPurchaseHrs: 24,
    expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    storefronts: [
        {
            name: "BRDailyStorefront",
            catalogEntries: [
                {
                    offerId: "daily_item_1",
                    devName: "Season 7 Daily Item 1",
                    offerType: "StaticPrice",
                    prices: [
                        {
                            currencyType: "MtxCurrency",
                            currencySubType: "",
                            regularPrice: 800,
                            finalPrice: 800,
                            saleExpiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                            basePrice: 800
                        }
                    ],
                    categories: ["Panel01"],
                    catalogGroupPriority: 0,
                    sortPriority: 0,
                    title: "Daily Item",
                    shortDescription: "Season 7 Daily Item",
                    description: "A special item from Season 7",
                    displayAssetPath: "",
                    itemGrants: [],
                    dailyLimit: -1,
                    weeklyLimit: -1,
                    monthlyLimit: -1,
                    appStoreId: [],
                    requirements: [],
                    metaInfo: [],
                    catalogGroup: "",
                    catalogGroupPriority: 0,
                    sortPriority: 0,
                    title: "Daily Item",
                    shortDescription: "Season 7 Daily Item"
                }
            ]
        },
        {
            name: "BRWeeklyStorefront", 
            catalogEntries: [
                {
                    offerId: "weekly_item_1",
                    devName: "Season 7 Weekly Item 1",
                    offerType: "StaticPrice",
                    prices: [
                        {
                            currencyType: "MtxCurrency",
                            currencySubType: "",
                            regularPrice: 1200,
                            finalPrice: 1200,
                            saleExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                            basePrice: 1200
                        }
                    ],
                    categories: ["Panel02"],
                    catalogGroupPriority: 0,
                    sortPriority: 0,
                    title: "Weekly Item",
                    shortDescription: "Season 7 Weekly Item",
                    description: "A special weekly item from Season 7",
                    displayAssetPath: "",
                    itemGrants: [],
                    dailyLimit: -1,
                    weeklyLimit: -1,
                    monthlyLimit: -1,
                    appStoreId: [],
                    requirements: [],
                    metaInfo: [],
                    catalogGroup: "",
                    catalogGroupPriority: 0,
                    sortPriority: 0
                }
            ]
        }
    ]
};

// Get storefront catalog
router.get('/v2/catalog', (req, res) => {
    res.json(season7Storefront);
});

// Get keychain (for V-Bucks and other currencies)
router.get('/v2/keychain', (req, res) => {
    res.json([
        "MtxCurrency:Currency:MtxPurchased",
        "MtxCurrency:Currency:MtxPurchaseBonus", 
        "MtxCurrency:Currency:MtxGiveaway"
    ]);
});

// Purchase catalog entry
router.post('/v2/gift/check_eligibility/recipient/:recipientId/offer/:offerId', (req, res) => {
    res.json({
        price: {
            currencyType: "MtxCurrency",
            currencySubType: "",
            regularPrice: 800,
            finalPrice: 800,
            basePrice: 800
        },
        eligible: true
    });
});

module.exports = router;