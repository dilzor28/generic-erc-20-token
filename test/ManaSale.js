const { assert } = require("chai");
const GenericERC20 = artifacts.require("./GenericERC20.sol");
const GenericERC20ICOSale = artifacts.require("./GenericERC20ICOSale.sol");

contract('GenericERC20ICOSale', accounts => {
    let tokenInstance;
    let salesInstance;
    const salesAmount = "12500000000000000000000000";
    const admin = accounts[0];
    const marketing = accounts[1];

    it('Transfer token into contract and make sure it exists', () => {
        return GenericERC20.deployed().then(instance => {
            tokenInstance = instance;
            return GenericERC20ICOSale.deployed().then(instance => {
                salesInstance = instance;
                tokenInstance.unlock();
                tokenInstance.addToWhiteList(salesInstance.address);
                return tokenInstance.totalSupply();
            }).then(supply => {
                assert.equal(supply.toString(), "50000000000000000000000000", 'correct supply');
                return tokenInstance.transfer(salesInstance.address, salesAmount, { from: admin });
            }).then(receipt => {
                assert.equal(receipt.logs.length, 1, 'only 1 event');
            })
        })
    })
})