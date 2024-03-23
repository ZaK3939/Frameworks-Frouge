// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { console2 } from "forge-std/console2.sol";
import { SafeTransferLib } from "solady/utils/SafeTransferLib.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { IStageFactory } from "./interfaces/IStageFactory.sol";
import { IStage, PlayerStageStatus } from "./interfaces/IStage.sol";
import { IBattle } from "./interfaces/IBattle.sol";
import { IEnemy } from "./interfaces/IEnemy.sol";
import { IEquipment, EquipmentData } from "./interfaces/IEquipment.sol";
import { IRandom } from "./interfaces/IRandom.sol";
import { Constants } from "./lib/Constants.sol";

/// @title Stage
/// @author zak3939
/// @notice
contract Stage is Ownable, IStage {
    /*//////////////////////////////////////////////////////////////
                                 USING
    //////////////////////////////////////////////////////////////*/
    using SafeTransferLib for address;

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    IStageFactory public stageFactoryContract;
    IBattle public battleContract;
    IEnemy public enemyContract;
    IEquipment public equipmentContract;
    IRandom public randomContract;

    address public feeDestination;
    mapping(uint256 playerId => PlayerStageStatus) status;
    mapping(uint256 floor => uint256[] enemy) floorEnemy;
    mapping(uint256 floor => uint256[] equipment) floorEquipment;
    mapping(uint256 floor => uint256[] item) floorItem;
    mapping(uint256 playerId => uint256 random) nextRandom;
    mapping(uint256 playerId => bool) clearPlayer;
    mapping(uint256 playerId => uint256) deadFloor;
    mapping(uint256 playerId => uint256) lastTimeScore;

    uint256 topFloor;
    uint256 bossEnemy;
    uint256 revivePrice;
    bool initialized;

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor() { }

    function initializer(
        address feeDestination_,
        address stageFactoryContract_,
        uint256 topFloor_,
        uint256[][] memory floorEnemy_,
        uint256[][] memory equipment_
    )
        external
    {
        if (initialized) {
            revert ALREADY_INITIALIZED();
        }
        _initializeOwner(msg.sender);
        feeDestination = feeDestination_;

        stageFactoryContract = IStageFactory(payable(stageFactoryContract_));
        battleContract = IBattle(payable(stageFactoryContract.battleAddress()));
        enemyContract = IEnemy(payable(stageFactoryContract.enemyAddress()));
        equipmentContract = IEquipment(payable(stageFactoryContract.equipmentAddress()));
        randomContract = IRandom(stageFactoryContract.randomAddress());
        topFloor = topFloor_;
        revivePrice = 0.00001 ether;

        for (uint256 i = 0; i < topFloor_; i++) {
            this.updateArea(i, floorEnemy_[i], equipment_[i]);
        }
        initialized = true;
    }

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
    /// @notice Checks if
    modifier onlyStageFactory() {
        if (msg.sender != address(stageFactoryContract)) revert NOT_STAGE_FACTORY();
        _;
    }

    /*//////////////////////////////////////////////////////////////
                                  SET
    //////////////////////////////////////////////////////////////*/
    function setStageFactoryContract(address stageFactoryContract_) external onlyOwner {
        stageFactoryContract = IStageFactory(payable(stageFactoryContract_));
    }

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/

    function gameAction(uint256 playerId_, uint8 option_) external payable {
        if (status[playerId_].active == false) {
            status[playerId_] = PlayerStageStatus({
                playerId: playerId_,
                floor: 0,
                weapon: 0,
                shield: 0,
                gold: 0,
                hp: Constants.playerHP,
                attack: Constants.playerAttack,
                defense: Constants.playerDefense,
                active: true
            });
            emit GameStart(playerId_);
        }
        if (option_ != 0 && option_ != 1 && option_ != 2) {
            // revert INVALID_ACTION();
        }
        if (status[playerId_].floor == topFloor - 1 && option_ != 0) {
            option_ = 0;
            // revert INVALID_ACTION();
        }
        console2.log("gameAction: ", option_);

        _Action(playerId_, option_, getNextRondom(playerId_));

        nextRandom[playerId_] = randomContract.getRandomNumber();

        if (status[playerId_].floor == topFloor) {
            _gameClear(playerId_);
            console2.log("gameClear: ", playerId_);
        }
        address(feeDestination).safeTransferETH(msg.value);
    }

    function reviveUser(uint256 playerId_) external payable {
        if (status[playerId_].active) {
            revert PLAYER_IS_ACTIVE();
        }
        if (msg.value < revivePrice) {
            revert NOT_ENOUGH_ETH();
        }
        status[playerId_].active = true;
        status[playerId_].floor = deadFloor[playerId_];
        status[playerId_].gold = 0;
        status[playerId_].attack += 2;
        status[playerId_].defense += 1;
        status[playerId_].hp = Constants.playerHP;

        address(feeDestination).safeTransferETH(revivePrice);
        emit GameStartAgain(playerId_);
    }

    /*//////////////////////////////////////////////////////////////
                                  SET
    //////////////////////////////////////////////////////////////*/
    function updateArea(uint256 floor, uint256[] memory floorEnemy_, uint256[] memory equipment_) external payable {
        for (uint256 i = 0; i < floorEnemy_.length; i++) {
            if (enemyContract.exists(floorEnemy_[i]) == false) {
                revert CREATURE_NOT_EXISTS();
            }
            floorEnemy[floor] = floorEnemy_;
            floorEquipment[floor] = equipment_;
            floorItem[floor] = [1, 2, 3];
        }
        emit AreaUpdated(floor, floorEnemy_, equipment_);
    }

    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/
    function getAllNextAction(uint256 playerId_) public view returns (uint256, uint256, uint256, uint256) {
        return
            (getNextEnemy(playerId_), getNextEquipment(playerId_), getNextRestItem(playerId_), getNextRondom(playerId_));
    }

    function getNextRondom(uint256 playerId_) public view returns (uint256) {
        if (nextRandom[playerId_] == 0) {
            return playerId_;
        }
        return nextRandom[playerId_];
    }

    function getNextEnemy(uint256 playerId_) public view returns (uint256) {
        uint256 _randomNumber;
        if (status[playerId_].floor == topFloor) {
            _randomNumber = nextRandom[playerId_];
            _randomNumber = _randomNumber % floorEnemy[0].length;
            return floorEnemy[0][_randomNumber];
        }
        _randomNumber = nextRandom[playerId_];
        _randomNumber = _randomNumber % floorEnemy[status[playerId_].floor].length;

        return floorEnemy[status[playerId_].floor][_randomNumber];
    }

    function getNextEquipment(uint256 playerId_) public view returns (uint256) {
        uint256 _randomNumber;
        if (status[playerId_].floor == topFloor) {
            _randomNumber = nextRandom[playerId_];
            _randomNumber = _randomNumber % floorEquipment[0].length;
            return floorEquipment[0][_randomNumber];
        }
        _randomNumber = nextRandom[playerId_];
        _randomNumber = _randomNumber % floorEquipment[status[playerId_].floor].length;

        return floorEquipment[status[playerId_].floor][_randomNumber];
    }

    function getNextRestItem(uint256 playerId_) public view returns (uint256) {
        uint256 _randomNumber;
        if (status[playerId_].floor == topFloor) {
            _randomNumber = nextRandom[playerId_];
            _randomNumber = _randomNumber % floorItem[0].length;
            return floorItem[0][_randomNumber];
        }
        _randomNumber = nextRandom[playerId_];
        _randomNumber = _randomNumber % floorItem[status[playerId_].floor].length;

        return floorItem[status[playerId_].floor][_randomNumber];
    }

    function gameClear(uint256 playerId_) public view returns (bool) {
        return clearPlayer[playerId_];
    }

    function playerStageStatus(uint256 playerId_) public view returns (PlayerStageStatus memory) {
        if (status[playerId_].active == false) {
            return PlayerStageStatus({
                playerId: playerId_,
                floor: status[playerId_].floor,
                weapon: 0,
                shield: 0,
                gold: 0,
                hp: Constants.playerHP,
                attack: Constants.playerAttack,
                defense: Constants.playerDefense,
                active: false
            });
        }
        return status[playerId_];
    }

    function getStageFactoryContract() public view returns (IStageFactory) {
        return stageFactoryContract;
    }

    function getTopFloor() public view returns (uint256) {
        return topFloor;
    }

    function getUserFloor(uint256 playerId) public view returns (uint256) {
        return status[playerId].floor;
    }

    function getLastTimeScore(uint256 playerId) public view returns (uint256) {
        return lastTimeScore[playerId];
    }
    /*//////////////////////////////////////////////////////////////
                            INTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/

    function _gameOver(uint256 playerId_) internal {
        console2.log("gameOver: ", playerId_);
        status[playerId_].active = false;
        deadFloor[playerId_] = status[playerId_].floor;
        lastTimeScore[playerId_] = status[playerId_].gold;
        status[playerId_].floor = 0;
        emit GameOver(playerId_);
    }

    function _gameClear(uint256 playerId_) internal {
        status[playerId_].active = false;
        clearPlayer[playerId_] = true;
        lastTimeScore[playerId_] = status[playerId_].gold;
        emit GameClear(playerId_, status[playerId_].gold);
    }

    function _Action(uint256 playerId_, uint8 option_, uint256 randomNumber_) internal {
        bool skipped = false;
        if (option_ == 0) {
            uint256 random = randomNumber_ % floorEnemy[status[playerId_].floor].length;
            uint256 enemyId = floorEnemy[status[playerId_].floor][random];
            uint256 resultHp = battleContract.battle(status[playerId_], enemyId);

            status[playerId_].hp = resultHp;
            status[playerId_].gold += enemyContract.status(enemyId).gold;
            if (status[playerId_].hp == 0) {
                _gameOver(playerId_);
            } else {
                status[playerId_].floor++;
            }

            emit BattleResult(playerId_, enemyId, resultHp, status[playerId_].hp, status[playerId_].gold);
        } else if (option_ == 1) {
            uint256 random = randomNumber_ % floorEquipment[status[playerId_].floor].length;
            console2.log("equipment: ", random);
            uint256 equipmentId = floorEquipment[status[playerId_].floor][random];
            EquipmentData memory data = equipmentContract.getData(equipmentId);
            console2.log("equipment purchased: ", data.price, status[playerId_].gold);
            if (status[playerId_].gold < data.price) {
                // revert NOT_ENOUGH_GOLD();
                emit NotEnoughGold(playerId_, data.price, status[playerId_].gold);
                skipped = true;
            } else {
                status[playerId_].gold -= data.price;
                EquipmentData memory theOtherData;
                if (data.isWeapon) {
                    status[playerId_].weapon = equipmentId;
                    theOtherData = equipmentContract.getData(status[playerId_].shield);
                } else {
                    status[playerId_].shield = equipmentId;
                    theOtherData = equipmentContract.getData(status[playerId_].weapon);
                }
                status[playerId_].attack = Constants.playerAttack + data.attack + theOtherData.attack;
                status[playerId_].defense = Constants.playerDefense + data.defense + theOtherData.defense;
                console2.log("equipment purchased: ", status[playerId_].attack, status[playerId_].defense);
                emit EquipmentPurchased(
                    playerId_,
                    equipmentId,
                    data.price,
                    status[playerId_].gold,
                    status[playerId_].attack,
                    status[playerId_].defense
                );
            }
            status[playerId_].floor++;
        } else if (option_ == 2) {
            uint256 random = randomNumber_ % floorItem[status[playerId_].floor].length;
            uint256 itemId = floorItem[status[playerId_].floor][random];

            if (itemId == 1 && status[playerId_].gold >= 5) {
                status[playerId_].gold -= 5;
                status[playerId_].hp += 5;
                console2.log("rest: ", itemId, status[playerId_].hp);
            } else if (itemId == 2 && status[playerId_].gold >= 10) {
                status[playerId_].gold -= 10;
                status[playerId_].hp += 10;
                console2.log("rest: ", itemId, status[playerId_].hp);
            } else if (itemId == 3 && status[playerId_].gold >= 15) {
                status[playerId_].gold -= 15;
                status[playerId_].hp += 15;
                console2.log("rest: ", itemId, status[playerId_].hp);
            } else {
                // revert NOT_ENOUGH_GOLD();
                skipped = true;
                emit NotEnoughGold(playerId_, itemId, status[playerId_].gold);
            }

            if (status[playerId_].hp > Constants.playerHP) {
                status[playerId_].hp = Constants.playerHP;
            }
            status[playerId_].floor++;
            emit RestResult(playerId_, itemId, status[playerId_].hp, status[playerId_].gold);
        } else {
            // revert INVALID_ACTION();
            skipped = true;
        }
        emit ActionEnd(playerId_, option_, status[playerId_].floor, skipped);
    }
    /*//////////////////////////////////////////////////////////////
                                DEFAULTS
    //////////////////////////////////////////////////////////////*/
    // Receive function to receive ETH

    receive() external payable { }
}
