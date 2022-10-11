export async function bscChain() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x61' }],
        });
    }

    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x61',
                            chainName: 'Binanace Smart Chain Testnet',
                            nativeCurrency: {
                                name: "TBNB",
                                symbol: "BNB-T",
                                decimals: 18,

                            },
                            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545'],
                            blockExplorerUrls: ['https://testnet.bscscan.com/']
                        }]
                })
            } catch (error) {
                console.log("Error while connecting to Binance Smart Chain Testnet ::::: ", error, ' <<<<<===========');
            }
        }
    }
}

export async function polyChain() {

    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }],
        });
    }

    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x13881',
                            chainName: 'Matic Testnet',
                            nativeCurrency: {
                                name: "MATIC",
                                symbol: "MATIC-T",
                                decimals: 18,

                            },
                            rpcUrls: ['https://rpc-mumbai.maticvigil.com'],
                            blockExplorerUrls: ['https://mumbai.polygonscan.com/']
                        }]
                })
            } catch (error) {
                console.log("Error while connecting to Polygon Testnet ::::: ", error, ' <<<<<===========');
            }
        }
    }
}


export async function goerliChain() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x5' }],
        });
    }

    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x5',
                            chainName: 'Goerli Testnet',
                            nativeCurrency: {
                                name: "gETH",
                                symbol: "ETH-G",
                                decimals: 18,

                            },

                            rpcUrls: ['https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'],

                            blockExplorerUrls: ['https://goerli.etherscan.io/']
                        }]
                })
            } catch (error) {
                console.log("Error while connecting to Goerli Testnet ::::: ", error, ' <<<<<===========');
            }
        }
    }
}

export async function hardhatChain() {
    try {
        await ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x539' }],
        });
    }

    catch (error) {
        if (error.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                        {
                            chainId: '0x539',
                            chainName: 'Hardhat Network',
                            nativeCurrency: {
                                name: "HETH",
                                symbol: "ETH-H",
                                decimals: 18,

                            },

                            rpcUrls: ['https://localhost:8545'],

                            // blockExplorerUrls: ['']
                        }]
                })
            } catch (error) {
                console.log("Error while connecting to Hardhat Network ::::: ", error, ' <<<<<===========');
            }
        }
    }
}


