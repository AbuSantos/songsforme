// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/common/ERC2981.sol";

contract UniqueNFT is ERC721A, ERC2981, Ownable {
    uint256 public constant MAX_SUPPLY = 10;
    bool public mintEnabled;
    string private baseTokenURI;

    constructor(
        string memory name,
        string memory symbol,
        address owner,
        address royaltyRecipient,
        uint96 royaltyPercentage,
        string memory _newBaseURI
    ) ERC721A(name, symbol) {
        mintEnabled = true;
        baseTokenURI = _newBaseURI;
        transferOwnership(owner);

        _setDefaultRoyalty(royaltyRecipient, royaltyPercentage);
    }

    /**
     * @dev Batch mints `batchSize` tokens to the contract owner.
     */
    function mintNFT() public onlyOwner {
        require(mintEnabled, "Minting is disabled");
        require(totalSupply() + 10 <= MAX_SUPPLY, "Exceeds maximum supply");

        _mint(msg.sender, 10);

        // Disable minting if max supply is reached
        if (totalSupply() >= MAX_SUPPLY) {
            mintEnabled = false;
        }
    }

    /**
     * @dev Sets a new base URI for the metadata.
     */
    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseTokenURI = _baseURI;
    }

    /**
     * @dev Returns the same URI for all tokens based on the `baseURI`.
     */
    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        return baseTokenURI;
    }

    /**
     * @dev Returns the base URI set for the collection.
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return baseTokenURI;
    }

    // Override supportsInterface to include ERC2981
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(ERC721A, ERC2981) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    /**
     * @dev Updates royalty info for the entire collection.
     * This function is removed and no longer available.
     * The royalty cannot be changed or removed after deployment.
     */
}
