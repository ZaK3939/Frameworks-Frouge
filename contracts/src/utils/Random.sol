// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { console2 } from "forge-std/console2.sol";
import { IRandom } from "../interfaces/IRandom.sol";

/// @title Random
/// @author yamapyblack
/// @notice

contract Random is IRandom {
    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint256 randomId;

    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/

    function getRandomNumber() external returns (uint256) {
        return uint256(keccak256(abi.encodePacked(randomId++, tx.origin)));
        // return uint256(keccak256(abi.encodePacked(randomId++, block.prevrandao, block.timestamp, tx.origin)));
    }

    function getRandomNumbers(uint8 _i) external returns (uint256[] memory randomNumbers_) {
        uint256 _randomId = randomId;
        for (uint8 i = 0; i < _i;) {
            randomNumbers_[i] =
                uint256(keccak256(abi.encodePacked(_randomId++, block.prevrandao, block.timestamp, tx.origin)));
            unchecked {
                i++;
            }
        }
        unchecked {
            randomId += _i;
        }
    }

    /*//////////////////////////////////////////////////////////////
                                DEFAULTS
    //////////////////////////////////////////////////////////////*/
}
