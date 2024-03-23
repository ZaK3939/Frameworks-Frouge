// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

// Inherits
import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { OwnableRoles } from "solady/auth/OwnableRoles.sol";

// Interfaces
import { IStageFactory } from "./interfaces/IStageFactory.sol";
import { IStage } from "./interfaces/IStage.sol";

// Leverages
import { LibClone } from "solady/utils/LibClone.sol";
import { LibString } from "solady/utils/LibString.sol";
import { LibZip } from "solady/utils/LibZip.sol";

import { console2 } from "forge-std/console2.sol";

/// @title StageFactory
/// @author
/// @dev custom:oz-upgrades-from StageFactoryV0

contract StageFactory is Initializable, OwnableRoles, IStageFactory {
    /*//////////////////////////////////////////////////////////////
                                 USING
    //////////////////////////////////////////////////////////////*/
    using LibClone for address;

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    address public gameStageAddress;
    address public battleAddress;
    address public enemyAddress;
    address public equipmentAddress;
    address public randomAddress;

    mapping(string => Stage) public stages;

    uint256 private locked;

    // insert new vars here at the end to keep the storage layout the same

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    /// @custom:oz-upgrades-unsafe-allow constructor
    // solhint-disable-next-line func-visibility
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address ownerAddress_,
        address payable gameStageAddress_,
        address battleAddress_,
        address enemyAddress_,
        address equipmentAddress_,
        address randomAddress_
    )
        external
        initializer
    {
        _initializeOwner(ownerAddress_);
        locked = 1;
        gameStageAddress = gameStageAddress_;
        battleAddress = battleAddress_;
        enemyAddress = enemyAddress_;
        equipmentAddress = equipmentAddress_;
        randomAddress = randomAddress_;
    }

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    /// @dev ReentrancyGuard modifier from solmate, copied here because it was added after storage layout was finalized
    /// on first deploy
    /// @dev from https://github.com/transmissions11/solmate/blob/main/src/utils/ReentrancyGuard.sol
    modifier nonReentrant() virtual {
        if (locked != 1) revert Reentrancy();
        locked = 2;
        _;
        locked = 1;
    }

    modifier nonZeroAddress(address address_) {
        if (address_ == address(0)) revert INVALID_ADDRESS_ZERO();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                 CREATE
    //////////////////////////////////////////////////////////////*/
    /// @dev Create an game stage and start it at the same time.
    /// @param stageName_ The name of the stage
    /// @return address the stage contract address
    function createGameStage(
        string memory stageName_,
        uint256 topFloor_,
        uint256[][] memory floorEnemy_,
        uint256[][] memory equipment_
    )
        external
        nonReentrant
        returns (address)
    {
        return createGameStageInternal(GameStageData(stageName_, topFloor_, floorEnemy_, equipment_));
    }

    /*//////////////////////////////////////////////////////////////
                                  SET
    //////////////////////////////////////////////////////////////*/
    function setGameStageAddress(address gameStageAddress_) external onlyOwner nonZeroAddress(gameStageAddress_) {
        gameStageAddress = gameStageAddress_;
    }

    function setBattleAddress(address battleAddress_) external onlyOwner nonZeroAddress(battleAddress_) {
        battleAddress = battleAddress_;
    }

    function setEnemyAddress(address enemyAddress_) external onlyOwner nonZeroAddress(enemyAddress_) {
        enemyAddress = enemyAddress_;
    }

    function setEquipmentAddress(address equipmentAddress_) external onlyOwner nonZeroAddress(equipmentAddress_) {
        equipmentAddress = equipmentAddress_;
    }

    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/
    function getStageAddress(string calldata stageId_) external view returns (address) {
        return stages[stageId_].stageAddress;
    }

    /// @dev return data in the stage struct for a stageId
    /// @param stageId_ The id of the stage
    function stageInfo(string memory stageId_) external view returns (string memory, address, address) {
        Stage storage currentStage = stages[stageId_];
        return (currentStage.name, currentStage.stageAddress, currentStage.stageCreator);
    }

    /*//////////////////////////////////////////////////////////////
                            INTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/
    /// @dev Internal function to create an game stage
    /// @param data_ The stage data struct
    function createGameStageInternal(GameStageData memory data_) internal returns (address) {
        Stage storage currentStage = stages[data_.name];

        if (currentStage.stageAddress != address(0)) {
            revert CREATE_FAILED();
        }
        if (data_.topFloor != data_.floorEnemy.length || data_.topFloor != data_.equipment.length) {
            revert CREATE_FAILED();
        }

        address payable newStage = payable(
            gameStageAddress.cloneDeterministic(
                keccak256(abi.encodePacked(msg.sender, block.chainid, data_.name, block.timestamp))
            )
        );
        currentStage.stageAddress = address(newStage);
        currentStage.stageCreator = msg.sender;
        currentStage.name = data_.name;
        currentStage.topFloor = data_.topFloor;
        currentStage.floorEnemy = data_.floorEnemy;
        currentStage.equipment = data_.equipment;

        IStage stageContract = IStage(newStage);

        stageContract.initializer(msg.sender, address(this), data_.topFloor, data_.floorEnemy, data_.equipment);

        emit StageContractCreated(msg.sender, address(newStage), "game");

        return currentStage.stageAddress;
    }
}
