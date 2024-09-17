# Transfer Stuff and BackPack Manager

![Latest Release Download Count](https://img.shields.io/github/downloads/p4535992/foundryvtt-transfer-stuff/latest/module.zip?color=2b82fc&label=DOWNLOADS&style=for-the-badge)

[![Forge Installs](https://img.shields.io/badge/dynamic/json?label=Forge%20Installs&query=package.installs&suffix=%25&url=https%3A%2F%2Fforge-vtt.com%2Fapi%2Fbazaar%2Fpackage%2Ftransfer-stuff&colorB=006400&style=for-the-badge)](https://forge-vtt.com/bazaar#package=transfer-stuff)

![Foundry Core Compatible Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-transfer-stuff%2Fmaster%2Fsrc%2Fmodule.json&label=Foundry%20Version&query=$.compatibility.verified&colorB=orange&style=for-the-badge)

![Latest Version](https://img.shields.io/badge/dynamic/json.svg?url=https%3A%2F%2Fraw.githubusercontent.com%2Fp4535992%2Ffoundryvtt-transfer-stuff%2Fmaster%2Fsrc%2Fmodule.json&label=Latest%20Release&prefix=v&query=$.version&colorB=red&style=for-the-badge)

[![Foundry Hub Endorsements](https://img.shields.io/endpoint?logoColor=white&url=https%3A%2F%2Fwww.foundryvtt-hub.com%2Fwp-json%2Fhubapi%2Fv1%2Fpackage%2Ftransfer-stuff%2Fshield%2Fendorsements&style=for-the-badge)](https://www.foundryvtt-hub.com/package/transfer-stuff/)

![GitHub all releases](https://img.shields.io/github/downloads/p4535992/foundryvtt-transfer-stuff/total?style=for-the-badge)

[![Translation status](https://weblate.foundryvtt-hub.com/widgets/transfer-stuff/-/287x66-black.png)](https://weblate.foundryvtt-hub.com/engage/transfer-stuff/)

This project is therefore a fork of [Backpack Manager](https://github.com/krbz999/backpack-manager) made for a personal use case, which I make available to all with [krbz999 (aka Zhell)](https://github.com/krbz999/) approval.

This module is born on v10 as a personal fork of the module [TransferStuff](https://github.com/playest/TransferStuff), but on v11 i decide to fork the amazing project [Backpack Manager](https://github.com/krbz999/backpack-manager) and modify just a few line of code for make this module, it is also the successor to backpack manager because the original author who created it for Dnd5e [has officially abandoned it in favor of system logic](https://github.com/krbz999/backpack-manager/issues/30), but I feel that with the logic of "one for all" it can still offer something, so I have integrated the old Back Pack Manager module feature as well.

## Feature: Transfer stuff

Enable moving (rather than cloning) inventory and currencies between actors by dragging and dropping from a owned actor sheet to another.

## Feature: Backpack Manager

Make container management easy for your players. This module is useful for you if you:
- Like managing the containers and inventory of your character.
- Prefer using an actor in the Actor directory as a backpack or bag of holding.
- Find it a bit annoying to have to open multiple sheets and drag-and-drop to transfer items.
- Wonder why there is no option to just move an item instead of copying it between two actors.

With this module, you can designate an actor in the sidebar to be a 'container actor'. To set it up, follow these steps:
- Give the player ownership of an actor that serves as the container.
- Copy the UUID of the container actor (right-click the book icon in its header).
- Edit the Container item on the player character and paste the uuid of the actor in the new field that has been added.
- The uuid is the id of the container actor, prepended with `Actor.`. For example `Actor.5hfpenhg8fh49Ef5`.

Now when the player uses the Container item, it will open an interface to stow or retrieve items.
- Stow or retrieve an item, or stack of items, by clicking the box icon or the double arrow icon.
- Adjust how many items you want to stow or retrieve by using the left or right arrow buttons.
- Holding Shift changes the value by 5 instead of 1. Holding Ctrl changes the value by 50 instead of 1.
- Stow or retrieve currencies between the actors. Same modifier keys apply here.

**Can multiple players use the same container?**

Yes! Just give them all ownership of the container actor, and follow the setup steps above for each player.

It even updates for each player in real time. The interface is tied to the actor that has the container item and the actor acting as the container. When either actor is updated, as in when they receive, adjust, or delete an item, the interface is also updated. This is then shown in real time for each client.

**Does a GM need to be logged in for any of this to work?**

No.

**What can I stow or retrieve through the interface?**

The interface is automatically populated with a list of each actor's items. These item types have been explicitly excluded:
- class, subclass, and background-type items.
- feature and spell-type items.

Currency can be exchanged with the backpack actor.

**What changes are made to the items when they are moved from actor to actor?**

- Attunement state, equipped status, and proficiency are all adjusted as if you had dropped the item onto the actor sheet.
- The quantity of the item is adjusted by the choices made in the interface itself.
No other changes are made to the items.

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

### build

`build` will build and set up a symlink between `dist` and your `dataPath`.

```bash
npm run build
```

### build:watch

`build:watch` will build and watch for changes, rebuilding automatically.

```bash
npm run build:watch
```

### prettier-format

`prettier-format` launch the prettier plugin based on the configuration [here](./.prettierrc)

```bash
npm run-script prettier-format
```

### lint

`lint` launch the eslint process based on the configuration [here](./.eslintrc.json)

```bash
npm run-script lint
```

### lint:fix

`lint:fix` launch the eslint process with the fix argument

```bash
npm run-script lint:fix
```

### build:json

`build:json` unpack LevelDB pack on `src/packs` to the json db sources in `src/packs/_source`very useful for backup your items and manually fix some hard issue with some text editor

```bash
npm run-script build:json
```

### build:db

`build:db` packs the json db sources in `src/packs/_source` to LevelDB pack on `src/packs` with the new jsons. NOTE: usually this command is launched after the command `build:json` and after make some modifications on the json source files with some text editor

```bash
npm run-script build:db
```

## [Changelog](./CHANGELOG.md)

## Issues

Any issues, bugs, or feature requests are always welcome to be reported directly to the [Issue Tracker](https://github.com/p4535992/foundryvtt-transfer-stuff/issues ), or using the [Bug Reporter Module](https://foundryvtt.com/packages/bug-reporter/).

## License

- [Backpack Manager](https://github.com/krbz999/backpack-manager) with [MIT](https://github.com/krbz999/backpack-manager/blob/master/LICENSE)

This package is under an [MIT license](LICENSE) and the [Foundry Virtual Tabletop Limited License Agreement for module development](https://foundryvtt.com/article/license/).

## Credit

- Thanks to [krbz999 (aka Zhell)](https://github.com/krbz999/) for the module [Backpack Manager](https://github.com/krbz999/backpack-manager)
