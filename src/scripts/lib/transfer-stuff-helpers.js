import CONSTANTS from "../constants/constants";
import { TransferStuffManager } from "../transfer-stuff-manager";

export default class TransferStuffHelpers {
    /* Whether this is a valid item to put in a backpack. */
    static isValidItem(item) {
        if (game.system.id === "dnd5e") {
            if (["class", "subclass", "feat", "spell", "background", "race"].includes(item.type)) {
                return false;
            }
            if (item.system.quantity < 1) {
                return false;
            }
            // if (item.type !== "backpack" && item.type !== "container") return true;
        }

        // it must not be setup with this module:
        const uuid = item.flags[CONSTANTS.MODULE_ID]?.containerActorUuid;
        if (!uuid) {
            return true;
        }

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

    static async onDropItemTransferStuff(wrapped, ...args) {
        let [event, itemCurrent] = args;
        const targetActor = this.actor;
        let itemToCheck = fromUuidSync(itemCurrent.uuid);
        if (!itemToCheck.actor) {
            // return this._onDropItem(event, itemCurrent);
            const data = itemCurrent;
            // FROM ORIGINAL
            if (!this.actor.isOwner) {
                return false;
            }
            const item = await Item.implementation.fromDropData(data);

            // Handle moving out of container & item sorting
            if (this.actor.uuid === item.parent?.uuid) {
                if (item.system.container !== null) {
                    await item.update({ "system.container": null });
                }
                return this._onSortItem(event, item.toObject());
            }

            return this._onDropItemCreate(item);
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

    /**
     * Render the application.
     * @param {Actor} actor           The actor viewing the targetActor.
     * @param {Actor} targetActor             The actor acting as a targetActor.
     * @param {object} options        Rendering options.
     * @returns {TransferStuff}     The rendered application, or null if already rendered.
     */
    static _renderTransferStuff(actor, targetActor, options = {}) {
        if (!actor || targetActor) {
            return;
        }
        const doNotRender = Object.values(targetActor.apps).some((app) => app.constructor.name === "TransferStuff");
        if (doNotRender) return null;
        const title = game.i18n.format("transfer-stuff.Title", {
            actor: actor.name,
            targetActorName: targetActor.name,
        });
        const config = foundry.utils.mergeObject({ title }, options);
        return new TransferStuffManager(
            {
                transferStuffTargetActor: targetActor,
                actor: actor,
            },
            config,
        ).render(true, options);
    }
}
