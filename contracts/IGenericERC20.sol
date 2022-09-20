// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IBEP20.sol";

interface IGenericERC20 is IBEP20 {  
    function transfer(address to, uint256 amount) external override returns (bool);
    function transferFrom(address from, address to, uint256 amount) external override returns (bool);
    function balanceOf(address account) external view override returns (uint256);
}