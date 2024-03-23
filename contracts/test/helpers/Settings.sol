// SPDX-License-Identifier: Unlicense
pragma solidity 0.8.23;

import { PRBTest } from "@prb/test/src/PRBTest.sol";
import { Test } from "forge-std/Test.sol";
import { Stage } from "../../src/Stage.sol";
import { StageFactory } from "../../src/StageFactory.sol";
import { CreatureMock } from "../../src/mocks/CreatureMock.sol";
import { Enemy } from "../../src/Enemy.sol";
import { Equipment } from "../../src/Equipment.sol";
import { IRandom } from "../../src/interfaces/IRandom.sol";
import { IEnemy } from "../../src/interfaces/IEnemy.sol";
import { IEquipment, EquipmentData } from "../../src/interfaces/IEquipment.sol";
import { Status } from "../../src/Battle.sol";
import { Random } from "../../src/utils/Random.sol";
import { LibClone } from "solady/utils/LibClone.sol";
import { console2 } from "forge-std/console2.sol";
import { Battle } from "../../src/Battle.sol";
import { PlayerStageStatus } from "../../src/interfaces/IStage.sol";

contract Settings is Test {
    address anyone;
    address owner;

    IRandom internal random;
    IEnemy internal enemy;
    IEquipment internal equipment;
    Battle internal battle;
    StageFactory stageFactory;

    PlayerStageStatus playerStatus;

    using LibClone for address;

    function setUp() public virtual {
        anyone = makeAddr(("anyone"));
        owner = makeAddr(("owner"));

        vm.deal(owner, 1 ether);
        vm.deal(anyone, 1 ether);

        enemy = new Enemy(owner);
        equipment = new Equipment(owner);
        random = new Random();

        battle = new Battle(address(enemy), address(random));

        address payable stageFactoryAddress = payable(
            address(new StageFactory()).cloneDeterministic(keccak256(abi.encodePacked(msg.sender, "SALT")))
        );
        stageFactory = StageFactory(stageFactoryAddress);
        stageFactory.initialize(
            owner,
            payable(address(new Stage())),
            address(battle),
            address(enemy),
            address(equipment),
            address(random)
        );

        vm.startPrank(owner);
        enemy.create(101, Status("slime", 6, 2, 0, 10));
        enemy.create(102, Status("rat", 10, 3, 0, 13));
        enemy.create(103, Status("green_slime", 12, 3, 0, 15));
        enemy.create(104, Status("red_vat", 15, 4, 0, 20));
        enemy.create(105, Status("king_frog", 30, 5, 0, 40));
        equipment.create(1, EquipmentData("stick", true, 2, 0, 7));
        equipment.create(2, EquipmentData("sling_shot", true, 7, 0, 25));
        equipment.create(3, EquipmentData("shield", false, 0, 1, 8));
        vm.stopPrank();
    }
}
