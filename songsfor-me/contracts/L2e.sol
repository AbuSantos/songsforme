// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

interface IERC20 {
    function totalSupply() external view returns (uint);
    function balanceOf(address account) external view returns (uint);
    function transfer(address recipient, uint amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint amount) external returns (bool);
    function burn(uint256 _value) external returns (bool);
}

contract ListenToEarn is Ownable, ReentrancyGuard {
    IERC20 public token;  // ERC20 token used for payments and rewards
    uint256 public immutable i_registrationFee;  // Registration fee for users, immutable after deployment
    uint256 public currentRate;  // Rate used to calculate rewards
    uint256 public registeredUser;  // Total registered users
    uint256 public registeredListeners;  // Total users actively listening
    uint256 public streamingCount = 100;  // Example value used to calculate market value
    uint public currentPrice = 50 ether;  // Example value used to calculate market value
    uint256 public weekDuration = 2 minutes;  // Duration for weekly reward cycle

    uint256 public constant REDUCTION_PER_1000 = 5 * 10 ** 16;  // 0.05 tokens (expressed in 18 decimals)
    uint256 public constant MINIMUM_RATE = 5 * 10 ** 17;  // 0.5 tokens (expressed in 18 decimals)

    // Mappings to track user-related data
    mapping(address => uint256) public listeningTimeThreshold;
    mapping(address => bool) public isFirstPaid;
    mapping(address => bool) public isFirstReduction;
    mapping(address => uint256) public userBalance;
    mapping(address => uint256) public lastListeningTime;
    mapping(address => uint256) public lastRewardTime;
    mapping(address => uint256) public accumulatedListeningTime;
    mapping(address => bool) public isUser;
    mapping(address => uint256) public listeningSessionStartTime;

    // Events
    event UserRegistered(address indexed user, uint256 registrationTime, uint256 feePaid);
    event ListeningSessionStarted(address indexed user, uint256 startTime);
    event ListeningSessionEnded(address indexed user, uint256 endTime, uint256 duration);
    event RewardsClaimed(address indexed user, uint256 rewardAmount, uint256 claimTime);
    event Withdrawal(address indexed user, uint256 amount);
    event RateUpdated(uint256 newRate, uint256 reduction);
    event TokensTransferred(address indexed from, address indexed to, uint256 amount);
    event SessionDurationUpdated(address indexed user, uint256 sessionDuration);

    /**
     * @dev Initializes the contract with the ERC20 token, initial rate, and registration fee.
     * The registration fee is immutable, meaning it cannot be changed after deployment.
     * @param _token Address of the ERC20 token contract used for rewards and payments.
     * @param _initialRate Initial rate used for reward calculation (tokens per minute).
     * @param _registrationFee Registration fee in tokens, charged when user count exceeds 1000.
     */
    constructor(address _token, uint256 _initialRate, uint256 _registrationFee) {
        require(_token != address(0), "Invalid token");
        token = IERC20(_token);
        currentRate = _initialRate;
        i_registrationFee = _registrationFee;
    }

    /**
     * @dev Modifier to ensure the caller is a registered user.
     * Throws if the caller is not already registered.
     */
    modifier onlyUser() {
        require(isUser[msg.sender], "Not a registered member");
        _;
    }

    /**
     * @dev Registers a user in the system. If the total user count exceeds 1000, a registration fee is charged.
     * The registration fee is transferred to the contract, and the user becomes eligible to participate in listening sessions.
     */
    function registerUser() public {
        require(!isUser[msg.sender], "Already registered");

        // Using local variables to reduce storage reads
        uint256 userCount = registeredUser;

        isUser[msg.sender] = true;
        listeningTimeThreshold[msg.sender] = 2 minutes;

        if (userCount >= 1000) {
            // Charge registration fee if userCount >= 1000
            require(token.transferFrom(msg.sender, address(this), i_registrationFee), "Transfer failed");
            emit TokensTransferred(msg.sender, address(this), i_registrationFee);  // Emit token transfer event
        }

        // Increment user count after all checks
        registeredUser = userCount + 1;

        // Update reward rate based on new user count
        _checkAndUpdateRate(registeredUser);

        // Emit UserRegistered event after successful registration
        emit UserRegistered(msg.sender, block.timestamp, (userCount >= 1000) ? i_registrationFee : 0);
    }

    /**
     * @dev Checks and updates the current reward rate based on the number of registered users.
     * The rate is reduced by 0.05 tokens for every 1000 users, but the rate will not fall below the minimum rate of 0.5 tokens.
     * @param userCount The current number of registered users.
     */
    function _checkAndUpdateRate(uint256 userCount) internal {
        if (userCount % 1000 == 0) {
            // Calculate the total reduction based on the number of 1000-user blocks
            uint256 reductionAmount = (userCount / 1000) * REDUCTION_PER_1000;

            // Ensure the rate doesn't drop below the minimum rate
            uint256 newRate = currentRate > reductionAmount ? currentRate - reductionAmount : MINIMUM_RATE;

            currentRate = newRate < MINIMUM_RATE ? MINIMUM_RATE : newRate;

            // Emit an event when the rate is updated
            emit RateUpdated(currentRate, reductionAmount);
        }
    }

    /**
     * @dev Starts a listening session for the caller, a registered user.
     * If the last listening time is more than a week old and the accumulated listening time is below the threshold, it resets the listening time.
     */
    function startListening() public onlyUser {
        uint256 lastListening = lastListeningTime[msg.sender];
        uint256 accumulatedTime = accumulatedListeningTime[msg.sender];
        uint256 threshold = listeningTimeThreshold[msg.sender];
        uint256 currentTime = block.timestamp;

        require(listeningSessionStartTime[msg.sender] == 0, "Session already active");

        if (currentTime >= lastListening + weekDuration && accumulatedTime < threshold) {
            accumulatedListeningTime[msg.sender] = 0;  // Reset accumulated listening time
        }

        // Update the session start time and last listening time
        lastListeningTime[msg.sender] = currentTime;
        listeningSessionStartTime[msg.sender] = currentTime;

        registeredListeners++;
        emit ListeningSessionStarted(msg.sender, currentTime);
    }

    /**
     * @dev Ends the current listening session for the user.
     * The accumulated listening time is updated, and the session is marked as ended.
     */
    function endListening() public onlyUser {
        uint256 sessionStartTime = listeningSessionStartTime[msg.sender];
        require(sessionStartTime > 0, "No active session");

        uint256 currentTime = block.timestamp;
        uint256 sessionDuration = currentTime - sessionStartTime;

        accumulatedListeningTime[msg.sender] += sessionDuration;
        listeningSessionStartTime[msg.sender] = 0;

        emit ListeningSessionEnded(msg.sender, currentTime, sessionDuration);
    }

    /**
     * @dev Rewards a user based on their accumulated listening time.
     * The first time a user is rewarded, their listening time threshold is reduced by half.
     */
    function rewardUser() public nonReentrant onlyUser {
        address _user = msg.sender;

        uint256 accumulatedTime = accumulatedListeningTime[_user];
        uint256 threshold = listeningTimeThreshold[_user];
        uint256 lastReward = lastRewardTime[_user];
        bool firstPaid = isFirstPaid[_user];
        bool firstReduction = isFirstReduction[_user];
        uint256 currentTime = block.timestamp;

        require(accumulatedTime >= threshold, "Accumulated time less than threshold");

        uint256 rewardAmount = currentRate * accumulatedTime;
        require(rewardAmount > 0, "No rewards");

        accumulatedListeningTime[_user] = 0;
        lastRewardTime[_user] = currentTime;

        if (!firstPaid) {
            isFirstPaid[_user] = true;
            listeningTimeThreshold[_user] = threshold / 2;
            isFirstReduction[_user] = true;
        } else {
            require(firstReduction, "Threshold already reduced");
            require(currentTime >= lastReward + weekDuration, "Withdraw once a week");
        }

        _forwardRewards(_user, rewardAmount);
        emit RewardsClaimed(_user, rewardAmount, currentTime);
    }

    /**
     * @dev Allows users to withdraw their rewards balance.
     * The function is protected by the nonReentrant modifier to avoid reentrancy attacks.
     */
    function withdraw() public nonReentrant onlyUser {
        uint256 balance = userBalance[msg.sender];
        require(balance > 0, "User balance must be > 0");

        userBalance[msg.sender] = 0;
        require(token.transfer(msg.sender, balance), "Token transfer failed");

        emit Withdrawal(msg.sender, balance);
        emit TokensTransferred(address(this), msg.sender, balance);
    }

    /**
     * @dev Internal function to forward rewards to the user by updating their balance.
     * @param _beneficiary The address of the user receiving the reward.
     * @param _tokenAmount The amount of tokens to be added to the user's balance.
     */
    function _forwardRewards(address _beneficiary, uint256 _tokenAmount) internal {
        require(_beneficiary != address(0), "Beneficiary cannot be zero address");
        require(_tokenAmount > 0, "Reward amount must be > 0");

        userBalance[_beneficiary] += _tokenAmount;
        emit TokensTransferred(address(this), _beneficiary, _tokenAmount);
    }

    /**
     * @dev Internal function that calculates the tokens earned from streaming.
     * @return The number of tokens earned based on the streaming count and current rate.
     */
    function _streamingEarned() internal view returns (uint) {
        return streamingCount * currentRate;
    }

    /**
     * @dev Calculates the reduction in token rewards based on the number of registered listeners.
     * @return The total reduction in token rewards based on the registered listeners.
     */
    function _usersCountEarned() internal view returns (uint) {
        uint reduction = (currentRate * 15) / 100000;
        return reduction * registeredListeners;
    }

    /**
     * @dev Calculates the total market value based on streaming, user counts, and the current price.
     * @return The total market value of the token based on current metrics.
     */
    function _marketValue() public view returns (uint) {
        return (_streamingEarned() + _usersCountEarned() + currentPrice);
    }
}
