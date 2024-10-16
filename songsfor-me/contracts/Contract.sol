// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./Royalty.sol";

import "hardhat/console.sol";

contract BullchordMarketPlace is ReentrancyGuard {
    IERC721 public nftContract;
    uint256 private platformFee;

    event NFTListed(address _nft, uint tokenId, uint price, address owner);
    event ProceedWithdrawn(address owner, uint256 amount);
    event FundsWithdrawn(address owner, uint256 amount);
    event RoyaltySent(address owner, uint amount);
    event NFTBought(address buyer, address seller, uint amount, uint tokenId);
    event BidAccepted(
        address seller,
        address bidder,
        uint amount,
        uint tokenId
    );
    event UserAdded(address artiste);
    event FeeUpdated(uint fee);
    event ListingCanceled(uint tokenId);
    event BidMade(address bidder, uint amount);
    event UserRemovedFromWhitelist(address user);
    event BidOfferRejected(
        uint tokenId,
        address nftAddress,
        address seller,
        address bidder,
        uint bidAmount
    );

    Counters.Counter private _itemsSold;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    uint256 public platformFeeBasisPoints = 250;
    uint256 public listingFee = 0.025 ether;
    uint256 private whitelistedListingFee = 0.0005 ether;
    uint256 private listingProceeds;
    // Array with all marketItem

    MarketItem[] public marketItems;
    address[] public whiteList;

    uint256[] public listMusicNft;
    // uint256 listingPrice = 0.005 ether;
    address payable owner;

    mapping(address => uint[]) public marketItemsOwner;
    mapping(address => uint256) public proceeds;
    mapping(address => mapping(uint256 => Listing)) public s_listings;
    mapping(uint => bool) public isSold;
    mapping(uint => bool) public isItemStaked;
    mapping(uint256 => Bid[]) public userBids;
    // Mapping from auction index to user bids
    mapping(uint256 => Bid[]) public auctionBids;
    mapping(address => bool) public whiteListMapping;
    mapping(address => uint256) public withdrawableBalance;

    // platform fee:25000000000000000
    // Mapping from market index to a list of marketItem
    // Mapping from market index to a list of owned marketItem

    struct MarketItem {
        uint256 tokenId;
        address seller;
        address _nftContract;
        uint256 price;
        bool sold;
    }
    mapping(uint256 => MarketItem) public idToMarketItem;

    struct Listing {
        uint256 price;
        address seller;
        /* address creator;*/
    }
    struct Bid {
        address payable from;
        uint256 amount;
    }

    struct stakedListing {
        uint256 price;
        address seller;
    }

    constructor(uint256 _platformFee) {
        owner = payable(msg.sender);
        platformFee = _platformFee;
    }

    modifier notListed(address _nftAddress, uint256 _tokenId) {
        Listing memory listing = s_listings[_nftAddress][_tokenId];
        if (listing.price > 0) {
            revert("already listed");
        }
        _;
    }

    modifier isOwner(
        address _nftContract,
        uint256 _tokenId,
        address spender
    ) {
        nftContract = IERC721(_nftContract); //using the IERC721 interface  to access the nft
        address ownerr = nftContract.ownerOf(_tokenId);
        if (spender != ownerr) {
            revert("You're not the owner");
        }
        _;
    }

    /**
     * @notice calculates the marketplace's cut in any sale as per price
     * @param salePrice price at which an NFT is to be sold
     */
    function calculatePlatformFee(
        uint256 salePrice
    ) public view returns (uint256) {
        return (salePrice * platformFeeBasisPoints) / 10000;
    }

    /**
     * @dev checks if the user already whiteListed.
     *
     * This function allows the owner of the contract to chewck if an address has been whitelisted .
     *
     * Requirements:
     * - The caller must be the owner of the contract.
     * - The provided `_user` address must not already be registered on the whitelist.
     *
     * Emits a `AddressAddedToWhitelist` event when an address is successfully added to the whitelist.
     *
     * @param _user The address to be added to the whitelist.
     */
    function _inWhiteList(address _user) private view returns (bool) {
        return whiteListMapping[_user];
    }

    /**
     * @dev Add an address to the whitelist.
     *
     * This function allows the owner of the contract to add an address to the whitelist.
     * Addresses on the whitelist are granted special privileges, such as lower listing fees
     * when listing NFTs on the marketplace.
     *
     * Requirements:
     * - The caller must be the owner of the contract.
     * - The provided `_user` address must not already be registered on the whitelist.
     *
     * Emits a `AddressAddedToWhitelist` event when an address is successfully added to the whitelist.
     *
     * @param _user The address to be added to the whitelist.
     */
    function addToWhiteList(address _user) public {
        require(msg.sender == owner, "Not allowed!");
        require(whiteListMapping[_user] == false, "User already registered");

        whiteListMapping[_user] = true;
        emit UserAdded(_user);
    }

    /**
     * @dev Remove an address from the whitelist.
     *
     * This function allows the owner of the contract to remove an address from the whitelist.
     * Once removed, the user will no longer have any whitelist privileges.
     *
     * Requirements:
     * - The caller must be the owner of the contract.
     * - The provided `_user` address must already be registered on the whitelist.
     *
     * Emits a `UserRemovedFromWhitelist` event when an address is successfully removed from the whitelist.
     *
     * @param _user The address to be removed from the whitelist.
     */
    function removeFromWhiteList(address _user) public {
        require(msg.sender == owner, "Not allowed!");
        require(whiteListMapping[_user] == true, "User is not whitelisted");

        // Remove the user from the whitelist
        whiteListMapping[_user] = false;

        emit UserRemovedFromWhitelist(_user);
    }

    function updateListingFee(uint256 _listingFee) external payable {
        require(owner == msg.sender, "only owner can change fee");
        listingFee = _listingFee;
        emit FeeUpdated(_listingFee);
    }

    /**
     * @dev List a Bull NFT on the marketplace.
     *
     * This function allows the owner of a Bull NFT to list it for sale on the marketplace.
     *
     * Requirements:
     * - The provided `_price` must be greater than 0.
     * - The caller must be the owner of the NFT specified by `_nftAddress` and `_tokenId`.
     * - The specified NFT must be approved for transfer to this marketplace contract.
     *
     * If the caller is whitelisted, they will be charged a lower listing fee; otherwise, the
     * standard listing fee will apply.
     *
     * The listing fee is collected in `listingProceeds`.
     *
     * Emits a `BullListed` event when the NFT is successfully listed.
     *
     * @param _nftAddress The address of the Bull NFT contract.
     * @param _tokenId The token ID of the Bull NFT to be listed.
     * @param _price The price at which the NFT is listed for sale.
     */
    function listBull(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _price
    ) external payable isOwner(_nftAddress, _tokenId, msg.sender) {
        require(_price > 0, "The price of the Item must be > 0");

        // Determine listing fee based on whitelist status
        uint256 actualListingFee = _inWhiteList(msg.sender)
            ? whitelistedListingFee
            : listingFee;
        require(msg.value >= actualListingFee, "Insufficient listing fee");

        // Check if NFT is approved for the marketplace
        nftContract = IERC721(_nftAddress);
        require(
            nftContract.getApproved(_tokenId) == address(this),
            "Not Approved For Marketplace"
        );

        // Add the MarketItem to the mapping (avoid duplicate array storage)
        idToMarketItem[_tokenId] = MarketItem({
            tokenId: _tokenId,
            seller: msg.sender,
            _nftContract: _nftAddress,
            price: _price,
            sold: false
        });

        // Track ownership using the mapping
        marketItemsOwner[msg.sender].push(_tokenId);

        // Emit the NFTListed event
        emit NFTListed(_nftAddress, _tokenId, _price, msg.sender);
    }

    /**
     * @dev Buy a Bull NFT from the marketplace.
     *
     * This function allows users to purchase a Bull NFT listed for sale on the marketplace.
     *
     * Requirements:
     * - The caller must not be the owner of the NFT specified by `_nftAddress` and `_tokenId`.
     * - The provided Ether value must be greater than or equal to the listed price of the NFT.
     *
     * The purchase proceeds are transferred to the seller's address, and the NFT ownership is
     * transferred to the buyer.
     *
     * Emits a `BullPurchased` event when the purchase is successful.
     *
     * @param _tokenId The token ID of the Bull NFT to be purchased.
     * @param _nftContract The address of the Bull NFT contract.
     */

    function buyBull(
        address _nftContract,
        uint256 _tokenId
    ) public payable nonReentrant {
        // Fetch the seller and ensure the buyer isn't the seller
        nftContract = IERC721(_nftContract);
        address seller = nftContract.ownerOf(_tokenId);
        require(seller != msg.sender, "You cannot buy your own NFT");

        // Fetch the market item
        MarketItem storage marketItem = idToMarketItem[_tokenId];
        require(!marketItem.sold, "Item already sold");

        uint256 payPrice = msg.value;
        require(payPrice >= marketItem.price, "Price not met");

        // Fetch royalty information and deduct royalty
        IRentableNFT nft = IRentableNFT(_nftContract);
        (address royaltyRecipient, uint256 royalty) = nft.royaltyInfo(
            _tokenId,
            payPrice
        );
        require(royalty <= payPrice, "Royalty exceeds payment");

        uint256 finalPrice = payPrice;
        if (royalty > 0) {
            finalPrice -= royalty; // Deduct royalty from final price
        }

        // Update state before making external calls
        marketItem.sold = true;
        isSold[_tokenId] = true;

        // Deduct platform fee from finalPrice after royalty deduction
        uint256 _platformFee = calculatePlatformFee(finalPrice);
        finalPrice -= _platformFee;
        listingProceeds += _platformFee;

        // Transfer funds to the seller and royalty recipient
        proceeds[seller] += finalPrice;

        // External transfers after state is updated
        if (royalty > 0) {
            (bool successRoyalty, ) = payable(royaltyRecipient).call{
                value: royalty
            }("");
            require(successRoyalty, "Royalty transfer failed");
            emit RoyaltySent(royaltyRecipient, royalty);
        }

        // Transfer NFT to the buyer
        nftContract.transferFrom(seller, msg.sender, _tokenId);

        // Emit the event
        emit NFTBought(msg.sender, seller, msg.value, _tokenId);
    }

    /**
     * @dev Place a bid on a Bull NFT listed in the marketplace.
     *
     * This function allows users to place bids on Bull NFTs that are listed for sale
     * in the marketplace. The bid amount must be greater than 0 and higher than any
     * previous bid on the same NFT.
     *
     * Requirements:
     * - The bid amount (`msg.value`) must be greater than 0.
     * - The caller cannot bid on their own NFT.
     * - The bid amount must be higher than the previous highest bid, if any.
     * - If a previous bid exists, the amount of the previous highest bid will be refunded
     *   to the previous bidder.
     *
     * Upon a successful bid, the new bid is recorded, and the previous highest bidder's
     * funds are refunded. Users can check their bids using the `userBids` mapping.
     *
     * @param _tokenId The token ID of the Bull NFT to place a bid on.
     * @param _nftAddress The address of the Bull NFT contract.
     */

    function bid(
        uint256 _tokenId,
        address _nftAddress
    ) external payable nonReentrant {
        console.log("Starting bid process...");

        uint256 bidAmount = msg.value;
        console.log("Bid Amount (msg.value):", bidAmount);

        require(bidAmount > 0, "Bid should be > 0");

        nftContract = IERC721(_nftAddress); // Access the NFT contract
        address seller = nftContract.ownerOf(_tokenId);
        require(seller != msg.sender, "You cannot bid on your own NFT");

        uint256 bidLength = userBids[_tokenId].length;
        uint256 previousBidAmount;

        // Check the last bid (if any)
        if (bidLength > 0) {
            Bid memory lastBid = userBids[_tokenId][bidLength - 1];
            previousBidAmount = lastBid.amount;
            console.log("Previous Bid Amount:", previousBidAmount);

            // Ensure new bid is higher than the last bid
            require(bidAmount > previousBidAmount, "bid amount too low");

            // Instead of refunding immediately, store the amount in withdrawableBalance
            withdrawableBalance[lastBid.from] += lastBid.amount;
            console.log(
                "Previous bidder's refund stored in withdrawable balance"
            );
        }

        // Record the new bid
        Bid memory newBid = Bid({from: payable(msg.sender), amount: bidAmount});
        userBids[_tokenId].push(newBid);
        console.log("New bid recorded:", bidAmount);

        emit BidMade(msg.sender, bidAmount);
    }

    // 2500000000000000

    /**
     * @dev Withdraw proceeds from the marketplace.
     *
     * This function allows sellers to withdraw their earnings (proceeds) from the marketplace.
     * Sellers can only withdraw proceeds if they have earnings higher than 0.
     *
     * Upon successful withdrawal, the proceeds are transferred to the seller's address.
     *
     * Emits a `ProceedsWithdrawn` event when the withdrawal is successful.
     */

    function withdrawProceeds() external {
        require(owner == msg.sender, "Only owner");
        uint256 earning = listingProceeds;

        require(earning > 0, "earnings must be higher than 0");
        listingProceeds = 0;
        (bool success, ) = payable(msg.sender).call{value: earning}(" ");
        require(success, "transaction failed");
        emit ProceedWithdrawn(owner, earning);
    }

    /**
     * @dev Withdraw proceeds from the marketplace.
     *
     * This function allows marketplace owner to withdraw their earnings (proceeds) from the marketplace.
     * Owners can only withdraw proceeds if they have earnings higher than 0.
     *
     * Upon successful withdrawal, the proceeds are transferred to the owner's address.
     *
     * Emits a `ProceedsWithdrawn` event when the withdrawal is successful.
     */
    function withdrawFunds() external nonReentrant {
        uint256 earning = proceeds[msg.sender];

        require(earning > 0, "earnings must be higher than 0");
        proceeds[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: earning}(" ");
        require(success, "transaction failed");
        emit FundsWithdrawn(owner, earning);
    }

    function withdrawBidFunds() external nonReentrant {
        uint256 amount = withdrawableBalance[msg.sender];
        require(amount > 0, "No funds to withdraw");

        withdrawableBalance[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdraw failed");

        console.log("Funds withdrawn:", amount);
    }

    /**
     * @dev Accept the highest bid and transfer ownership of a Bull NFT.
     *
     * This function allows the seller of a Bull NFT listed in the marketplace to accept the highest bid
     * and transfer ownership of the NFT to the highest bidder.
     *
     * Requirements:
     * - The caller must be the seller of the NFT.
     * - There must be at least one valid bid for the NFT.
     * - The highest bid amount will be transferred to the seller.
     * - Ownership of the NFT will be transferred to the highest bidder.
     *
     * Emits a `OfferAccepted` event when the offer is successfully accepted.
     *
     * @param _tokenId The token ID of the Bull NFT to accept an offer for.
     * @param _nftContract The address of the Bull NFT contract.
     */

    function acceptOffer(
        uint _tokenId,
        address _nftContract
    ) external nonReentrant {
        MarketItem storage marketItem = idToMarketItem[_tokenId];
        nftContract = IERC721(_nftContract);

        require(msg.sender == marketItem.seller, "You're not the owner");

        uint bidsLength = userBids[_tokenId].length;
        require(bidsLength > 0, "No bids to accept");

        // Get the last bid and remove it
        Bid memory lastBid = userBids[_tokenId][bidsLength - 1];
        userBids[_tokenId].pop(); // Removes the last bid


        // Handle royalties
        IRentableNFT nft = IRentableNFT(marketItem._nftContract);
        (address royaltyRecipient, uint256 royalty) = nft.royaltyInfo(
            _tokenId,
            lastBid.amount
        );

        uint256 amountToSeller = lastBid.amount;

        if (royalty > 0) {
            console.log("Royalty recipient: ", royaltyRecipient);
            console.log("Royalty amount: ", royalty);

            amountToSeller -= royalty;

            // Transfer royalty to the recipient
            (bool successRoyalty, ) = payable(royaltyRecipient).call{
                value: royalty
            }("");
            require(successRoyalty, "Royalty transfer failed");
            emit RoyaltySent(royaltyRecipient, royalty);
        }

        // Handle platform fee if applicable
        if (isItemStaked[_tokenId]) {
            uint256 totalPlatformFee = (amountToSeller * 15) / 100;
            amountToSeller -= totalPlatformFee;
            listingProceeds += totalPlatformFee;

            console.log("Platform fee deducted: ", totalPlatformFee);
        }

        // Transfer funds to the seller
        (bool success, ) = payable(marketItem.seller).call{
            value: amountToSeller
        }("");
        require(success, "Transaction failed");

        // Transfer the NFT to the highest bidder
        console.log("Transferring NFT to the highest bidder...");
        nftContract.transferFrom(marketItem.seller, lastBid.from, _tokenId);

        emit BidAccepted(
            marketItem.seller,
            lastBid.from,
            lastBid.amount,
            _tokenId
        );
    }

    /**
     * @dev Cancel a Bull NFT listing on the marketplace.
     *
     * This function allows the seller to cancel their listing for a Bull NFT on the marketplace.
     * The seller must be the owner of the listing.
     *
     * When a listing is canceled, the NFT remains in the ownership of the seller, and the listing
     * information is removed from the marketplace.
     *
     * Emits a `ListingCanceled` event when the listing is successfully canceled.
     *
     * @param _tokenId The token ID of the Bull NFT listing to be canceled.
     */

    function cancelListing(
        uint256 _tokenId,
        address _nftAddress
    ) external isOwner(_nftAddress, _tokenId, msg.sender) {
        // MarketItem memory marketItem = idToMarketItem[_tokenId];
        // require(msg.sender == marketItem.seller, "This is not your product");
        isSold[_tokenId] = true;
        delete (idToMarketItem[_tokenId]);
        emit ListingCanceled(_tokenId);
    }

    /**
     * @dev Reject a bid offer for a Bull NFT listed in the marketplace.
     *
     * This function allows the seller to reject a bid offer made by a potential buyer for their
     * listed Bull NFT. The offer is rejected by providing the token ID of the NFT and the
     * address of the Bull NFT contract. The bid amount is refunded to the bidder.
     *
     * Requirements:
     * - Only the seller of the NFT can reject bid offers for their own NFTs.
     * - The NFT must be listed in the marketplace.
     *
     * Emits a `BidOfferRejected` event when the bid offer is successfully rejected and refunded.
     *
     * @param _tokenId The token ID of the Bull NFT for which the bid offer is rejected.
     * @param _nftAddress The address of the Bull NFT contract.
     */
    function rejectBidOffer(
        uint256 _tokenId,
        address _nftAddress
    ) external nonReentrant {
        nftContract = IERC721(_nftAddress);
        address seller = nftContract.ownerOf(_tokenId);
        require(msg.sender == seller, "Only the seller can reject bid offers");

        // Ensure the NFT is listed in the marketplace
        MarketItem storage marketItem = idToMarketItem[_tokenId];
        require(
            marketItem.seller == seller,
            "NFT is not listed in the marketplace"
        );

        // Get the last bid offer for the NFT
        Bid[] storage bids = userBids[_tokenId];
        require(bids.length > 0, "No bids for this NFT");

        // Refund the last bidder
        Bid memory lastBid = bids[bids.length - 1];
        address bidder = lastBid.from;
        uint256 bidAmount = lastBid.amount;

        // Transfer funds using pull payment mechanism to handle failures gracefully
        withdrawableBalance[bidder] += bidAmount;

        // Remove the bid from the array
        bids.pop();

        // Emit the event for tracking
        emit BidOfferRejected(_tokenId, _nftAddress, seller, bidder, bidAmount);
    }

    function getAllMarketItems() external view returns (MarketItem[] memory) {
        uint totalItems = marketItems.length;
        uint unsoldItemCount = 0;

        // get all the item not sold,
        for (uint i = 0; i < totalItems; i++) {
            if (!isSold[marketItems[i].tokenId]) {
                unsoldItemCount++;
            }
        }
        // we instantiate and instance of marketItem array and we use the unsoldItem to get all items not sold.
        MarketItem[] memory allMarketItems = new MarketItem[](unsoldItemCount);
        uint currentIndex = 0;
        for (uint i = 0; i < totalItems; i++) {
            //first we check for all the items unsold
            if (!isSold[marketItems[i].tokenId]) {
                allMarketItems[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }

        return allMarketItems;
    }

    function getMarketItemsByUser(
        address user
    ) external view returns (MarketItem[] memory) {
        uint[] memory userListingIds = marketItemsOwner[user];
        MarketItem[] memory userMarketItems = new MarketItem[](
            userListingIds.length
        );

        for (uint i = 0; i < userListingIds.length; i++) {
            uint tokenId = userListingIds[i];
            MarketItem storage item = idToMarketItem[tokenId];
            userMarketItems[i] = MarketItem({
                tokenId: item.tokenId,
                seller: item.seller,
                _nftContract: item._nftContract,
                price: item.price,
                sold: item.sold
            });
        }

        return userMarketItems;
    }

    /**
     * @dev Disallow payments to this contract directly
     */
    fallback() external payable {
        revert();
    }

    receive() external payable {
        revert();
    }
}
