import BackPackManagerHelpers from "../lib/backpack-manager-helpers";
import TransferStuffHelpers from "../lib/transfer-stuff-helpers";

const API = {
    renderManagerTransferStuff(actor, backpack, options = {}) {
        return TransferStuffHelpers._renderTransferStuff(actor, backpack, options);
    },

    renderManagerBackpackManager(actor, backpack, options = {}) {
        return BackPackManagerHelpers._renderBackpackManager(actor, backpack, options);
    },
};

export default API;
