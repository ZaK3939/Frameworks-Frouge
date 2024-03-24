// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { Ownable } from "solady/auth/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract PrivyNFTDrops is Ownable, ERC1155Supply {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    mapping(address => mapping(uint256 tokenId => bool)) public hasMinted;
    mapping(uint256 tokenId => string) public tokenURIs;
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/

    event TokenURISet(string tokenURI);
    event Mint(address indexed to, uint256 indexed tokenId);

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(address ownerAddress_) ERC1155("") {
        _initializeOwner(ownerAddress_);
    }

    function name() public pure returns (string memory) {
        return "PrivyNFTDrops";
    }

    /// @dev Returns the token collection symbol.
    function symbol() public pure returns (string memory) {
        return "PrivyNFT-Drops";
    }

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/
    function mint(address to, uint256 tokenId) external {
        hasMinted[to][tokenId] = true;
        emit Mint(to, tokenId);

        _mint(to, tokenId, 1, "");
    }

    /*//////////////////////////////////////////////////////////////
                                  SET
    //////////////////////////////////////////////////////////////*/
    function setTokenURI(uint256 tokenId, string memory tokenURI) public onlyOwner {
        tokenURIs[tokenId] = tokenURI;
        emit TokenURISet(tokenURI);
    }

    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/
    // Returns the URI for a token ID
    function uri(uint256 tokenId) public view override returns (string memory) {
        return tokenURIs[tokenId];
    }

    receive() external payable { }
}
