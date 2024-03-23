// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { console2 } from "forge-std/console2.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { IEnemy, Status } from "./interfaces/IEnemy.sol";

contract Enemy is IEnemy, Ownable {
    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    mapping(uint256 => Status) public status_;

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    /// @custom:oz-upgrades-unsafe-allow constructor
    // solhint-disable-next-line func-visibility
    constructor(address ownerAddress_) {
        _initializeOwner(ownerAddress_);
    }

    /*//////////////////////////////////////////////////////////////
                                  SET
    //////////////////////////////////////////////////////////////*/
    function create(uint256 _id, Status memory _status) external onlyOwner {
        status_[_id] = _status;
        emit EnemyCreated(_id, _status);
    }
    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/

    function status(uint256 _id) external view override returns (Status memory) {
        return status_[_id];
    }

    function exists(uint256 _id) external view returns (bool) {
        return status_[_id].hp != 0;
    }
}
