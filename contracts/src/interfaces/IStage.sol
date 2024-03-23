// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

// Structs
struct PlayerStageStatus {
    uint256 playerId;
    uint256 hp;
    uint256 floor;
    uint256 gold;
    uint256 weapon;
    uint256 shield;
    uint256 attack;
    uint256 defense;
    bool active;
}

interface IStage {
    // Errors
    error INVALID_ADDRESS_ZERO();
    error NOT_STAGE_FACTORY();
    error CREATURE_NOT_EXISTS();
    error INVALID_LENGTH();
    error INVALID_ACTION();
    error NOT_ENOUGH_GOLD();
    error NOT_ENOUGH_ETH();
    error ALREADY_INITIALIZED();
    error PLAYER_IS_ACTIVE();

    // Events
    event GameStart(uint256 playerId);
    event GameStartAgain(uint256 playerId);
    event GameOver(uint256 playerId);
    event GameClear(uint256 playerId, uint256 score);
    event NotEnoughGold(uint256 playerId, uint256 price, uint256 gold);
    event ActionEnd(uint256 playerId, uint8 option, uint256 floor, bool skipped);
    event AreaUpdated(uint256 floor, uint256[] floorEnemy, uint256[] equipment);
    event BattleResult(uint256 playerId, uint256 enemyId, uint256 result, uint256 hp, uint256 gold);
    event EquipmentPurchased(
        uint256 playerId, uint256 equipmentId, uint256 price, uint256 playerGold, uint256 attack, uint256 defense
    );
    event RestResult(uint256 playerId, uint256 itemId, uint256 hp, uint256 gold);

    // Initializer/Contstructor Function
    function initializer(
        address feeDestination_,
        address stageFactoryContract_,
        uint256 topFloor_,
        uint256[][] memory floorEnemy_,
        uint256[][] memory equipment_
    )
        external;

    // Update Functions
    function gameAction(uint256 playerId_, uint8 option_) external;

    function reviveUser(uint256 playerId_) external payable;
    // Read Functions
    function getNextEnemy(uint256 floor_) external view returns (uint256);

    function playerStageStatus(uint256 playerId_) external view returns (PlayerStageStatus memory);

    function getTopFloor() external view returns (uint256);

    function getUserFloor(uint256 playerId_) external view returns (uint256);

    function gameClear(uint256 playerId_) external view returns (bool);
}
