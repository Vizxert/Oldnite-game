const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// Season 7.00 Battle Pass and Profile Data
const season7BattlePass = {
    "season_number": 7,
    "season_start_time": "2018-12-06T14:00:00.000Z",
    "season_end_time": "2019-02-28T14:00:00.000Z",
    "battlepass_name": "Season 7 Battle Pass",
    "battlepass_short_name": "S7",
    "battlepass_description": "100 tiers of awesome rewards including new Outfits, Emotes, Wraps, and more!",
    "battlepass_display_info": {
        "chapter_season": "Chapter 1 - Season 7",
        "display_name": "Season 7"
    }
};

// Default Athena profile for Season 7.00
const defaultAthenaProfile = {
    "profileRevision": 1,
    "profileId": "athena",
    "profileChangesBaseRevision": 1,
    "profileChanges": [],
    "profileCommandRevision": 1,
    "serverTime": new Date().toISOString(),
    "multiUpdate": [],
    "responseVersion": 1,
    "stats": {
        "attributes": {
            "past_seasons": [],
            "season_match_boost": 0,
            "loadouts": [],
            "rested_xp_overflow": 0,
            "mfa_reward_claimed": true,
            "quest_manager": {},
            "book_level": 1,
            "season_num": 7,
            "season_update": 0,
            "book_xp": 0,
            "permissions": [],
            "season": {
                "numWins": 0,
                "numHighBracket": 0,
                "numLowBracket": 0
            },
            "vote_data": {},
            "lifetime_wins": 0,
            "party_assist_quest": "",
            "purchased_battle_pass_tier_offers": {},
            "rested_xp_exchange": 1,
            "level": 1,
            "rested_xp_mult": 1.25,
            "accountLevel": 1,
            "competitive_identity": {},
            "inventory_limit_bonus": 0,
            "last_applied_loadout": "",
            "daily_rewards": {},
            "xp": 0,
            "season_friend_match_boost": 0,
            "active_loadout_index": 0
        }
    },
    "items": {}
};

// MCP Profile endpoints
router.post('/:accountId/client/:operation', (req, res) => {
    const { accountId, operation } = req.params;
    const profileId = req.query.profileId || 'athena';
    
    console.log(`MCP Operation: ${operation} for profile ${profileId}`);
    
    let response = {
        profileRevision: 1,
        profileId: profileId,
        profileChangesBaseRevision: 1,
        profileChanges: [],
        profileCommandRevision: 1,
        serverTime: new Date().toISOString(),
        multiUpdate: [],
        responseVersion: 1
    };
    
    switch (operation) {
        case 'QueryProfile':
            if (profileId === 'athena') {
                response = { ...defaultAthenaProfile };
                response.serverTime = new Date().toISOString();
            } else if (profileId === 'common_core') {
                response.stats = {
                    attributes: {
                        survey_data: {},
                        personal_offers: {},
                        intro_game_played: true,
                        import_allowed: true,
                        mtx_purchase_history: {},
                        undo_cooldowns: [],
                        mtx_affiliate_set_time: "",
                        inventory_limit_bonus: 0,
                        current_mtx_platform: "EpicPC",
                        mtx_affiliate: "",
                        weekly_purchases: {},
                        daily_purchases: {},
                        ban_history: {},
                        in_app_purchases: {},
                        permissions: [],
                        undo_timeout: "min"
                    }
                };
            }
            break;
            
        case 'ClientQuestLogin':
            response.multiUpdate = [
                {
                    profileRevision: 1,
                    profileId: 'athena',
                    profileChangesBaseRevision: 1,
                    profileChanges: [],
                    profileCommandRevision: 1
                }
            ];
            break;
            
        case 'MarkItemSeen':
            // Mark items as seen
            response.profileChanges = [{
                changeType: "statModified",
                name: "last_applied_loadout",
                value: ""
            }];
            break;
            
        case 'SetBattleRoyaleBanner':
            // Set banner
            response.profileChanges = [{
                changeType: "statModified", 
                name: "banner_icon",
                value: req.body.homebaseBannerIconId || "standardbanner1"
            }, {
                changeType: "statModified",
                name: "banner_color", 
                value: req.body.homebaseBannerColorId || "defaultcolor1"
            }];
            break;
            
        case 'SetCosmeticLockerSlot':
            // Set cosmetic items
            const category = req.body.category;
            const itemToSlot = req.body.itemToSlot;
            const slotIndex = req.body.slotIndex || 0;
            
            response.profileChanges = [{
                changeType: "statModified",
                name: `favorite_${category.toLowerCase()}`,
                value: itemToSlot
            }];
            break;
            
        case 'EquipBattleRoyaleCustomization':
            // Equip items
            const slotName = req.body.slotName;
            const itemId = req.body.itemToSlot;
            
            response.profileChanges = [{
                changeType: "statModified",
                name: `favorite_${slotName}`,
                value: itemId
            }];
            break;
            
        default:
            console.log(`Unhandled MCP operation: ${operation}`);
            break;
    }
    
    res.json(response);
});

// Get profile
router.get('/:accountId/profile/:profileId', (req, res) => {
    const { profileId } = req.params;
    
    if (profileId === 'athena') {
        const profile = { ...defaultAthenaProfile };
        profile.serverTime = new Date().toISOString();
        res.json(profile);
    } else {
        res.json({
            profileRevision: 1,
            profileId: profileId,
            profileChangesBaseRevision: 1,
            profileChanges: [],
            profileCommandRevision: 1,
            serverTime: new Date().toISOString(),
            multiUpdate: [],
            responseVersion: 1,
            stats: { attributes: {} },
            items: {}
        });
    }
});

module.exports = router;