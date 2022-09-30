require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",

  networks: {
    hardhat: {

      chainId: 1337,
      blockGasLimit: 100000000429720,
      gas: 2100000,
      gasPrice: 8000000000
    }
  }
};

task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

