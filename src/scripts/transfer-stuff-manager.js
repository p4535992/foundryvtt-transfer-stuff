import CONSTANTS from "./constants/constants.js";
import Logger from "./lib/Logger.js";
import TransferStuffHelpers from "./lib/transfer-stuff-helpers.js";

export class TransferStuffManager extends Application {
    constructor(object, options = {}) {
        super(options);
        this.hideOwnInventory = options.hideOwnInventory === true;
        this.object = object;
        this._collapsed = { targetActor: false, actor: false };
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            width: 450,
            template: `modules/${CONSTANTS.MODULE_ID}/templates/${CONSTANTS.MODULE_ID}-manager.hbs`,
            height: 750,
            classes: [CONSTANTS.MODULE_ID],
            scrollY: [".storage"],
            resizable: true,
        });
    }

    get id() {
        return `${CONSTANTS.MODULE_ID}-${this.object.transferStuffTargetActor.uuid.replaceAll(".", "-")}`;
    }

    /**
     * The valid items stowed on the transferStuffTargetActor Actor.
     * @returns {Item[]}      The filtered array of valid items.
     */
    get stowed() {
        return this.targetActor.items
            .filter((item) => {
                return TransferStuffHelpers.isValidItem(item);
            })
            .sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
    }

    /**
     * The items held on the Actor viewing the transferStuffTargetActor.
     * @returns {Item[]}      The filtered array of valid items.
     */
    get items() {
        return this.actor.items
            .filter((item) => {
                return TransferStuffHelpers.isValidItem(item);
            })
            .sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
    }

    /**
     * Get whether the current user has permission to view this transferStuffTargetActor.
     * @returns {boolean}     Whether the user has permission to view the transferStuffTargetActor.
     */
    get isOwner() {
        return this.targetActor.testUserPermission(game.user, "OWNER");
    }

    /**
     * The actor viewing the transferStuffTargetActor.
     * @returns {Actor}     The actor.
     */
    get actor() {
        return this.object.actor;
    }

    /**
     * The transferStuffTargetActor being viewed.
     * @returns {Actor}     The transferStuffTargetActor.
     */
    get targetActor() {
        return this.object.transferStuffTargetActor;
    }

    /** @override */
    async getData() {
        const data = await super.getData();
        data.targetActor = this.targetActor.name;
        data.actor = this.actor.name;
        data.hideOwnInventory = this.hideOwnInventory;
        data.collapsed = this._collapsed;

        if (game.system.id === "dnd5e") {
            // CAPACITY
            data.targetActorValue = this.targetActor.system.attributes.encumbrance.value;
            data.targetActorMax = this.targetActor.system.attributes.encumbrance.max;
            data.showCapacity = !!data.targetActorMax && data.targetActorValue >= 0;
            data.items = this.items.map((item) => ({
                item,
                quantity: item.system.quantity,
                showQty: item.system.quantity > 1,
            }));
            data.stowed = this.stowed.map((item) => ({
                item,
                quantity: item.system.quantity,
                showQty: item.system.quantity > 1,
            }));
            data.actorValue = this.actor.system.attributes.encumbrance.value;
            data.actorMax = this.actor.system.attributes.encumbrance.max;

            // CURRENCY
            data.currencies = Object.keys(CONFIG.DND5E.currencies).map((key) => {
                return {
                    class: key,
                    label: key.toUpperCase(),
                    max: { targetActor: this.targetActor.system.currency[key], actor: this.actor.system.currency[key] },
                };
            });
        }

        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);
        html[0].querySelectorAll("[data-action]").forEach((n) => {
            const action = n.dataset.action;
            if (action === "close") {
                n.addEventListener("click", this.close.bind(this));
            } else if (action === "collapse") {
                n.addEventListener("click", this._handleCollapse.bind(this));
            }
        });
        html[0].addEventListener("click", async (event) => {
            const a = event.target.closest("a");
            if (!a) {
                return;
            }
            const app = a.closest(".transfer-stuff .content");
            app.style.pointerEvents = "none";
            const type = a.dataset.type ?? a.dataset.action;

            if (["takeCurrency", "stowCurrency"].includes(type)) {
                await this._adjustCurrency(event);
                app.style.pointerEvents = "";
                return;
            }

            const uuid = a.closest(".item").querySelector(".item-details")?.dataset.uuid ?? "";
            const item = fromUuidSync(uuid);
            const qtyField = a.closest(".item").querySelector(".current");
            const max = qtyField ? Number(qtyField.dataset.max) : 1;
            const value = qtyField ? Number(qtyField.value) : 1;
            const { ctrlKey, shiftKey } = event;

            if (!type) {
                item.sheet.render(true);
                app.style.pointerEvents = "";
                return;
            } else if (type === "more") {
                const newValue = ctrlKey ? value + 50 : shiftKey ? value + 5 : value + 1;
                qtyField.value = Math.clamped(newValue, 1, max);
                app.style.pointerEvents = "";
                return;
            } else if (type === "less") {
                const newValue = ctrlKey ? value - 50 : shiftKey ? value - 5 : value - 1;
                qtyField.value = Math.clamped(newValue, 1, max);
                app.style.pointerEvents = "";
                return;
            } else if (type === "retrieve") {
                const success = await this._handleItemTransfer(this.targetActor, this.actor, item, value, max);
                if (success) {
                    app.style.pointerEvents = "";
                    return;
                }
            } else if (type === "delete") {
                // delete the item from the targetActor.
                await item.deleteDialog({ itemsWithSpells5e: { alsoDeleteChildSpells: true } });
                app.style.pointerEvents = "";
                return;
            } else if (type === "stow") {
                const success = await this._handleItemTransfer(this.actor, this.targetActor, item, value, max);
                if (success) {
                    app.style.pointerEvents = "";
                    return;
                }
            }

            app.style.pointerEvents = "";
            return;
        });
    }

    /** @override */
    async render(force, options = {}) {
        this.targetActor.apps[this.appId] = this;
        this.actor.apps[this.appId] = this;
        return super.render(force, options);
    }

    /** @override */
    async close(options = {}) {
        await super.close(options);
        delete this.targetActor.apps[this.appId];
        delete this.actor.apps[this.appId];
    }

    /**
     * Adjust the currency on the viewing Actor and the transferStuffTargetActor Actor.
     * @param {PointerEvent} event      The initiating click event.
     * @returns {Promise<Actor[]>}      The two updated Actor documents.
     */
    async _adjustCurrency(event) {
        const data = event.target.closest(".currency-item").dataset;
        const type = event.target.closest("A").dataset.action === "takeCurrency" ? "take" : "stow";
        const ph = game.i18n.localize("transfer-stuff.AdjustCurrency" + type.capitalize());
        const ct = game.i18n.format("transfer-stuff.AdjustCurrencyContentAmounts", {
            actor: this.actor.system.currency[data.denom],
            targetActorName: this.targetActor.system.currency[data.denom],
            denom: data.denom,
        });
        const content = `
    <p>${ct}</p>
    <form>
      <div class="form-group">
        <label>${data.denom.toUpperCase()}</label>
        <div class="form-fields">
          <input type="number" placeholder="${ph}" autofocus>
        </div>
      </div>
    </form>`;
        const amount = await Dialog.prompt({
            title: game.i18n.localize("transfer-stuff.AdjustCurrency"),
            content,
            rejectClose: false,
            label: game.i18n.localize("transfer-stuff.AdjustCurrencyLabel" + type.capitalize()),
            callback: (html) => html[0].querySelector("input").valueAsNumber,
        });
        if (!amount) {
            return;
        }
        const targetActorCoin = this.targetActor.system.currency[data.denom];
        const actorCoin = this.actor.system.currency[data.denom];
        const newValue = Math.clamped(amount, 0, type === "take" ? targetActorCoin : actorCoin);
        const updates =
            type === "take"
                ? [
                      { _id: this.targetActor.id, [`system.currency.${data.denom}`]: targetActorCoin - newValue },
                      { _id: this.actor.id, [`system.currency.${data.denom}`]: actorCoin + newValue },
                  ]
                : [
                      { _id: this.targetActor.id, [`system.currency.${data.denom}`]: targetActorCoin + newValue },
                      { _id: this.actor.id, [`system.currency.${data.denom}`]: actorCoin - newValue },
                  ];
        return Actor.updateDocuments(updates);
    }

    /**
     * Transfer item or stack from one actor to anoter.
     * @param {Actor} sourceActor     The source actor who has the item.
     * @param {Actor} targetActor     The target actor to receive the item.
     * @param {Item} item             The item or stack to transfer.
     * @param {number} value          The quantity to transfer.
     * @param {number} max            The maximum stack size.
     * @returns {Promise<boolean>}      Whether transfer was completed.
     */
    async _handleItemTransfer(sourceActor, targetActor, item, value, max) {
        // if for some ungodly reason, you put yourself in yourself:
        if (sourceActor === targetActor) {
            Logger.warn(`if for some ungodly reason, you put yourself in yourself`, true);
            return false;
        }
        const itemData = item.toObject();
        const create = await TransferStuffHelpers.setSystemSpecificValues(itemData, {
            quantity: value,
            target: targetActor,
            src: sourceActor,
        });

        // Create new item if not otherwise handled.
        let mayDelete = false;
        if (!create) {
            mayDelete = true;
        } else {
            const [c] = await targetActor.createEmbeddedDocuments("Item", [itemData]);
            if (c) {
                mayDelete = true;
            }
        }

        if (mayDelete) {
            if (value === max) {
                await item.delete({ itemsWithSpells5e: { alsoDeleteChildSpells: true } });
            } else {
                await TransferStuffHelpers.updateSystemSpecificQuantity(item, max, value);
            }
            return true;
        }
        return false;
    }

    /**
     * Toggle and save 'collapsed' class on headers when clicked.
     * @param {PointerEvent} event      The initiating click event.
     */
    _handleCollapse(event) {
        const target = event.currentTarget;
        target.classList.toggle("collapsed");
        const has = target.classList.contains("collapsed");
        this._collapsed[target.dataset.header] = has;
    }
}
