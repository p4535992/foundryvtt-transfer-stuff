import CONSTANTS from "../constants/constants.js";
import { TransferStuffManager } from "../transfer-stuff-manager.js";
import Logger from "./Logger.js";

export const i18n = (key) => {
    return game.i18n.localize(key)?.trim();
};

export const i18nFormat = (key, data = {}) => {
    return game.i18n.format(key, data)?.trim();
};

// =========================================================================================

/* Whether this is a valid item to put in a backpack. */
export function isValidItem(item) {
    if (game.system.id === "dnd5e") {
        if (["class", "subclass", "feat", "spell", "background", "race"].includes(item.type)) return false;
        if (item.system.quantity < 1) return false;
        // if (item.type !== "backpack") return true;
    }

    // it must not be setup with this module:
    const uuid = item.flags[CONSTANTS.MODULE_ID]?.containerActorUuid;
    if (!uuid) return true;

    const transferStuffTargetActor = fromUuidSync(uuid);
    if (!transferStuffTargetActor) {
        return true;
    }
    // if for some ungodly reason, you put yourself in yourself:
    if (transferStuffTargetActor === item.actor) {
        return true;
    }
    return false;
}

/**
 * Change system specific values when an item is stowed or retrieved.
 * itemData is the item.toObject() and 'data' is any extra values needed.
 */
export async function setSystemSpecificValues(itemData, data) {
    if (game.system.id === "dnd5e") {
        itemData.system.quantity = data.quantity;
        const create = await data.target.sheet._onDropSingleItem(itemData);
        // 'create' is explicitly false if creation is otherwise handled.
        return create !== false;
    }
}

/* Update the quantity of the item in the system-specific way. */
export async function updateSystemSpecificQuantity(item, max, value) {
    if (game.system.id === "dnd5e") {
        return item.update({ "system.quantity": max - value });
    }
}

/**
 * Render the application.
 * @param {Actor} actor           The actor viewing the targetActor.
 * @param {Actor} targetActor             The actor acting as a targetActor.
 * @param {object} options        Rendering options.
 * @returns {TransferStuff}     The rendered application, or null if already rendered.
 */
export function _renderTransferStuff(actor, targetActor, options = {}) {
    if (!actor || targetActor) {
        return;
    }
    const doNotRender = Object.values(targetActor.apps).some((app) => app.constructor.name === "TransferStuff");
    if (doNotRender) return null;
    const title = game.i18n.format("transfer-stuff.Title", { actor: actor.name, targetActorName: targetActor.name });
    const config = foundry.utils.mergeObject({ title }, options);
    return new TransferStuffManager({ transferStuffTargetActor: targetActor, actor: actor }, config).render(
        true,
        options,
    );
}

// ===================================

export async function onDropItemTransferStuff(wrapped, ...args) {
    let [event, itemCurrent] = args;
    const targetActor = this.actor;
    let itemToCheck = fromUuidSync(itemCurrent.uuid);
    if (!itemToCheck.actor) {
        return this._onDropItem(event, itemCurrent);
    }
    let sourceActor = itemToCheck.actor;
    if (!sourceActor || !targetActor) {
        Logger.warn(`sourceActor or targetActor are not defined`);
        return;
    }
    if (sourceActor === targetActor) {
        Logger.warn(`sourceActor and targetActor are the same actor`);
        return;
    }
    // const isFromSameActor = await _isFromSameActor(targetActor, itemToCheck);

    const render = !Object.values(targetActor.apps).some((app) => app.constructor.name === "TransferStuff");
    // targetActor: the actor acting as the transferStuffTargetActor.
    // sourceActor: the actor stowing or retriving items.
    if (render) {
        const pack = new TransferStuffManager(
            { transferStuffTargetActor: targetActor, actor: sourceActor },
            {
                title: game.i18n.format("transfer-stuff.Title", {
                    actor: sourceActor.name,
                    targetActorName: targetActor.name,
                }),
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

export function retrieveAllOwnedActors() {
    const options = game.actors.reduce((acc, actor) => {
        if (actor.isOwner) {
            return acc + `<option value="${actor.id}">${actor.name}</option>`;
        }
        return acc;
    }, "");
    return options;
}