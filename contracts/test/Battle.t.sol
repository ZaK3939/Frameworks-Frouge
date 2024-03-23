// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.23 <0.9.0;

import { PRBTest } from "@prb/test/src/PRBTest.sol";
import { console2 } from "forge-std/console2.sol";
import { StdCheats } from "forge-std/StdCheats.sol";

import { IRandom } from "../src/interfaces/IRandom.sol";
import { Battle, Status } from "../src/Battle.sol";
import { Random } from "../src/utils/Random.sol";
import { CreatureMock } from "../src/mocks/CreatureMock.sol";
import { PlayerStageStatus } from "../src/interfaces/IStage.sol";
import { Settings } from "./helpers/Settings.sol";

/// @dev If this is your first time with Forge, read this tutorial in the Foundry Book:
/// https://book.getfoundry.sh/forge/writing-tests
contract BattleTest is Settings {
    /// @dev A function invoked before each test case is run.

    function setUp() public override {
        super.setUp();
        // Instantiate the contract-under-test.
    }

    /// @dev Basic test. Run it with `forge test -vvv` to see the console log.
    function test_Constructor() external {
        assertEq(address(battle.enemy()), address(enemy));
    }

    function test_battle() external {
        playerStatus = PlayerStageStatus({
            playerId: 1,
            floor: 1,
            gold: 0,
            weapon: 1,
            shield: 0,
            hp: 100,
            attack: 50,
            defense: 10,
            active: true
        });
        uint256 playerHP = battle.battle(playerStatus, 101);
        assert(playerHP > 0);
    }
}
