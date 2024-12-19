/* eslint-disable @typescript-eslint/naming-convention */

import * as fs from "node:fs";
import * as path from "node:path";

import type { DependencyContainer } from "tsyringe";
import type { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import type { IPreSptLoadMod } from "@spt/models/external/IPreSptLoadMod";
import { LogTextColor } from "@spt/models/spt/logging/LogTextColor";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
// WTT imports
import { WTTInstanceManager } from "./WTTInstanceManager";
import { CustomItemService } from "./CustomItemService";
import { QuestAPI } from "./QuestAPI";
import { QuestModifier } from "./QuestModifier";
// Custom Trader Assort Items
import { CustomAssortSchemeService } from "./CustomAssortSchemeService";
import { CustomWeaponPresets } from "./CustomWeaponPresets";

class GrizzlyMk5
implements IPreSptLoadMod, IPostDBLoadMod
{
    private Instance: WTTInstanceManager = new WTTInstanceManager();
    private version: string;
    private modName = "WTT-Grizzly MK V";

    private customItemService: CustomItemService = new CustomItemService();
    private questAPI: QuestAPI = new QuestAPI();
    private questModifier: QuestModifier = new QuestModifier();
    private customAssortSchemeService: CustomAssortSchemeService = new CustomAssortSchemeService();
    private customWeaponPresets: CustomWeaponPresets = new CustomWeaponPresets();

    debug = false;

    // Anything that needs done on preSptLoad, place here.
    public preSptLoad(container: DependencyContainer): void 
    {
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
    postDBLoad(container: DependencyContainer): void 
    {
    // Initialize the instance manager DO NOTHING ELSE BEFORE THIS
        this.Instance.postDBLoad(container);
        // EVERYTHING AFTER HERE MUST USE THE INSTANCE

        this.customItemService.postDBLoad();
        this.customAssortSchemeService.postDBLoad();
        this.customWeaponPresets.postDBLoad();
        this.questAPI.postDBLoad();
        this.questModifier.postDBLoad();

        this.Instance.logger.log(
            `[${this.modName}] Database: Loading complete.`,
            LogTextColor.GREEN
        );
    }

    private getVersionFromJson(): void 
    {
        const packageJsonPath = path.join(__dirname, "../package.json");

        fs.readFile(packageJsonPath, "utf-8", (err, data) => 
        {
            if (err) 
            {
                console.error("Error reading file:", err);
                return;
            }

            const jsonData = JSON.parse(data);
            this.version = jsonData.version;
        });
    }
    public colorLog(message: string, color: string) {
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
        const colorCode = colorCodes[color as keyof typeof colorCodes] || "\x1b[37m"; // Default to white if color is invalid.
        console.log(`${colorCode}${message}${resetCode}`); // Log the colored message here
    }

    private displayCreditBanner(): void 
    {
        this.colorLog
        (`[${this.modName}] Developers:  MadManBeavis, Qwertyalex   Code Framework: GroovypenguinX
                                                        When you need your 1911 to kick like a mule.`, "green");
    }
}

module.exports = { mod: new GrizzlyMk5() };
