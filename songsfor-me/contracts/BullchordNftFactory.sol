// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BullchordNft.sol"; 

contract CreateNFTFactory is ReentrancyGuard, Pausable, Ownable{
    mapping(address => address[]) public userNFTContracts; // Maps a user to their deployed NFT contracts
    uint256 public deploymentFee = 0.001 ether;

    event NFTContractCreated(address indexed owner, address nftContract, uint256 feePaid);

    modifier requiresFee() {
        require(msg.value >= deploymentFee, "Insufficient minting fee");
        _;
    }

    function createNFTContract(
        string memory name,
        string memory symbol,
        address royaltyRecipient,
        uint96 royaltyPercentage,
        string memory baseURI
    ) public payable requiresFee whenNotPaused nonReentrant {
        UniqueNFT newNFTContract = new UniqueNFT(
            name,
            symbol,
            msg.sender,
            royaltyRecipient,
            royaltyPercentage,
            baseURI
        );

        userNFTContracts[msg.sender].push(address(newNFTContract));
        emit NFTContractCreated(msg.sender, address(newNFTContract), msg.value);
    }

    function getUserNFTContracts(address user) public view returns (address[] memory) {
        return userNFTContracts[user];
    }

    function setDeploymentFee(uint256 _feeInEther) external onlyOwner {
        deploymentFee = _feeInEther * 1 ether;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdraw failed");
    }

  
}
