// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { Status } from "./IEnemy.sol";
import { PlayerStageStatus } from "./IStage.sol";

struct CurrentStatus {
    uint256 hp;
}

interface IBattle {
    // Errors

    // Initializer/Contstructor Function

    // Structs

    // Events

    // Update Functions
    function battle(
        PlayerStageStatus memory _playerStgaeStatus,
        uint256 _enemyId
    )
        external
        returns (uint256 playerHp_);

    // Read Functions

    // Callbacks
}
