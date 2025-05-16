// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract MyToken is ERC20, ERC20Burnable, Ownable {
    constructor() ERC20("MyToken", "MTK") {
       
        uint256 initialSupply = 1_000_000_000 * 10 ** decimals();
        mint(msg.sender, initialSupply);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}

// https://thirdweb.com/contracts/deploy/QmTmzCfnXoQVUDj8VTM5HwJxz1AE2jdYRvYxL2LSPd4GrS
// https://thirdweb.com/contracts/deploy/QmbZ8EAFofPQh98GddT7DUZ52CnoMJX1kHzMnhn9XVXAh1