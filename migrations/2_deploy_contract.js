const GenericERC20=artifacts.require ("./GenericERC20.sol");
const GenericERC20Stake=artifacts.require ("./GenericERC20Stake.sol");
const GenericERC20ICOSale=artifacts.require ("./GenericERC20ICOSale.sol");

module.exports = function(deployer) {
    // Has already been deployed, just need sales contract    
    deployer.deploy(GenericERC20, 50000000).then((instance) => {
        tokenInstance = instance;
        return deployer.deploy(GenericERC20Stake, GenericERC20.address).then(() => {
            tokenInstance.addToWhitelist(GenericERC20Stake.address);
            tokenInstance.unlock(); // remove after publishing to the blockchain
        }).then(() => {
            const rate = 1600;
            const wallet = '0x76F4084cea5586298e505d22F702fd28CD2b2801';
            return deployer.deploy(GenericERC20ICOSale, rate, wallet, tokenInstance.address).then(() => {
                tokenInstance.addToWhitelist(GenericERC20ICOSale.address);
            });
        });
    });
    /**
    *******  Use the following for mainnet deployment of ICO *******
    const tokenAddress = '0x0f214bbF8F351C7fCbeF60f5BA225c6c83A8A10C'; // Mainnet address
    deployer.deploy(GenericERC20ICOSale.address, tokenAddress, 23809523809523);
    */
}