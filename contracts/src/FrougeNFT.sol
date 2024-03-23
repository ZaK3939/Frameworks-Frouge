// SPDX-License-Identifier: MIT
pragma solidity 0.8.23;

import { EIP712 } from "solady/utils/EIP712.sol";
import { Ownable } from "solady/auth/Ownable.sol";
import { SignatureCheckerLib } from "solady/utils/SignatureCheckerLib.sol";
import { LibString } from "solady/utils/LibString.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

contract FrougeNFT is Ownable, ERC1155Supply, EIP712 {
    /*//////////////////////////////////////////////////////////////
                                 USING
    //////////////////////////////////////////////////////////////*/
    using LibString for *;

    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/
    /// @notice Token has already been claimed for this fid
    error AlreadyMinted();

    /// @notice Caller provided invalid `Mint` signature
    error InvalidSignature();

    /*//////////////////////////////////////////////////////////////
                                STORAGE
    //////////////////////////////////////////////////////////////*/
    uint256 public currentTokenId = 0;
    string public baseURI;
    /// @notice Address authorized to sign `Mint` messages
    address public signer;

    /// @notice Mapping tracking fids that have minted
    mapping(uint256 fid => bool) public hasMinted;

    struct ScoreData {
        uint256 score;
        uint256 timestamp;
    }

    mapping(uint256 fid => ScoreData) public scoreData;

    /// @notice EIP-712 typehash for `Mint` message
    bytes32 public constant MINT_TYPEHASH = keccak256("Mint(address to,uint256 tokenId,uint256 fid,uint256 score)");

    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    event BaseTokenURISet(string tokenURI);
    /// @notice Emitted when a user mints through the Frame server
    event Mint(address indexed to, uint256 indexed tokenId, uint256 indexed fid, uint256 score);
    /// @notice emitted when owner changes the signer address
    event SetSigner(address oldSigner, address newSigner);

    /*//////////////////////////////////////////////////////////////
                              CONSTRUCTOR
    //////////////////////////////////////////////////////////////*/
    constructor(address ownerAddress_) ERC1155("") {
        _initializeOwner(ownerAddress_);
        signer = ownerAddress_;

        // Update this with your own NFT collection's metadata
        baseURI = "https://www.arweave.net/";
    }

    /*//////////////////////////////////////////////////////////////
                            EXTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/
    function mint(address to, uint256 tokenId, uint256 fid, uint256 score, bytes calldata sig) external {
        if (!_verifySignature(to, tokenId, fid, score, sig)) {
            revert InvalidSignature();
        }

        hasMinted[fid] = true;
        scoreData[fid] = ScoreData(score, block.timestamp);
        emit Mint(to, tokenId, fid, score);
        ++currentTokenId;
        _mint(to, currentTokenId, 1, "");
    }

    /*//////////////////////////////////////////////////////////////
                                  SET
    //////////////////////////////////////////////////////////////*/
    // Set the token URI for all tokens that don't have a custom tokenURI set.
    // Must be called by the owner given its global impact on the collection
    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
        emit BaseTokenURISet(baseURI);
    }

    /// @notice Set signer address. Only callable by owner.
    /// @param _signer New signer address
    function setSigner(address _signer) external onlyOwner {
        emit SetSigner(signer, signer = _signer);
    }

    /*//////////////////////////////////////////////////////////////
                             EXTERNAL VIEW
    //////////////////////////////////////////////////////////////*/
    // Returns the URI for a token ID
    function uri(uint256 tokenId) public view override returns (string memory) {
        // return string.concat(baseURI, tokenId.toString());
        return string.concat(baseURI, "e5ZoMobGYbQiXxO50tswTPuRC-GOeqrGg3AEZTNcpKA");
    }

    /// @dev EIP-712 helper.
    function hashTypedData(bytes32 structHash) public view returns (bytes32) {
        return _hashTypedData(structHash);
    }
    /*//////////////////////////////////////////////////////////////
                            INTERNAL UPDATE
    //////////////////////////////////////////////////////////////*/
    /// @dev EIP-712 domain name and contract version.

    function _domainNameAndVersion() internal pure override returns (string memory, string memory) {
        return ("FROUGE NFT MINT", "1");
    }

    /// @dev Verify EIP-712 `Mint` signature.
    function _verifySignature(
        address to,
        uint256 tokenId,
        uint256 fid,
        uint256 score,
        bytes calldata sig
    )
        internal
        view
        returns (bool)
    {
        bytes32 digest = _hashTypedData(keccak256(abi.encode(MINT_TYPEHASH, to, tokenId, fid, score)));
        return SignatureCheckerLib.isValidSignatureNowCalldata(signer, digest, sig);
    }

    receive() external payable { }
}
