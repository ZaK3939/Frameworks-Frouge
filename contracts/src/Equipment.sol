// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { console2 } from "forge-std/console2.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { IEquipment, EquipmentData } from "./interfaces/IEquipment.sol";

contract Equipment is IEquipment, Ownable {
    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    mapping(uint256 => EquipmentData) public equipment;

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
    function create(uint256 _id, EquipmentData memory _equipment) external onlyOwner {
        equipment[_id] = _equipment;
        emit EquipmentCreated(_id, _equipment);
    }
    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/

    function getData(uint256 _id) external view override returns (EquipmentData memory) {
        return equipment[_id];
    }
}
