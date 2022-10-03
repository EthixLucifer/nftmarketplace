import SimpleCrypto from "simple-crypto-js";
import { create } from "ipfs-http-client";


const CipherKey = "thisTextIsGoingToBeUsedForEncryptionOfThePrivateKeys";
const etheRaw = "c51d87b35537032f2fcf14c842015fb0ae5da9d96cfe4d7b43e4e4134038fcdc";
const hardHatRaw = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


export const simpleCrypto = new SimpleCrypto(CipherKey);
export const encryptedEth = simpleCrypto.encrypt(etheRaw);
export const encryptedHardHat = simpleCrypto.encrypt(hardHatRaw);

// Ipfs client Api for Uploading Images 

// const client = require('ipfs-http-client');
// export const ipfsClient = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');

const projectId = '2AzOp2QniIoDZwt9eLEwbATdJdW'
const projectSecret = '005ecf150d1bfe7d2d623649d824758d'



const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export const ipfsClient = create({
  host: 'infura-ipfs.io',
  port: 5001,
  protocol: 'https',

  headers: {
    authorization: auth
  }
});


/*   
     (Address of the Contracts on the hardhat network)
*/

export const hhNFTResell = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const hhNFTCollectionContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const hhImagicaMarketContract = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f"
export const hhMintNftContract = "0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB"
export const hhRpc = "http://localhost:8545";


