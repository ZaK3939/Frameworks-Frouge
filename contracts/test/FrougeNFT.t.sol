// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.23;

import { console2 } from "forge-std/console2.sol";

import { Test } from "forge-std/Test.sol";

import { FrougeNFT } from "../src/FrougeNFT.sol";

interface IERC1155 {
    function balanceOf(address account, uint256 id) external view returns (uint256);
}

contract FrougeNFTTest is Test {
    FrougeNFT public demo1155;

    address internal owner = makeAddr("owner");
    address internal alice = makeAddr("alice");
    address internal anyone = makeAddr("anyone");
    address internal signer;
    uint256 internal signerPk;

    error Unauthorized();

    function setUp() public {
        (signer, signerPk) = makeAddrAndKey("signer");
        console2.log("signer", signer);
        demo1155 = new FrougeNFT(signer);
    }

    function testFuzz_mint_validSig() public {
        bytes memory sig = _signMint(signerPk, alice, 1, 20_225, 10);

        vm.prank(anyone);
        demo1155.mint(alice, 1, 20_225, 10, sig);

        assertEq(demo1155.hasMinted(20_225), true);
        assertEq(demo1155.balanceOf(alice, 1), 1);
    }

    function _signMint(
        uint256 pk,
        address to,
        uint256 tokenId,
        uint256 fid,
        uint256 score
    )
        public
        returns (bytes memory signature)
    {
        bytes32 digest =
            demo1155.hashTypedData(keccak256(abi.encode(demo1155.MINT_TYPEHASH(), to, tokenId, fid, score)));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(pk, digest);
        signature = abi.encodePacked(r, s, v);
        assertEq(signature.length, 65);
    }
}
