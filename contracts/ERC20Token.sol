// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Token is ERC20 {
    uint8 private _customDecimals;

    constructor(string memory name, string memory symbol, uint8 decimals, uint256 initialSupply) ERC20(name, symbol) {
        _customDecimals = decimals;
        _mint(msg.sender, initialSupply);
    }

    // Override the decimals function to return the custom decimals
    function decimals() public view virtual override returns (uint8) {
        return _customDecimals;
    }
}
