import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { Text, Card, Container, Grid, Button, Row, Image, Col, Textarea, Input, Popover, Spacer } from "@nextui-org/react";
import axios from "axios";
import Web3 from "web3"
import { hhImagicaMarketContract, hhMintNftContract, hhRpc, simpleCrypto, encryptedHardHat, ipfsClient } from "../components/configuration";
import { polImagicaMarketContract, polMintNftContract, polRpc, encryptedTestnet } from "../components/configuration";
import { goerImagicaMarketContract, goerMintNftContract, goerRpc } from "../components/configuration";
import { bscImagicaMarketContract, bscMintNftContract, bscRpc } from "../components/configuration";
import ImagicaMarketABI from "../components/ABI/ImagicaMarket.json"
import MintNFTABI from "../components/ABI/MintNft.json"

import { TransactionDescription } from "@ethersproject/abi";
import detectEthereumProvider from "@metamask/detect-provider";
import Changenetwork from "../components/connectNetwork";


export default function CreateNft() {

    const [nftUrl, setnftUrl] = useState(null);
    const [formInput, setformInput] = useState({ price: '', name: '', description: '' });
    const [dynamicmarketContract, setmarketContract] = useState([]);
    const [mintNftContract, setmintNftContract] = useState([]);

    const router = useRouter();

    useEffect(() => {
        setContractAddres();


    }, [setmarketContract, setmintNftContract]);

    async function setContractAddres() {

        //multichain started 

        const HARDHAT = "0x539";
        const POLYGON = "0x13881";
        const GOERLI = "0x5";
        const BSC = "0x61";

        const metamask = await detectEthereumProvider();
        let marketAddr;
        let mintNftAddr;
        let network;
        try {
            if (metamask.chainId == HARDHAT) {
                marketAddr = hhImagicaMarketContract
                mintNftAddr = hhMintNftContract;
                network = HARDHAT;
                console.log("Addresses of HH ===>", marketAddr, " ", mintNftAddr);
            }

            else if (metamask.chainId == POLYGON) {
                marketAddr = polImagicaMarketContract
                mintNftAddr = polMintNftContract;
                network = POLYGON;
                console.log("Addresses of Polygon ===>", marketAddr, " ", mintNftAddr);
            }

            else if (metamask.chainId == GOERLI) {
                marketAddr = goerImagicaMarketContract
                mintNftAddr = goerMintNftContract;
                network = GOERLI;
                console.log("Addresses of Goerli ===>", marketAddr, " ", mintNftAddr);

            }

            else if (metamask.chainId == BSC) {
                marketAddr = bscImagicaMarketContract
                mintNftAddr = bscMintNftContract;
                network = BSC;
                console.log("Addresses of BSC ===>", marketAddr, " ", mintNftAddr);
            }

            setmarketContract(marketAddr);
            setmintNftContract(mintNftAddr);
            await new Promise((r) => setTimeout(r, 2000));
            console.log(`Address of the contracts ${dynamicmarketContract} and ${mintNftContract} are on ${network}`);


        }

        catch (error) {
            console.log(error);
        }

        //multichain ended 
    }


    //uploads image to IPFS
    async function onChange(e) {
        const file = e.target.files[0];
        try {

            const added = await ipfsClient.add(
                file,
                {
                    progress: (prog) => console.log("Inside the IPFS Client =>>>>>>>-_- => ", prog)
                }
            )

            //This domain now has been deprecated
            //  const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            const url = `https://infura-ipfs.io/ipfs/${added.path}`;
            setnftUrl(url);
        }
        catch (error) {
            console.log("Error is ::>", error);
        }
    }


    async function mintNftToList() {
        const { name, price, description } = formInput;
        if (!name || !price || !description || !nftUrl) { console.log("Some input field is kept blank by the user"); }

        const data = JSON.stringify({
            name, description, price, image: nftUrl

        })

        try {
            const added = await ipfsClient.add(data);
            const url = `https://infura-ipfs.io/ipfs/${added.path}`;
            mintNFT(url);
        }

        catch (error) {
            console.log("Error occured while uploading image to ipfs for listing.> ", error)
        }

    }

    async function mintNFT(url) {
        try {

            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            console.log(`mintnft Address ${mintNftContract}`);
            const mintNftcontract = new ethers.Contract(mintNftContract, MintNFTABI, signer);
            let mintNfttransaction = await mintNftcontract.mintNftToSell(url);
            let tx = await mintNfttransaction.wait();
            let event = tx.events[0];
            console.log("Event occured  ", event);
            let value = event.args[2];
            let tokenId = value.toNumber();
            console.log("token ID After Event  ", tokenId);
            const price = ethers.utils.parseUnits(formInput.price, "ether");
            const marketContract = new ethers.Contract(dynamicmarketContract, ImagicaMarketABI, signer);
            let listingFees = await marketContract.mintingFees();

            console.log(listingFees, " listing fees")
            let marketTransaction = await marketContract.createVaultItem(mintNftContract, price, tokenId, { value: listingFees })
            await marketTransaction.wait();
            router.push("/");
        }
        catch (error) {
            console.log(`Error took place while executing transaction ====> ${error} <<<<=`);
        }

    }


    async function mintNftToSave() {
        const { name, description } = formInput;
        if (!name || !description) { console.log("The required Input Fields are not Entered"); }
        const data = JSON.stringify({
            name, description, image: nftUrl
        })

        try {
            console.log("Execeuting before the error took place");
            const added = await ipfsClient.add(data);
            // console.log("Added path to the Mint Contract ::::::::::", added.path);
            const url = `https://infura-ipfs.io/ipfs/${added.path}`
            mintNFTToKeep(url);
        }

        catch (error) { "Error occured while uploading NFT to keep on IPFS   ", error }
    }

    async function mintNFTToKeep(url) {
        try {
            const web3modal = new Web3Modal();
            const connection = await web3modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            const signer = provider.getSigner();
            const mintContract = new ethers.Contract(mintNftContract, MintNFTABI, signer);
            let mintingFees = await mintContract.mintingFees();

            console.log(`minting fees ${mintingFees}`);
            let transaction = await mintContract.mintNftToKeep(url, { value: mintingFees })
            await transaction.wait();
            router.push("/myNFT");
        }
        catch (error) {
            console.log(`Error took place while executing transaction ====> ${error} <<<<=`);
        }

    }

    return (
        <Container className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 min-h-screen max-w-6xl rounded-lg ">

            <Container md className="p-1 flex  justify-center pt-5 ">
                <Card className="bg-transparent max-w-fit flex justify-items-center min-h-full " >
                    <input
                        type={"file"}
                        name="Asset"
                        onChange={onChange}
                        className="block w-full text-xs text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    />

                    {
                        nftUrl &&
                        //  (  ) &&
                        console.log(nftUrl)
                    }
                    <Image className="rounded max-w-xs min-w-min" src={nftUrl} />
                </Card>

                <Card className="bg-transparent max-w-fit flex justify-items-center" >

                    <Row className="m-4 bg-transparent ">
                        <Input
                            rounded
                            bordered
                            placeholder="NFT Name"
                            color="secondary"
                            onChange={e => setformInput({ ...formInput, name: e.target.value })}
                        />
                    </Row>
                    <Row className="m-4 bg-transparent ">
                        <Input
                            rounded
                            bordered
                            placeholder="Price"
                            color="primary"
                            onChange={e => setformInput({ ...formInput, price: e.target.value })}
                        />
                    </Row >

                    <Row className="m-4 bg-transparent ">
                        <Textarea
                            rounded
                            bordered
                            placeholder="NFT Description"
                            color="warning"
                            minRows={1}
                            onChange={e => setformInput({ ...formInput, description: e.target.value })}
                        />
                    </Row>
                    <Row className="m-4">
                        {<Changenetwork />}
                    </Row>


                </Card>
                <Row>

                </Row>


                <Card className="bg-transparent max-w-fit flex justify-items-center" >

                    <Row className="m-4  ">
                        <Button
                            shadow
                            color="warning"
                            bordered
                            size={"md"}
                            onPress={mintNftToSave}
                        >
                            Mint Nft

                        </Button>

                        <Spacer></Spacer>

                        <Button
                            shadow
                            color="success"
                            bordered
                            size={"md"}
                            onPress={mintNftToList}
                        >
                            List Nft

                        </Button>
                    </Row>
                    <Button
                        shadow
                        color="error"
                        bordered
                        size={""}
                        onPress={setContractAddres}
                        className="p-5 "
                    >
                        Refresh Network

                    </Button>
                </Card>
            </Container>
        </Container>
    )


}