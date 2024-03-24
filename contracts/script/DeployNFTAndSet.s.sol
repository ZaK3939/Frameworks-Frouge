// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.23 <0.9.0;

import { console2 } from "forge-std/console2.sol";
import { BaseScript } from "./Base.s.sol";

import { PrivyNFTDrops } from "../src/PrivyNFTDrops.sol";

contract DeployNFTAndSet is BaseScript {
    PrivyNFTDrops internal privyNFT;

    function setUp() public virtual { }

    function run() public broadcast returns (address pivyNFTAddress) {
        console2.log("Deploying PrivyNFTDrops...");
        console2.log("from", broadcaster);

        privyNFT = new PrivyNFTDrops(broadcaster);
        // slime
        privyNFT.setTokenURI(1, "http://arweave.net/B6d35qUvXZxH3FbdCHqrStN5JKwpCtIN__47A60ONQo");
        // rat
        privyNFT.setTokenURI(2, "http://arweave.net/SMVfymR4-Qaks4xdrPaDL23cBXSm3CwIjLDLFBVePlE");
        // green slime
        privyNFT.setTokenURI(3, "http://arweave.net/buxDmFhDVaD0Z_PCLcnzJPWnj2PGM68p_R14VybXbl0");
        // red_vat
        privyNFT.setTokenURI(4, "http://arweave.net/Bpqut3vU7LA7yTg0BvGc9RMHJSewVYWfVzD4lEVXVgg");
        // king_frog
        privyNFT.setTokenURI(5, "http://arweave.net/Uamv4WgdpECy_mXkz8WD6-2gq7C-Ca9FPmp_2ZCZpIg");
        // stick
        privyNFT.setTokenURI(6, "http://arweave.net/V_-nZFs1sZChgxdbRCYPJ4o6iowBmulqJLY4HQHEWLU");
        // silig shot
        privyNFT.setTokenURI(7, "http://arweave.net/LvRZ6xuEIbOf5ExIOywJ6OyBHT4HTVtPm6Afq29d554");
        // shield
        privyNFT.setTokenURI(8, "http://arweave.net/bLtQSZVdsGbE-XZ2I6CkfrKit44rFB9_5jf7KnUihWo");
        // apple
        privyNFT.setTokenURI(9, "http://arweave.net/m5LoBqBFzv8kY94eWFGGRewX4g7AKmcZ6KuDw1fZjMU");
        // steak
        privyNFT.setTokenURI(10, "http://arweave.net/b0CCQRLKsGkiAqTafoFJ2_tuygVn5tWDPodiXXt_NB8");
        // restorative
        privyNFT.setTokenURI(11, "http://arweave.net/QthZHr5_kvSsKy1kRV2JY-9Kd5AB95BcmKTG8-9zAgk");

        return address(privyNFT);
    }
}
