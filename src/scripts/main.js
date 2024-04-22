import { setApi } from "../module.js";
import API from "./API/api.js";
import CONSTANTS from "./constants/constants.js";
import BackPackManagerHelpers from "./lib/backpack-manager-helpers.js";
import { onDropItemTransferStuff } from "./lib/lib.js";
export const initHooks = () => {
    // setup all the hooks
    //   Hooks.once("socketlib.ready", registerSocket);
    //   registerSocket();
};

export const setupHooks = () => {
    setApi(API);

    if (game.system.id === "dnd5e") {
        Hooks.on("renderItemSheet", (sheet, html) => {
            BackPackManagerHelpers.renderItemSheetHandler(sheet, html);
        });

        Hooks.on("dnd5e.preUseItem", (item) => {
            return BackPackManagerHelpers.preUseItemHandler(item);
        });
    }
};

export const readyHooks = async () => {
    // Add any additional hooks if necessary

    if (!game.user.isGM) {
        libWrapper.register(
            CONSTANTS.MODULE_ID,
            "game.dnd5e.applications.actor.ActorSheet5eCharacter.prototype._onDropItem",
            onDropItemTransferStuff,
            "MIXED", //'OVERRIDE',
        );
    } else {
        if (game.settings.get(CONSTANTS.MODULE_ID, "enableEvenForGM")) {
            libWrapper.register(
                CONSTANTS.MODULE_ID,
                "game.dnd5e.applications.actor.ActorSheet5eCharacter.prototype._onDropItem",
                onDropItemTransferStuff,
                "MIXED", //'OVERRIDE',
            );
        }
    }

    if (game.settings.get(CONSTANTS.MODULE_ID, "enableForNpc")) {
        libWrapper.register(
            CONSTANTS.MODULE_ID,
            "game.dnd5e.applications.actor.ActorSheet5eNPC.prototype._onDropItem",
            onDropItemTransferStuff,
            "MIXED", //'OVERRIDE',
        );
    }

    if (game.settings.get(CONSTANTS.MODULE_ID, "enableForVehicle")) {
        libWrapper.register(
            CONSTANTS.MODULE_ID,
            "game.dnd5e.applications.actor.ActorSheet5eVehicle.prototype._onDropItem",
            onDropItemTransferStuff,
            "MIXED", //'OVERRIDE',
        );
    }
};
