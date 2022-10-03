import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { Text, Card, Container, Grid, Button, Row, Image, Col, Textarea, Input, Popover, Spacer } from "@nextui-org/react";
import axios from "axios";
import Web3 from "web3"
import { hhImagicaMarketContract, hhMintNftContract, hhRpc, simpleCrypto, encryptedHardHat, ipfsClient } from "../components/configuration";
import ImagicaMarketABI from "../components/ABI/ImagicaMarket.json"
import MintNFTABI from "../components/ABI/MintNft.json"

import { TransactionDescription } from "@ethersproject/abi";


export default function createNft() {

    const [nftUrl, setnftUrl] = useState(null);
    const [formInput, setformInput] = useState({ price: '', name: '', description: '' });
    const router = useRouter();

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
            const added = ipfsClient.add(data);
            const url = `https://infura-ipfs.io/ipfs/${added.path}`;
            mintNFT(url);
        }

        catch (error) {
            console.log("Error occured while uploading image to ipfs for listing.> ", error)
        }

    }

    async function mintNFT(url) {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        const mintNftcontract = new ethers.Contract(hhMintNftContract, MintNFTABI, signer);
        let mintNfttransaction = await mintNftcontract.mintNftToSell(url);
        let tx = await mintNfttransaction.wait();
        let event = tx.events[0];
        console.log("Event occured  ", event);
        let value = event.args[2];
        let tokenId = value.toNumber();
        console.log("token ID After Event  ", tokenId);
        const price = ethers.utils.parseUnits(formInput.price, "ether");
        const marketContract = new ethers.Contract(hhImagicaMarketContract, ImagicaMarketABI, signer);
        let listingFees = await marketContract.mintingFees();
       
        console.log(listingFees, " listing fees")
        let marketTransaction = await marketContract.createVaultItem(hhMintNftContract, price, tokenId, { value: listingFees })
        await marketTransaction.wait();
        router.push("/");

    }


    async function mintNftToSave() {
        const { name, description } = formInput;
        if (!name || !description) { console.log("The required Input Fields are not Entered"); }
        const data = JSON.stringify({
            name, description, image: nftUrl
        })

        try {
            const added = await ipfsClient.add(data);
            // console.log("Added path to the Mint Contract ::::::::::", added.path);
            const url = `https://infura-ipfs.io/ipfs/${added.path}`
            mintNFTToKeep(url);
        }

        catch (error) { "Error occured while uploading NFT to keep on IPFS   ", error }
    }

    async function mintNFTToKeep(url) {
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();
        const mintContract = new ethers.Contract(hhMintNftContract, MintNFTABI, signer);
        const mintingFees = mintContract.mintingFees();
        let transaction = await mintContract.mintNftToKeep(url, { value: mintingFees })
        await transaction.wait();
        router.push("/myNFT");

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
                </Card>
            </Container>
        </Container>
    )


}