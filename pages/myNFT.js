import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Text, Card, Container, Grid, Button, Row, Image, Col, Modal, Input, Popover } from "@nextui-org/react";
import axios from "axios";
import Web3 from "web3"

//used to detect which blockchain is currently used by metamask
import detectEthereumProvider from "@metamask/detect-provider";
import { hhMintNftContract, hhRpc, simpleCrypto, encryptedHardHat, hhImagicaMarketContract } from "../components/configuration";
import { polMintNftContract, polRpc, encryptedTestnet, polImagicaMarketContract } from "../components/configuration";
import { bscMintNftContract, bscRpc, bscImagicaMarketContract } from "../components/configuration";
import { goerMintNftContract, goerRpc, goerImagicaMarketContract } from "../components/configuration";
import ImagicaMarketABI from "../components/ABI/ImagicaMarket.json"
import MintNFTABI from "../components/ABI/MintNft.json"

// const react = require('react');
// const app = react
// const cors = require("cors");
// app.use(cors({ origin: "*", }));


// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });
  




export default function Sell() {
    const [user, setuser] = useState([]);
    const [resalePrice, setresalePrice] = useState({ price: '' });
    const [createdNft, setcreatedNft] = useState([]);
    const [ChainName, setChainName] = useState([]);
    const [rpcUrl, setrpcUrl] = useState([]);
    const [walletPrivateKey, setwalletPrivateKey] = useState([]);
    const [mintNftContractAddress, setmintNftContractAddress] = useState([]);
    const [imagicaMarketContractAddress, setimagicaMarketContractAddress] = useState([]);
    const [loadingState, setloadingState] = useState("true");
    const [uiModal, setuiModal] = useState(false);
    const [errorReason, seterrorReason] = useState([]);
    const router = useRouter();
    useEffect(() => {

        connectUser();
        setRpcUrl();
        setChain();
        // getCreatedNft();
    }, [user, setcreatedNft])

    async function connectUser() {

        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner();

        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            await window.ethereum.send('eth_requestAccounts');
            const accounts = await web3.eth.getAccounts();
            const account = accounts[0];

            setuser(account);
        }
        else {
            <Text>
                Please Install The Metamask Wallet To Continue
            </Text>
            console.log("error is", console.error);
        }

    }

    async function setRpcUrl() {

        const HARDHAT = "0x539";
        const POLYGON = "0x13881";
        const GOERLI = "0x5";
        const BSC = "0x61";

        const metamask = await detectEthereumProvider();
        console.log("metamask ::::::", metamask)
        try {
            let RPC;

            if (metamask.chainId == HARDHAT) {
                RPC = hhRpc;
            }

            else if (metamask.chainId == BSC) {
                RPC = bscRpc;
            }

            else if (metamask.chainId == POLYGON) {
                RPC = polRpc;
            }

            else if (metamask.chainId == GOERLI) {
                RPC = goerRpc;
            }

            else {
                console.log("User is using a Different Chain that is not Added Yet");
            }
            setrpcUrl(RPC);
            console.log("Initialized the RPC URL to ===>", rpcUrl, "<<<=====");
            setPrivateKey();
        }
        catch (error) {
            console.log("Encountered Error while setting the RPC url for the marketplace::::=> ", error, "<<<=====");
        }

    }

    async function setPrivateKey() {

        const HARDHAT = "0x539";
        const POLYGON = "0x13881";
        const GOERLI = "0x5";
        const BSC = "0x61";

        const metamask = await detectEthereumProvider();
        let PRIVATEKEY;

        try {
            if (metamask.chainId == HARDHAT) {
                PRIVATEKEY = encryptedHardHat;
            }

            else if (metamask.chainId == BSC || metamask.chainId == GOERLI || metamask.chainId == POLYGON) {
                PRIVATEKEY = encryptedTestnet;
            }

            else {
                console.log("Both conditions failed while setting the private key");
            }

            setwalletPrivateKey(PRIVATEKEY);
            console.log("Initialized the Wallet key to ==========>>>>>", PRIVATEKEY);
            setContractAddress();

        }
        catch (error) {
            console.log("Encountered Error while setting the wallet key for the marketplace::::=> ", error, "<<<=====");
        }

    }

    async function setContractAddress() {

        try {
            const HARDHAT = "0x539";
            const POLYGON = "0x13881";
            const GOERLI = "0x5";
            const BSC = "0x61";

            const metamask = await detectEthereumProvider();
            let addr;
            let marketAddr;
            if (metamask.chainId == HARDHAT) {
                addr = hhMintNftContract;
                marketAddr = hhImagicaMarketContract;
            }

            else if (metamask.chainId == BSC) {
                addr = bscMintNftContract;
                marketAddr = bscImagicaMarketContract;
            }

            else if (metamask.chainId == POLYGON) {
                addr = polMintNftContract;
                marketAddr = polImagicaMarketContract;
            }

            else if (metamask.chainId == GOERLI) {
                addr = goerMintNftContract;
                marketAddr = goerImagicaMarketContract;
            }

            else {
                console.log("none of the above addresses are set as contract addresses");
            }
            console.log(" MintNft addresses are set as contract addresses=========>", mintNftContractAddress);
            console.log(" MintNft addresses are set as contract addresses=========>", imagicaMarketContractAddress);
            setmintNftContractAddress(addr);
            setimagicaMarketContractAddress(marketAddr);
            getCreatedNft();

        }
        catch (error) { console.log("Error faced while setting the contract Address, ", error) }
    }

    async function setChain() {
        try {
            const HARDHAT = "0x539";
            const POLYGON = "0x13881";
            const GOERLI = "0x5";
            const BSC = "0x61";

            const metamask = await detectEthereumProvider();
            let name;
            if (metamask.chainId == HARDHAT) {
                name = "HARDHAT"
            }

            else if (metamask.chainId == BSC) {
                name = "Binance Smart Chain Testnet";
            }

            else if (metamask.chainId == POLYGON) {
                name = "Polygon Mumbai Testnet"
            }

            else if (metamask.chainId == GOERLI) {
                name = "Goerli Testnet";
            }

            else {
                console.log("none of the above addresses are set as contract addresses");
            }
            setChainName(name);

        }
        catch (error) { console.log("Error faced while setting the contract Address, ", error) }

    }


    async function getCreatedNft() {
        try {
            const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
            const key = simpleCrypto.decrypt(walletPrivateKey);
            const wallet = new ethers.Wallet(key, provider);
            const NFTMintedContract = new ethers.Contract(mintNftContractAddress, MintNFTABI, wallet);
            const itemArray = [];
            console.log("INside getcreatednft::::::::::::")
            NFTMintedContract._tokenId().then(result => {
                console.log("result getcreated ======", result);
                let totalSupply = parseInt(result, 16);
                for (let i = 0; i < totalSupply; i++) {
                    console.log("Inside loop ", i);
                    let tokenId = i + 1;
                    console.log("TokenId getcreated ======", tokenId);
                    const owner = NFTMintedContract.ownerOf(tokenId).catch(function (error) {
                        console.log("FAced error while getting the owner of tokenId ", error);

                    });

                    const rawUri = NFTMintedContract.tokenURI(tokenId).catch(function (error) {
                        console.log("Faced error while fetching the raw URI ", error);
                    });
                    const URI = Promise.resolve(rawUri);
                    const getUri = URI.then(value => {
                        let ipfsURI = value;
                        console.log("Unclean ipfs uri :::::", ipfsURI)
                        let cleanURI = ipfsURI.replace("ipfs://", "https://ipfs.io/ipfs/");
                        console.log("Clean URI  ", cleanURI)
                        let metadata = axios.get(cleanURI).catch(function (error) {
                            console.log(error.toJSON());
                        })
                        console.log("First Metadata ::::>", metadata);
                        return metadata;
                    })
                    console.log("GETURI ", getUri)
                    getUri.then(value => {
                        try {
                            let rawImage = value.data.image;
                            let name = value.data.name;
                            let description = value.data.description;
                            let price = value.data.price;
                            let image = rawImage.replace("ipfs://", "https://ipfs.io/ipfs/");
                            Promise.resolve(owner).then(value => {
                                let owner = value;
                                let meta = {
                                    name: name,
                                    tokenId: tokenId,
                                    image: image,
                                    price: price,
                                    description: description,
                                    owner: owner

                                }
                                console.log("Logging Meta Variable of the CreatNFT function for token Id", tokenId, "=====>", meta, "<========");
                                itemArray.push(meta);
                            })
                        }

                        catch (error) {
                            console.log("Error is the Following ", error);
                        }

                    })
                }
            })

            await new Promise(r => setTimeout(r, 3000));
            setcreatedNft(itemArray);
            setloadingState("false");
        }
        catch (error) {
            console.log("Error while fetching nfts ===>", error, "<<======");
        }
    }

    async function refreshNFT() {
        setrpcUrl();
        setChain();
    }

    async function connectWallet() {
        connectUser();
        setrpcUrl();
        setChain();

    }

    //Executes when there are no Nfts in the wallet
    if (loadingState === "false" && !createdNft.length)
        return (
            <Container className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 max-w-6xl rounded-md pb-5 min-h-screen">

                <Grid.Container className="justify-center pt-2" >
                    <Grid>

                        <Card isHoverable variant="bordered" className=" rounded-md p-2 font-cormorant font-bold border-amber-700 z-0 bg-gradient-to-r from-slate-500 to-yellow-100">
                            <Card.Header className="justify-center flex-1">
                                {user}
                            </Card.Header>

                            <Row className=" justify-between pl-4 pr-4  ">

                                <Button bordered color={"error"} size={"sm"} onPress={connectUser} className="font-bold justify-center rounded-sm">Refresh Wallet</Button>

                                <Button bordered color={"secondary"} size={"sm"} onPress={getCreatedNft}
                                    className="font-bold justify-center rounded-sm"
                                >Refresh NFT&apos;s</Button>
                            </Row>

                        </Card>
                    </Grid>
                </Grid.Container>
                <Container xs className="">


                    <Image
                        className="h-52"
                        src="/nonft.png"
                    />


                </Container>
            </Container>

        );

    //executes when there are nfts in the wallet
    return (
        <div className=" ">
            <Container xl className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 max-w-6xl rounded-md pb-5 min-h-screen">
                {/* bg-[url('/imagename')] */}

                <Grid.Container className="justify-center pt-2" >
                    <Grid>

                        <Card isHoverable variant="flat"
                            isPressable
                            className=" rounded-md p-1 pb-2 font-cormorant font-bold border-amber-700 z-0 bg-gradient-to-r from-slate-500 to-yellow-100">
                            <Card.Header className="justify-center flex-1 z-10">
                                {user}
                            </Card.Header>

                            <Row className=" justify-between pl-4 pr-4  ">

                                <Button bordered color={"error"} size={"sm"} onPress={connectWallet} className="font-bold justify-center rounded-sm">Refresh Wallet</Button>

                                {/* <Button bordered color={"secondary"} size={"sm"} onPress={getWalletNFT} */}
                                <Button bordered color={"secondary"} size={"sm"} onPress={refreshNFT}
                                    className="font-bold justify-center rounded-sm"
                                >Refresh NFT&apos;s</Button>
                            </Row>

                        </Card>
                    </Grid>
                </Grid.Container>



                {/* describes nfts minted from the platform  */}
                <Grid.Container className=" mt-1  ">
                    {
                        createdNft.map((nfts, i) => {
                            let owner = user;
                            if (owner.indexOf(nfts.owner) !== -1) {
                                // if (nfts.owner === user) {
                                async function executeRelist() {
                                    const { price } = resalePrice;
                                    if (!price) { return }

                                    //checks in the price of the input is a Nan
                                    else if (isNaN(price)) {
                                        console.log("Input tag in the pricing section is a Non Addressable Number :::::> -_- ", price);
                                        seterrorReason("Dear User😃 or Potential Recruiter 😇 Please, Just Put Numbers in the Input Field");
                                        setuiModal(true);
                                    }
                                    try {
                                        relistNFT()
                                    }

                                    catch (error) {
                                        "something went wrong here is the error ", console.log(error);

                                        seterrorReason(error);
                                        setuiModal(true);
                                    }


                                }
                                async function relistNFT() {
                                    try {
                                        const web3modal = new Web3Modal();
                                        const connection = await web3modal.connect();
                                        const provider = new ethers.providers.Web3Provider(connection);
                                        const signer = provider.getSigner();
                                        const price = ethers.utils.parseUnits(resalePrice.price, 'ether');

                                        const mintNFTContract = new ethers.Contract(mintNftContractAddress, MintNFTABI, signer);
                                        const ImagicaMarketContract = new ethers.Contract(imagicaMarketContractAddress, ImagicaMarketABI, signer);
                                        const nftOwner = await mintNFTContract.ownerOf(nfts.tokenId);
                                        console.log("Owner of the listing NFT ,, ", nftOwner);
                                        let nftMintingFees = await ImagicaMarketContract.mintingFees();
                                        nftMintingFees = nftMintingFees.toString();

                                        let transaction = await ImagicaMarketContract.createVaultItem(mintNftContractAddress, price, nfts.tokenId, { value: nftMintingFees });
                                        await transaction.wait();
                                        router.push('/');

                                    }
                                    catch (error) {
                                        <Popover>
                                            <Popover.Trigger>
                                                {console.log("error is ::>", error)}
                                            </Popover.Trigger>
                                            <Popover.Content>
                                                <Text css={{ p: "$10" }}>{error}</Text>
                                            </Popover.Content>
                                        </Popover>
                                    }
                                }
                                return (


                                    <Card variant="flat"
                                        isHoverable
                                        // isPressable
                                        borderWeight="extrabold"
                                        className="  w-1/5 h-1/5 rounded-lg ml-auto mr-auto mt-11 border-slate-100 border-spacing-4 bg-gradient-to-tl from-gray-400 via-gray-600 to-blue-800" key={nfts.tokenId}>
                                        <Card.Header className="p-2 " key={nfts.tokenId}>
                                            <Row>
                                                <Text className=" font-cormorant  text-white font-thin">
                                                    {nfts.name}
                                                </Text>
                                            </Row>
                                            <Text className='text-white font-bold'> {nfts.tokenId}</Text>
                                        </Card.Header>
                                        <Card.Divider />
                                        <Card.Body>
                                            <Card.Image className="min-h-"

                                                src={nfts.image} />
                                            <Card.Divider className="mt-4" />
                                            <Text className="text-white font-thin font-cormorant">
                                                {nfts.description}
                                            </Text>

                                            <Card.Divider />
                                            <Row className="pt-2 ">

                                                <Input
                                                    rounded
                                                    bordered
                                                    placeholder="Ether"
                                                    color="error"
                                                    size="xs" className="mt-0.5 font-extrabold border-white"
                                                    onChange={e => setresalePrice({ ...resalePrice, price: e.target.value })}
                                                />

                                                <Button
                                                    bordered
                                                    size={"xs"}
                                                    color={"error"}
                                                    className="ml-2 rounded-sm"
                                                    onPress={executeRelist}

                                                >
                                                    Relist NFT
                                                </Button>
                                            </Row>
                                        </Card.Body>
                                    </Card>




                                );
                            }
                        })

                    }
                </Grid.Container>



                {/* Executes when the price for resliting nft is set to NaN */}
                <Modal
                    closeButton
                    aria-labelledby="modal-title"
                    open={uiModal}
                    onClose={() => setuiModal(false)}
                >
                    <Modal.Header>
                        <Text id="modal-title" size={18}>
                            Welcome to
                        </Text>
                        <Text b size={18}>
                            🧐 IMAGIC ART
                        </Text>
                    </Modal.Header>
                    <Modal.Body>

                        <Input
                            readOnly
                            bordered
                            fullWidth
                            color="primary"
                            size="lg"
                            placeholder="Password"
                            initialValue="Set Value of Relisting Nft in Ethers only"
                        />

                    </Modal.Body>
                    <Modal.Footer>
                        <Text> {errorReason}</Text>

                    </Modal.Footer>
                </Modal>

            </Container>
        </div>
    );


}

