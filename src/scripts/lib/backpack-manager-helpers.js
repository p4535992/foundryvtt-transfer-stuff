import { BackpackManager } from "../backpack-manager";
import CONSTANTS from "../constants/constants";
import Logger from "./Logger";

export default class BackPackManagerHelpers {
    /* Whether this is a valid item to put in a backpack. */
    static isValidItem(item) {
        if (game.system.id === "dnd5e") {
            if (["class", "subclass", "feat", "spell", "background", "race"].includes(item.type)) return false;
            if (item.system.quantity < 1) {
                return false;
            }
            if (item.type !== "backpack" && item.type !== "container") {
                return true;
            }
        }

        // it must not be setup with this module:
        const uuid = item.flags[CONSTANTS.MODULE_ID]?.containerActorUuid;
        if (!uuid) {
            return true;
        }
        const backpack = fromUuidSync(uuid);
        if (!backpack) {
            return true;
        }
        // if for some ungodly reason, you put yourself in yourself:
        if (backpack === item.actor) {
            return true;
        }
        return false;
    }

    /**
     * Change system specific values when an item is stowed or retrieved.
     * itemData is the item.toObject() and 'data' is any extra values needed.
     */
    static async setSystemSpecificValues(itemData, data) {
        if (game.system.id === "dnd5e") {
            itemData.system.quantity = data.quantity;
            const create = await data.target.sheet._onDropSingleItem(itemData);
            // 'create' is explicitly false if creation is otherwise handled.
            return create !== false;
        }
    }

    /* Update the quantity of the item in the system-specific way. */
    static async updateSystemSpecificQuantity(item, max, value) {
        if (game.system.id === "dnd5e") {
            return item.update({ "system.quantity": max - value });
        }
    }

    /**
     * Render the application.
     * @param {Actor} actor           The actor viewing the bag.
     * @param {Actor} bag             The actor acting as a bag.
     * @param {object} options        Rendering options.
     * @returns {BackpackManager}     The rendered application, or null if already rendered.
     */
    static _renderBackpackManager(actor, backpack, options = {}) {
        const doNotRender = Object.values(backpack.apps).some((app) => app.constructor.name === "BackpackManager");
        if (doNotRender) {
            return null;
        }
        const title = game.i18n.format("transfer-stuff.Title", { actor: actor.name, bag: backpack.name });
        const config = foundry.utils.mergeObject({ title }, options);
        return new BackpackManager(
            {
                backpack: backpack,
                actor: actor,
                item: null,
            },
            config,
        ).render(true, options);
    }

    /**
     *
     * @param {Object} sheet
     * @param {Object} html
     * @returns {void}
     */
    static renderItemSheetHandler(sheet, html) {
        if (sheet.item.type !== "backpack" && sheet.item.type !== "container") {
            return;
        }
        const label = html[0].querySelector("[name='system.capacity.weightless']").closest("label");

        const name = `flags.${CONSTANTS.MODULE_ID}.containerActorUuid`;
        const value = sheet.item.flags[CONSTANTS.MODULE_ID]?.containerActorUuid ?? "";
        const div = document.createElement("DIV");
        div.innerHTML = `
    <label data-tooltip="transfer-stuff.PlaceUuidHere">${game.i18n.localize("ITEM.TypeContainer")}:</label>
    <input type="text" name="${name}" value="${value}" placeholder="Actor.${foundry.utils.randomID()}">`;
        label.after(...div.children);
        sheet.setPosition();
    }

    /**
     *
     * @param {Item} item
     * @returns {boolean}
     */
    static preUseItemHandler(item) {
        if (item.type !== "backpack" && item.type !== "container") {
            return;
        }
        const uuid = item.flags[CONSTANTS.MODULE_ID]?.containerActorUuid;
        if (!uuid) {
            return;
        }
        const backpack = fromUuidSync(uuid);
        if (!backpack || !(backpack instanceof Actor)) {
            Logger.warn(game.i18n.format("transfer-stuff.UuidActorNotFound", { item: item.name }), true);
            return;
        }

        const actor = item.actor;
        if (backpack === actor) {
            Logger.warn("transfer-stuff.CannotUseSelf", true, { localize: true });
            return;
        }

        const render = !Object.values(backpack.apps).some((app) => app.constructor.name === "BackpackManager");
        // backpack: the actor acting as the backpack.
        // actor: the actor stowing or retriving items.
        // item: the item linked to the backpack.
        if (render) {
            const pack = new BackpackManager(
                {
                    backpack: backpack,
                    actor: actor,
                    item: item,
                },
                {
                    title: game.i18n.format("transfer-stuff.Title", { actor: actor.name, bag: backpack.name }),
                },
            );
            if (pack.isOwner) {
                pack.render(true);
            } else {
                Logger.error("transfer-stuff.NotOwner", true, { localize: true });
                return;
            }
        }

        return false;
    }
}
