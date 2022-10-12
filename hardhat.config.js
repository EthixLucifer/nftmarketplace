require("@nomicfoundation/hardhat-toolbox");
/** @type import('hardhat/config').HardhatUserConfig */
// const simpleCrypto = require("./components/configuration");


const walletPrivateKey = "";



module.exports = {
  solidity: "0.8.9",

  networks: {
    hardhat: {

      chainId: 1337,
      blockGasLimit: 100000000429720,
      gas: 2100000,
      gasPrice: 8000000000
    },

    polygon: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [`${walletPrivateKey}`],
      chainId: 80001,
      blockGasLimit: 100000000429720,
      gas: "auto",
      gasPrice: "auto"
    }
    ,

    goerli: {
      url: "https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
      accounts: [`${walletPrivateKey}`],
      chainId: 5,
      blockGasLimit: 100000000429720,
      gas: "auto",
      gasPrice: "auto"
    }
    ,

    bsc: {
      url: "https://bsctestapi.terminet.io/rpc",
      accounts: [`${walletPrivateKey}`],
      chainId: 97,
      blockGasLimit: 100000000429720,
      gas: "auto",
      gasPrice: "auto"
    }
  }
};

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

