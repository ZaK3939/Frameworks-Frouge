// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.23;

import { console2 } from "forge-std/console2.sol";

import { PRBTest } from "@prb/test/src/PRBTest.sol";
import { Test } from "forge-std/Test.sol";

import { Settings } from "./helpers/Settings.sol";

import { ECDSA } from "solady/utils/ECDSA.sol";
import { LibZip } from "solady/utils/LibZip.sol";

import { IStage } from "../src/interfaces/IStage.sol";
import { Constants } from "../src/lib/Constants.sol";

contract TestStageFactory is Settings {
    uint256[][] _floorEnemy;
    uint256[][] _equipment;

    function setUp() public override {
        super.setUp();

        _floorEnemy = new uint256[][](10);
        for (uint256 i = 0; i < 10; i++) {
            if (i < 9) {
                _floorEnemy[i] = new uint256[](4);
            } else {
                _floorEnemy[i] = new uint256[](1);
            }
        }
        for (uint256 i = 0; i < 9; i++) {
            for (uint256 j = 0; j < 4; j++) {
                _floorEnemy[i][j] = 101 + j;
            }
        }
        _floorEnemy[9][0] = 105;

        _equipment = new uint256[][](10);
        for (uint256 i = 0; i < 10; i++) {
            _equipment[i] = new uint256[](3);
        }
        for (uint256 i = 0; i < 10; i++) {
            for (uint256 j = 0; j < 3; j++) {
                _equipment[i][j] = j + 1;
            }
        }
    }

    /*//////////////////////////////////////////////////////////////
                                CLAIM
    //////////////////////////////////////////////////////////////*/
    function test_gameOverStage() public {
        vm.prank(anyone);
        console2.log("Deploying Stage form StageFactory...");
        address stage = stageFactory.createGameStage("stage1", 10, _floorEnemy, _equipment);
        assertEq(IStage(stage).getTopFloor(), 10);
        console2.log("action for floor 0");
        IStage(stage).gameAction(1, 0);
        assertEq(IStage(stage).playerStageStatus(1).active, true, "player should be active");
        assertEq(IStage(stage).getUserFloor(1), 1);
        console2.log("action for floor 1");
        IStage(stage).gameAction(1, 1); // move to floor 1; option 1
        assertEq(IStage(stage).getUserFloor(1), 2);
        console2.log("action for floor 2");
        IStage(stage).gameAction(1, 2); // move to floor 2; option 2
        assertEq(IStage(stage).getUserFloor(1), 3);
        console2.log("action for floor 3");
        IStage(stage).gameAction(1, 2); // move to floor 3; option 3
        assertEq(IStage(stage).getUserFloor(1), 4);
        console2.log("action for floor 4");
        IStage(stage).gameAction(1, 0);
        assertEq(IStage(stage).getUserFloor(1), 5);
        console2.log("action for floor 5");
        IStage(stage).gameAction(1, 2);
        assertEq(IStage(stage).getUserFloor(1), 6);
        console2.log("action for floor 6");
        IStage(stage).gameAction(1, 1);

        assertEq(IStage(stage).getUserFloor(1), 7);
        console2.log("action for floor 7");
        IStage(stage).gameAction(1, 0);
        assertEq(IStage(stage).getUserFloor(1), 8);
        console2.log("action for floor 8");
        IStage(stage).gameAction(1, 2);
        assertEq(IStage(stage).getUserFloor(1), 9);
        assertEq(IStage(stage).getNextEnemy(1), 105, "should be king frog");
        console2.log("action for floor 9:boss floor");
        IStage(stage).gameAction(1, 0);
        console2.log("HP", IStage(stage).playerStageStatus(1).hp);
        assertEq(IStage(stage).getUserFloor(1), 0); //game over
        assertEq(IStage(stage).playerStageStatus(1).active, false, "player should be inactive");
        IStage(stage).reviveUser{ value: 0.00001 ether }(1);
        assertEq(IStage(stage).playerStageStatus(1).active, true, "player should be inactive");
        assertEq(IStage(stage).getUserFloor(1), 9);
        assertEq(IStage(stage).playerStageStatus(1).hp, Constants.playerHP);
        console2.log("Again action for floor 9:boss floor");
        IStage(stage).gameAction(1, 0);
        assertEq(IStage(stage).getUserFloor(1), 10); //game clear
        assertEq(IStage(stage).playerStageStatus(1).active, false, "player should be inactive");
        assertEq(IStage(stage).playerStageStatus(1).gold, 0);
        assertEq(IStage(stage).gameClear(1), true);
    }
}
