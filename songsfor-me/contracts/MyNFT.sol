// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

import "./Royalty.sol";

contract BullchordNFT is ERC721A, Ownable {
    string private baseTokenURI;
    bool public mintEnabled = true;
    uint256 public constant i_MAX_SUPPLY = 10;

    uint256 public royaltyBasisPoints = 500; 
    address public royaltyRecipient;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _tokenUri,
        address _royaltyRecipient
    ) ERC721A(_name, _symbol) {
        baseTokenURI = _tokenUri;
        royaltyRecipient = _royaltyRecipient;
    }

    /**
     * @dev Mints 10 NFTs to the owner if minting is enabled and the max supply is not reached.
     */
    function mint() external {
        require(mintEnabled, "Minting is Disabled");
        require(
            totalSupply() + 10 <= i_MAX_SUPPLY,
            "Total Supply is maxed out"
        );
        _mint(msg.sender, 10);
        mintEnabled = false;
    }

    function royaltyInfo(
        uint256 tokenId,
        uint256 salePrice
    ) external view returns (address, uint256) {
        require(_exists(tokenId), "Token does not exist");
        uint256 royaltyAmount = (salePrice * royaltyBasisPoints) / 10000;
        return (royaltyRecipient, royaltyAmount);
    }

    /**
     * @dev Override the baseURI function to return the token URI.
     */
    function _baseURI() internal view override returns (string memory) {
        return baseTokenURI;
    }

    /**
     * @dev Optionally enables minting again.
     */
    function toggleMinting() public onlyOwner {
        mintEnabled = !mintEnabled;
    }

    /**
     * @dev Override supportsInterface to support royalties (IERC2981).
     */
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721A) returns (bool) {
        return
            interfaceId == type(IERC2981).interfaceId ||
            super.supportsInterface(interfaceId);
    }
}
