// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./GenericERC20.sol";
import "./IGenericERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./Crowdsale.sol";
import "./IBEP20.sol";

contract GenericERC20ICOSale is Crowdsale, Ownable {
    using SafeMath for uint256;

    IERC20 public GE20;
    address payable private _wallet;

    constructor(
        uint256 rate,
        address payable wallet,
        IERC20 token
    ) public Crowdsale(rate, wallet, token) {
        _wallet = payable(wallet);
        GE20 = token;
    }

    function bnbRaised() public view returns (uint256) {
        address payable self = payable(address(this));
        uint256 bal = self.balance;
        return bal;
    }

    function endSale() public onlyOwner {
        uint256 bnb = bnbRaised();
        _wallet.transfer(bnb);
        require(
            GE20.transfer(
                _wallet,
                GE20.balanceOf(address(this))
            )
        );
    }
}
