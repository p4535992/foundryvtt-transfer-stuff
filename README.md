### Transfer Stuff

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-transfer-stuff/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ftransfer-stuff&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=transfer-stuff)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-transfer-stuff%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-transfer-stuff%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ftransfer-stuff%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/transfer-stuff/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-transfer-stuff/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/transfer-stuff/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/transfer-stuff/)

Enable moving (rather than cloning) inventory and currencies between actors by dragging and dropping.

This module is born on v10 as a personal fork of the module [TransferStuff](https://github.com/playest/TransferStuff), but on v11 i decide to fork the amazing project [Backpack Manager](https://github.com/krbz999/backpack-manager) and modify just a few line of code for make this module.

So now this project is therefore a fork of [Backpack Manager](https://github.com/krbz999/backpack-manager) made for a personal use case, which I make available to all with [krbz999 (aka Zhell)](https://github.com/krbz999/) approval.

I strongly urge you to tip him, to his kofi account: [Ko-fi](https://ko-fi.com/zhell)

**NOTE: This module is been tested only on Dnd5e system**

## Installation

It's always easiest to install modules from the in game add-on browser.

To install this module manually:
1.  Inside the Foundry "Configuration and Setup" screen, click "Add-on Modules"
2.  Click "Install Module"
3.  In the "Manifest URL" field, paste the following url:
`https://raw.githubusercontent.com/p4535992/foundryvtt-transfer-stuff/master/src/module.json`
4.  Click 'Install' and wait for installation to complete
5.  Don't forget to enable the module in game using the "Manage Module" button

### libWrapper

This module uses the [libWrapper](https://github.com/ruipin/fvtt-lib-wrapper) library for wrapping core methods. It is a hard dependency and it is recommended for the best experience and compatibility with other modules.


## Known issue

# API


# Build

## Install all packages

```bash
npm install
```

### dev

`dev` will let you develop you own code with hot reloading on the browser

```bash
npm run dev
```

## npm build scripts

### build

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run build
```

### build-watch

`build-watch` will build and watch for changes, rebuilding automatically.

```bash
npm run build-watch
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-transfer-stuff/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

- [Backpack Manager](https://github.com/krbz999/backpack-manager) with [MIT](https://github.com/krbz999/backpack-manager/blob/master/LICENSE)

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

- Thanks to [krbz999 (aka Zhell)](https://github.com/krbz999/) for the module [Backpack Manager](https://github.com/krbz999/backpack-manager)