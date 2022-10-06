import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Text, Card, Container, Grid, Button, Row, Image, Col, Modal, Input, Popover } from "@nextui-org/react";
import axios from "axios";
import Web3 from "web3"
import { hhNFTResell, hhMintNftContract, hhNFTCollectionContract, hhRpc, simpleCrypto, encryptedHardHat, hhImagicaMarketContract } from "../components/configuration";
import NFTCollectionABI from "../components/ABI/NFTCollection.json"
import ImagicaMarketABI from "../components/ABI/ImagicaMarket.json"
import resellNFTABI from "../components/ABI/NFTReselll.json"
import MintNFTABI from "../components/ABI/MintNft.json"
import NavbarCustom from "../components/Navbar"





export default function Sell() {
    const [user, setuser] = useState([])
    const [resalePrice, setresalePrice] = useState({ price: '' })
    const [createdNft, setcreatedNft] = useState([]);
    const [nft, setnft] = useState([]);
    const [loadingState, setloadingState] = useState("true");
    const [uiModal, setuiModal] = useState(false);
    const router = useRouter();
    useEffect(() => {

        connectUser();
        getCreatedNft();
    }, [setnft, user, setcreatedNft])

    async function connectUser() {
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



  

    async function getCreatedNft() {
        const provider = new ethers.providers.JsonRpcProvider(hhRpc);
        const key = simpleCrypto.decrypt(encryptedHardHat);
        const wallet = new ethers.Wallet(key, provider);
        const NFTMintedContract = new ethers.Contract(hhMintNftContract, MintNFTABI, wallet);
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
                })
            }
        })

        await new Promise(r => setTimeout(r, 3000));
        setcreatedNft(itemArray);
        setloadingState("false");
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
                                >Refresh NFT's</Button>
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

                                <Button bordered color={"error"} size={"sm"} onPress={connectUser} className="font-bold justify-center rounded-sm">Refresh Wallet</Button>

                                {/* <Button bordered color={"secondary"} size={"sm"} onPress={getWalletNFT} */}
                                <Button bordered color={"secondary"} size={"sm"} onPress={getCreatedNft}
                                    className="font-bold justify-center rounded-sm"
                                >Refresh NFT's</Button>
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
                                        setuiModal(true);
                                    }
                                    try {
                                        relistNFT()
                                    }

                                    catch (error) { "something went wrong here is the error ", console.log(error); }

                                }
                                async function relistNFT() {
                                    try {
                                        const web3modal = new Web3Modal();
                                        const connection = await web3modal.connect();
                                        const provider = new ethers.providers.Web3Provider(connection);
                                        const signer = provider.getSigner();
                                        const price = ethers.utils.parseUnits(resalePrice.price, 'ether');

                                        const mintNFTContract = new ethers.Contract(hhMintNftContract, MintNFTABI, signer);
                                        const ImagicaMarketContract = new ethers.Contract(hhImagicaMarketContract, ImagicaMarketABI, signer);
                                        const nftOwner = await mintNFTContract.ownerOf(nfts.tokenId);
                                        console.log("Owner of the listing NFT ,, ", nftOwner);
                                        let nftMintingFees = await ImagicaMarketContract.mintingFees();
                                        nftMintingFees = nftMintingFees.toString();

                                        let transaction = await ImagicaMarketContract.createVaultItem(hhMintNftContract, price, nfts.tokenId, { value: nftMintingFees });
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
                                        className="  w-1/5 h-1/5 rounded-lg ml-auto mr-auto mt-11 border-slate-100 border-spacing-4 bg-gradient-to-tl from-gray-400 via-gray-600 to-blue-800">
                                        <Card.Header className="p-2 ">
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
                            🧐 IMAGICA
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
                        <Text>Dear User😃 or Potential Recruiter 😇 Please, Just Put Numbers in the Input Field </Text>
                    </Modal.Footer>
                </Modal>

            </Container>
        </div>
    );


}

