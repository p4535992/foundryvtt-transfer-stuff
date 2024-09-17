import BackPackManagerHelpers from "../lib/backpack-manager-helpers.js";
import TransferStuffHelpers from "../lib/transfer-stuff-helpers.js";

const API = {
    renderManagerTransferStuff(actor, backpack, options = {}) {
        return TransferStuffHelpers._renderTransferStuff(actor, backpack, options);
    },

    renderManagerBackpackManager(actor, backpack, options = {}) {
        return BackPackManagerHelpers._renderBackpackManager(actor, backpack, options);
    },
};

export default API;
