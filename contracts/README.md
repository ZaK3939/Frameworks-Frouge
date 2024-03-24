# Foundry Template [![Open in Gitpod][gitpod-badge]][gitpod] [![Github Actions][gha-badge]][gha] [![Foundry][foundry-badge]][foundry] [![License: MIT][license-badge]][license]

[gitpod]: https://gitpod.io/#https://github.com/OnchainGame/demo-non-field-rpg
[gitpod-badge]: https://img.shields.io/badge/Gitpod-Open%20in%20Gitpod-FFB45B?logo=gitpod
[gha]: https://github.com/OnchainGame/demo-non-field-rpg/actions
[gha-badge]: https://github.com/OnchainGame/demo-non-field-rpg/actions/workflows/ci.yml/badge.svg
[foundry]: https://getfoundry.sh/
[foundry-badge]: https://img.shields.io/badge/Built%20with-Foundry-FFDB1C.svg
[license]: https://opensource.org/licenses/MIT
[license-badge]: https://img.shields.io/badge/License-MIT-blue.svg

## Getting Started

```
bun install
forge install OpenZeppelin/openzeppelin-foundry-upgrades
forge install OpenZeppelin/openzeppelin-contracts-upgradeable
forge remappings
```

update .env

## StageFactory.sol

Dynamic Stage Creation: Enables the creation of various game stages, each with unique characteristics such as enemies,
equipment, and other attributes. This function supports the expanding and evolving nature of the game, allowing for new
content to be introduced seamlessly.

Modular Game Components: The contract interfaces with different modular components of the game like battles, enemies,
and equipment. This modular approach facilitates easy updates and changes to individual aspects of the game without
affecting the entire system.

## Stage.sol

Game Stage Management: The contract manages different stages or levels in the game. Players progress through these
stages, encountering various challenges and opportunities.

Player Interaction: Players can perform various actions like battling enemies, acquiring equipment, and resting. These
actions are critical for the progression and strategy within the game.

Equipment and Enemy Handling: It interfaces with other contracts representing enemies and equipment, allowing for
dynamic encounters and gear acquisition, which are essential elements of gameplay.

Randomness and Game Logic: Incorporates randomness for different game events and ensures logical progression for the
player within the game stages.

Player Status Tracking: Maintains and updates the status of players, including health, equipment, and progression
through the floors.

Revival Mechanism: Includes a function for players to revive themselves if defeated, enabling continued gameplay at a
cost.

Financial Transactions: Manages in-game financial transactions, such as fee collection and handling payments for revival
or other in-game activities.

## New Stage Setting

If you want to create your own stage, please check this script.

https://github.com/ZaK3939/Frameworks-Frouge/blob/main/contracts/script/DeployAndSetting.s.sol

## Deploy

For Stage Create And Deploy

```
forge script script/DeployAndSetting.s.sol:DeployAndSetting --rpc-url base --broadcast --verify --legacy --ffi
```

For PrivyNFT

```
forge script script/DeployNFTAndSet.s.sol:DeployNFTAndSet --rpc-url optimism-sepolia --broadcast --verify --legacy --ffi

```

## License

This project is licensed under MIT.
