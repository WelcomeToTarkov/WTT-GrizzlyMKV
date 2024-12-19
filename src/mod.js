"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
// WTT imports
const WTTInstanceManager_1 = require("./WTTInstanceManager");
const CustomItemService_1 = require("./CustomItemService");
const QuestAPI_1 = require("./QuestAPI");
const QuestModifier_1 = require("./QuestModifier");
// Custom Trader Assort Items
const CustomAssortSchemeService_1 = require("./CustomAssortSchemeService");
const CustomWeaponPresets_1 = require("./CustomWeaponPresets");
class GrizzlyMk5 {
    Instance = new WTTInstanceManager_1.WTTInstanceManager();
    version;
    modName = "WTT-Grizzly MK V";
    customItemService = new CustomItemService_1.CustomItemService();
    questAPI = new QuestAPI_1.QuestAPI();
    questModifier = new QuestModifier_1.QuestModifier();
    customAssortSchemeService = new CustomAssortSchemeService_1.CustomAssortSchemeService();
    customWeaponPresets = new CustomWeaponPresets_1.CustomWeaponPresets();
    debug = false;
    // Anything that needs done on preSptLoad, place here.
    preSptLoad(container) {
        // Initialize the instance manager DO NOTHING ELSE BEFORE THIS
        this.Instance.preSptLoad(container, this.modName);
        this.Instance.debug = this.debug;
        // EVERYTHING AFTER HERE MUST USE THE INSTANCE
        this.getVersionFromJson();
        this.displayCreditBanner();
        this.customItemService.preSptLoad(this.Instance);
        this.questAPI.preSptLoad(this.Instance);
        this.questModifier.preSptLoad(this.Instance);
        this.customAssortSchemeService.preSptLoad(this.Instance);
        this.customWeaponPresets.preSptLoad(this.Instance);
    }
    // Anything that needs done on postDBLoad, place here.
    postDBLoad(container) {
        // Initialize the instance manager DO NOTHING ELSE BEFORE THIS
        this.Instance.postDBLoad(container);
        // EVERYTHING AFTER HERE MUST USE THE INSTANCE
        this.customItemService.postDBLoad();
        this.customAssortSchemeService.postDBLoad();
        this.customWeaponPresets.postDBLoad();
        this.questAPI.postDBLoad();
        this.questModifier.postDBLoad();
        this.Instance.logger.log(`[${this.modName}] Database: Loading complete.`, LogTextColor_1.LogTextColor.GREEN);
    }
    getVersionFromJson() {
        const packageJsonPath = path.join(__dirname, "../package.json");
        fs.readFile(packageJsonPath, "utf-8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            const jsonData = JSON.parse(data);
            this.version = jsonData.version;
        });
    }
    colorLog(message, color) {
        const colorCodes = {
            red: "\x1b[31m",
            green: "\x1b[32m",
            yellow: "\x1b[33m",
            blue: "\x1b[34m",
            magenta: "\x1b[35m",
            cyan: "\x1b[36m",
            white: "\x1b[37m",
            gray: "\x1b[90m",
            brightRed: "\x1b[91m",
            brightGreen: "\x1b[92m",
            brightYellow: "\x1b[93m",
            brightBlue: "\x1b[94m",
            brightMagenta: "\x1b[95m",
            brightCyan: "\x1b[96m",
            brightWhite: "\x1b[97m"
        };
        const resetCode = "\x1b[0m";
        const colorCode = colorCodes[color] || "\x1b[37m"; // Default to white if color is invalid.
        console.log(`${colorCode}${message}${resetCode}`); // Log the colored message here
    }
    displayCreditBanner() {
        this.colorLog(`[${this.modName}] Developers:  MadManBeavis, Qwertyalex   Code Framework: GroovypenguinX
                                                        When you need your 1911 to kick like a mule.`, "green");
    }
}
module.exports = { mod: new GrizzlyMk5() };
//# sourceMappingURL=mod.js.map