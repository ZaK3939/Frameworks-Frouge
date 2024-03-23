// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.23 <0.9.0;

import { console2 } from "forge-std/console2.sol";

import { Upgrades } from "openzeppelin-foundry-upgrades/Upgrades.sol";
import { StageFactory } from "../src/StageFactory.sol";
import { Stage } from "../src/Stage.sol";
import { Enemy } from "../src/Enemy.sol";
import { Equipment } from "../src/Equipment.sol";
import { IEnemy, Status } from "../src/interfaces/IEnemy.sol";
import { IEquipment, EquipmentData } from "../src/interfaces/IEquipment.sol";
import { IStageFactory } from "../src/interfaces/IStageFactory.sol";
import { Random } from "../src/utils/Random.sol";
import { BaseScript } from "./Base.s.sol";
import { Battle } from "../src/Battle.sol";
import { LibClone } from "solady/utils/LibClone.sol";
import { FrougeNFT } from "../src/FrougeNFT.sol";

contract DeployAndSetting is BaseScript {
    IEnemy internal enemy;
    IEquipment internal equipment;
    Stage internal stage;
    StageFactory internal stageFactory;
    FrougeNFT internal frouge;

    uint256[][] _floorEnemy;
    uint256[][] _equipment;

    function setUp() public virtual { }

    function run()
        public
        broadcast
        returns (
            address enemyAddress,
            address equipmentAddress,
            address stageAddress,
            address stageFactoryAddress,
            address frougeAddress
        )
    {
        enemy = new Enemy(broadcaster);
        equipment = new Equipment(broadcaster);
        Random random = new Random();
        Battle battle = new Battle(address(enemy), address(random));
        stage = new Stage();
        frouge = new FrougeNFT(broadcaster);

        console2.log("Deploying StageFactory...");
        console2.log("from", broadcaster);
        address stageFactoryProxy = Upgrades.deployTransparentProxy(
            "StageFactory.sol",
            broadcaster,
            abi.encodeCall(
                StageFactory.initialize,
                (
                    broadcaster,
                    payable(address(stage)),
                    address(battle),
                    address(enemy),
                    address(equipment),
                    address(random)
                )
            )
        );

        console2.log("Setting initialEnemy and Equipment...");
        enemy.create(101, Status("slime", 6, 2, 0, 10));
        enemy.create(102, Status("rat", 10, 3, 0, 13));
        enemy.create(103, Status("green_slime", 12, 3, 0, 15));
        enemy.create(104, Status("red_vat", 15, 4, 0, 20));
        enemy.create(105, Status("king_frog", 30, 5, 0, 40));
        equipment.create(1, EquipmentData("stick", true, 2, 0, 7));
        equipment.create(2, EquipmentData("sling_shot", true, 7, 0, 25));
        equipment.create(3, EquipmentData("shield", false, 0, 1, 8));

        console2.log("Deploying Stage form StageFactory...");
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

        console2.log("_floorEnemy length", _floorEnemy.length);
        console2.log("_equipment length", _equipment.length);
        stage.initializer(broadcaster, stageFactoryProxy, 10, _floorEnemy, _equipment);
        return (address(enemy), address(equipment), address(stage), stageFactoryProxy, address(frouge));
    }
}
