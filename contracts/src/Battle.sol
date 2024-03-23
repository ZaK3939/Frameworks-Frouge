// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { console2 } from "forge-std/console2.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { IEnemy, Status } from "./interfaces/IEnemy.sol";
import { IStage, PlayerStageStatus } from "./interfaces/IStage.sol";
import { IRandom } from "./interfaces/IRandom.sol";
import { IBattle, CurrentStatus } from "./interfaces/IBattle.sol";

/// @title Battle
/// @author yamapyblack
/// @notice

//TODO upgradable
contract Battle is IBattle, Ownable {
    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint8 public constant maxLoop = 100;
    IEnemy public enemy;
    IRandom public random;

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    /// @custom:oz-upgrades-unsafe-allow constructor
    // solhint-disable-next-line func-visibility
    constructor(address _enemyAddress, address _randomAddress) {
        _setEnemy(_enemyAddress);
        random = IRandom(_randomAddress);
    }

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
    /// @notice

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/

    function battle(
        PlayerStageStatus calldata _playerStageData,
        uint256 _enemyId
    )
        external
        returns (uint256 playerHp_)
    {
        _startBattle();
        Status memory _playerStatus = Status({
            name: "player",
            hp: _playerStageData.hp,
            attack: _playerStageData.attack,
            defense: _playerStageData.defense,
            gold: _playerStageData.gold
        });
        // console2.log("playerStatus: ", _playerStatus.hp, _playerStatus.attack, _playerStatus.defense);
        Status memory _enemyStatus = enemy.status(_enemyId);
        // console2.log("enemyStatus: ", _enemyStatus.hp, _enemyStatus.attack, _enemyStatus.defense);
        CurrentStatus memory _playerHp = CurrentStatus(_playerStageData.hp);
        CurrentStatus memory _enemyHp = CurrentStatus(_enemyStatus.hp);

        for (uint8 i = 0; i < maxLoop; i++) {
            // attack by player
            // console2.log("attack by player");
            _attackByPlayer(_playerStatus, _playerHp, _enemyStatus, _enemyHp);
            if (_enemyHp.hp <= 0) {
                playerHp_ = _playerHp.hp;
                break;
            }

            // attack by enemy
            // console2.log("attack by enemy");
            _attackByEnemy(_enemyStatus, _enemyHp, _playerStatus, _playerHp);
            if (_playerHp.hp <= 0) {
                playerHp_ = 0;
                break;
            }
        }
        _endBattle();
    }

    /*//////////////////////////////////////////////////////////////
                                  SET
    //////////////////////////////////////////////////////////////*/
    function setEnemy(address _enemyAddress) external onlyOwner {
        _setEnemy(_enemyAddress);
    }

    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                             INTERNAL VIEW
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                            INTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/
    function _setEnemy(address _enemyAddress) internal {
        enemy = IEnemy(_enemyAddress);
    }

    function _startBattle() internal { }

    function _endBattle() internal { }

    function _attackByPlayer(
        Status memory _playerStatus,
        CurrentStatus memory _playerHp,
        Status memory _enemyStatus,
        CurrentStatus memory _enemyHp
    )
        internal
    {
        _attack(_playerStatus, _playerHp, _enemyStatus, _enemyHp);
    }

    function _attackByEnemy(
        Status memory _enemyStatus,
        CurrentStatus memory _enemyHp,
        Status memory _playerStatus,
        CurrentStatus memory _playerHp
    )
        internal
    {
        _attack(_enemyStatus, _enemyHp, _playerStatus, _playerHp);
    }

    /**
     * @dev damage = attack * random - defense
     */
    function _attack(
        Status memory _attackerStatus,
        CurrentStatus memory,
        Status memory _defenderStatus,
        CurrentStatus memory _defenderHp
    )
        internal
    {
        uint256 _damage = _attackerStatus.attack;

        // actual damage is volatile from -1 to +1
        uint256 _randomNumber = random.getRandomNumber();
        _randomNumber = _randomNumber % 3;
        if (_randomNumber == 1) {
            _damage = _damage + 1;
        } else if (_randomNumber == 2) {
            _damage = _damage - 1;
        }

        //consider defense
        if (_damage < _defenderStatus.defense) {
            _damage = 0;
        } else {
            unchecked {
                _damage -= _defenderStatus.defense;
            }
        }

        if (_defenderHp.hp < _damage) {
            _damage = _defenderHp.hp;
        }
        unchecked {
            _defenderHp.hp -= _damage;
        }
    }

    /*//////////////////////////////////////////////////////////////
                                DEFAULTS
    //////////////////////////////////////////////////////////////*/
}
