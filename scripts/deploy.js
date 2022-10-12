// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");

async function main() {


  const imagicaMarket = await hre.ethers.getContractFactory("imagicaMarket");
  const imagica = await imagicaMarket.deploy();
  await imagica.deployed();


  const mintNFT = await hre.ethers.getContractFactory("mintNft");
  const mintNft = await mintNFT.deploy(imagica.address);
  await mintNft.deployed();

  console.log(
    `Imagica Market Contract Deployed To Address :::=> ${imagica.address} <========`
  );
  console.log(
    `NFT mint Contract Deployed To Address :::=> ${mintNft.address} <========`
  );
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
