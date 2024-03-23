// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

interface IRandom {
    // Errors

    // Initializer/Contstructor Function

    // Structs

    // Events

    // Update Functions
    function getRandomNumber() external returns (uint256);

    function getRandomNumbers(uint8 _i) external returns (uint256[] memory randomNumbers_);

    // Read Functions

    // Callbacks
}
