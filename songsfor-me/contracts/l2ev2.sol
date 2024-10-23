// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
}

contract ListenToEarn is ReentrancyGuard,Ownable{
    using ECDSA for bytes32;

    IERC20 public token;  // ERC20 token used for payments and rewards
    address public trustedSigner;  

    uint256 public immutable i_registrationFee;
    uint256 public currentRate;
    uint256 public registeredUser;  
    uint256 public constant CLAIM_COOLDOWN = 1 weeks;

    mapping(address => uint256) public userBalance;
    mapping(address => bool) public isUser;
    mapping(address => bool) public isFirstPaid;
    mapping(address => bool) public isFirstReduction;
    mapping(address => uint256) public listeningTimeThreshold;
    mapping(address => uint256) public lastPaidTime;

    event UserRegistered(address indexed user, uint256 registrationTime, uint256 feePaid);
    event RewardsClaimed(address indexed user, uint256 rewardAmount, uint256 claimTime);
    event Withdrawal(address indexed user, uint256 amount);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    event RewardsDistributed(address indexed listener, address indexed nftOwner, uint256 listenerReward, uint256 nftOwnerReward);

    error NotRegistered();
    error AlreadyRegistered();
    error InvalidListenerAddress();
    error ListenerRewardMustBeGreaterThanZero();
    error InvalidSignature();
    
    constructor(address _token, uint256 _initialRate, uint256 _registrationFee, address _trustedSigner) {
        require(_token != address(0), "Invalid token address");
        require(_trustedSigner != address(0), "Invalid signer address");

        token = IERC20(_token);
        currentRate = _initialRate;
        i_registrationFee = _registrationFee;
        trustedSigner = _trustedSigner;
    }

    modifier onlyUser() {
        if (!isUser[msg.sender]) revert NotRegistered();
        _;
    }

    function registerUser() public {
        if (isUser[msg.sender]) revert AlreadyRegistered();

        uint256 userCount = registeredUser;
        isUser[msg.sender] = true;
        listeningTimeThreshold[msg.sender] = 2 minutes;

        if (userCount >= 1000) {
            require(token.transferFrom(msg.sender, address(this), i_registrationFee), "Transfer failed");
            emit TokensTransferred(msg.sender, address(this), i_registrationFee);
        }

        registeredUser++;
        emit UserRegistered(msg.sender, block.timestamp, (userCount >= 1000) ? i_registrationFee : 0);
    }

    function distributeRewards(
        address listener,
        uint256 listenerReward,
        bytes memory signature  
    ) public nonReentrant {
        uint256 currentTime = block.timestamp;

        if (listener == address(0)) revert InvalidListenerAddress();
        if (listenerReward <= 0) revert ListenerRewardMustBeGreaterThanZero();

        bytes32 messageHash = keccak256(abi.encodePacked(listener, listenerReward));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        if (signer != trustedSigner) revert InvalidSignature();

        if (!isFirstPaid[listener]) {
            isFirstPaid[listener] = true;
            isFirstReduction[listener] = true;
        } else {
            require(isFirstReduction[listener], "Threshold not yet reduced");
            require(currentTime >= lastPaidTime[listener] + CLAIM_COOLDOWN, "Claim cooldown active");
        }

        lastPaidTime[listener] = currentTime;
        require(token.transfer(listener, listenerReward), "Listener reward transfer failed");

        emit RewardsDistributed(listener, address(0), listenerReward, 0);  // Consider passing NFT owner if relevant
    }

    function withdraw() public nonReentrant onlyUser {
        uint256 balance = userBalance[msg.sender];
        require(balance > 0, "User balance must be greater than 0");

        userBalance[msg.sender] = 0;
        require(token.transfer(msg.sender, balance), "Token transfer failed");

        emit Withdrawal(msg.sender, balance);
        emit TokensTransferred(address(this), msg.sender, balance);
    }

    function _forwardRewards(address _beneficiary, uint256 _tokenAmount) internal {
        require(_beneficiary != address(0), "Beneficiary cannot be zero address");
        require(_tokenAmount > 0, "Reward amount must be greater than 0");

        userBalance[_beneficiary] += _tokenAmount;
        emit TokensTransferred(address(this), _beneficiary, _tokenAmount);
    }
}
