// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

struct Status {
    string name;
    uint256 hp;
    uint256 attack;
    uint256 defense;
    uint256 gold;
}

interface IEnemy {
    // Errors

    // Initializer/Contstructor Function

    // Structs

    // Events
    event EnemyCreated(uint256 indexed id, Status status);

    // Update Functions
    function create(uint256 _id, Status memory _status) external;

    // Read Functions
    function status(uint256 _id) external returns (Status memory);
    function exists(uint256 _id) external returns (bool);
    // function currentHp(uint256 _id) external returns (uint256);

    // Callbacks
}
