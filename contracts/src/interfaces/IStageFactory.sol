// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IStageFactory {
    // Errors
    error INVALID_ADDRESS_ZERO();
    error CREATE_FAILED();
    error Reentrancy();

    // Structs
    struct Stage {
        string name;
        address stageCreator;
        address stageAddress;
        uint256 topFloor;
        uint256[][] floorEnemy;
        uint256[][] equipment;
    }

    struct GameStageData {
        string name;
        uint256 topFloor;
        uint256[][] floorEnemy;
        uint256[][] equipment;
    }

    // Events
    event StageContractCreated(address indexed creator, address indexed contractAddress, string stageType);

    // Update Functions
    function createGameStage(
        string memory _name,
        uint256 _topFloor,
        uint256[][] memory _floorEnemy,
        uint256[][] memory _equipment
    )
        external
        returns (address);

    // Read Functions
    function battleAddress() external view returns (address);
    function enemyAddress() external view returns (address);
    function equipmentAddress() external view returns (address);
    function randomAddress() external view returns (address);
}
