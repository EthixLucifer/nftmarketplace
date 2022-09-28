import SimpleCrypto from "simple-crypto-js";



const CipherKey = "thisTextIsGoingToBeUsedForEncryptionOfThePrivateKeys";
const etheRaw = "c51d87b35537032f2fcf14c842015fb0ae5da9d96cfe4d7b43e4e4134038fcdc";
const hardHatRaw = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";


export const simpleCrypto = new SimpleCrypto(CipherKey);
export const encryptedEth = simpleCrypto.encrypt(etheRaw);
export const encryptedHardHat = simpleCrypto.encrypt(hardHatRaw);



/*
██╗  ██╗ █████╗ ██████╗ ██████╗ ██╗  ██╗ █████╗ ████████╗    ████████╗███████╗███████╗████████╗███╗   ██╗███████╗████████╗
██║  ██║██╔══██╗██╔══██╗██╔══██╗██║  ██║██╔══██╗╚══██╔══╝    ╚══██╔══╝██╔════╝██╔════╝╚══██╔══╝████╗  ██║██╔════╝╚══██╔══╝
███████║███████║██████╔╝██║  ██║███████║███████║   ██║          ██║   █████╗  ███████╗   ██║   ██╔██╗ ██║█████╗     ██║   
██╔══██║██╔══██║██╔══██╗██║  ██║██╔══██║██╔══██║   ██║          ██║   ██╔══╝  ╚════██║   ██║   ██║╚██╗██║██╔══╝     ██║   
██║  ██║██║  ██║██║  ██║██████╔╝██║  ██║██║  ██║   ██║          ██║   ███████╗███████║   ██║   ██║ ╚████║███████╗   ██║   
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝          ╚═╝   ╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═══╝╚══════╝   ╚═╝   
                                   (Address of the Contracts on the hardhat network)
*/

export const hhNFTResell = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const hhNFTCollectionContract = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const hhRpc = "http://localhost:8545";


