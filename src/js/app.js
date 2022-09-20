App = {
    /**
     * When deploying to a local test network, make sure 
     * MetaMask is also connected to that network
    */
    web3Provider: null,
    contracts: {},
    account: '0x0',
    loading: false,
    totalOnSale: 0,
    stakedAmount: 0,
    totalSupply: 0,
    accountBalance: 0,

    init: async () => {
        return await App.initWeb3();
    },

    initWeb3: async () => {
        // Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider);
        web3.eth.defaultAccount = web3.eth.accounts[0];


        return await App.initContracts();
    },

    initContracts: async () => {
        $.getJSON("GenericERC20ICOSale.json", genericERC20ICOSale => {
            App.contracts.GenericERC20ICOSale = TruffleContract(genericERC20ICOSale);
            App.contracts.GenericERC20ICOSale.setProvider(App.web3Provider);
            App.contracts.GenericERC20ICOSale.deployed()
        }).done(() => {
            $.getJSON("GenericERC20.json", GenericERC20 => {
            App.contracts.GenericERC20 = TruffleContract(GenericERC20);
                App.contracts.GenericERC20.setProvider(App.web3Provider);
                App.contracts.GenericERC20.deployed()
                return App.render();
            });
        })

    },

    render: async () => {
        if (App.loading) {
            return;
        }
        App.loading = true;

        let loader = $('#loader');
        let content = $('#content');

        loader.show();
        content.hide();

        // Get account data
        web3.eth.getCoinbase((err, account) => {
            if (err == null) {
                console.log("User Account", account);
                App.account = account;
                $('#accountAddress').html("Your account: " + account);
            }
        })
        tokenInstance = await App.contracts.GenericERC20.deployed()
        salesInstance = await App.contracts.GenericERC20ICOSale.deployed()
        total = await tokenInstance.totalSupply();
        total = (total.toNumber() / (10**18));
        App.totalSupply = total;
        $('.total-supply').html(App.totalSupply);
        accountBalance = await tokenInstance.balanceOf(App.account);
        accountBalance = (accountBalance.toNumber() / 10**18);
        App.accountBalance = accountBalance;
        $('.account-value').html(App.accountBalance);
        totalOnSale = await tokenInstance.balanceOf(salesInstance.address)
        totalOnSale = (totalOnSale.toNumber() / 10**18);
        App.totalOnSale = totalOnSale
        $('.total-staked').html(App.totalOnSale)
        App.loading = false;
        loader.hide();
        content.show();
    },

    buyTokens: async () => {
        $('#content').hide();
        $('#loader').show();
        let numOfTokens = $('#numberOfTokens').val();
        // let waxAddress = $('#waxAddress').val() || '';
        salesInstance = await App.contracts.GenericERC20ICOSale.deployed();
        tokenInstance = await App.contracts.GenericERC20.deployed();
        try{
            //  await tokenInstance.approve(salesInstance.address, numOfTokens*(10**18), { gas: 500000, from: App.account });
            await salesInstance.buyTokens(numOfTokens*(10**18), { gas: 500000, from: App.account });
        }
        catch {}
        $('form').trigger('reset');
        $('#content').show();
        $('#loader').hide();
        return App.render();
    },

    endSale: async () => {
        $('#content').hide();
        $('#loader').show();
        salesInstance = await App.contracts.GenericERC20ICOSale.deployed()
        await salesInstance.endSale();
        $('form').trigger('reset');
        $('#content').show();
        $('#loader').hide();
        return App.render();
    }
}

$(() => {
    $(window).load(() => {
        App.init();
    })
})