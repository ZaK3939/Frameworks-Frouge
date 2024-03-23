// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

struct EquipmentData {
    string name;
    bool isWeapon;
    uint256 attack;
    uint256 defense;
    uint256 price;
}

interface IEquipment {
    // Errors

    // Initializer/Contstructor Function

    // Structs

    // Events
    event EquipmentCreated(uint256 indexed id, EquipmentData equipment);
    // Update Functions

    function create(uint256 _id, EquipmentData memory _equipment) external;

    // Read Functions
    function getData(uint256 _id) external returns (EquipmentData memory);

    // function currentHp(uint256 _id) external returns (uint256);

    // Callbacks
}
