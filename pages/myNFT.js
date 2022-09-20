import { ethers } from "ethers";
import { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";
import { Text, Card, Container, Grid, Button, Row, Image, Col, Textarea, Input } from "@nextui-org/react";
import axios from "axios";
import Web3 from "web3"
import { hhNFTResell, hhNFTCollectionContract, hhRpc, simpleCrypto, encryptedHardHat } from "../components/configuration";
import NFTCollectionABI from "../components/ABI/NFTCollection.json"
import resellNFTABI from "../components/ABI/NFTReselll.json"
import NavbarCustom from "../components/Navbar"





export default function Sell() {
    const [user, setuser] = useState([])
    const [resalePrice, setresalePrice] = useState({ price: '' })
    const [nft, setnft] = useState([]);
    const [loadingState, setloadingState] = useState("true");
    const router = useRouter();
    useEffect(() => {

        connectUser();
        getWalletNFT();
    }, [setnft, setuser])

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



    async function getWalletNFT() {
        try {

            const provider = new ethers.providers.JsonRpcProvider(hhRpc);

            const key = simpleCrypto.decrypt(encryptedHardHat);

            const wallet = new ethers.Wallet(key, provider);

            const contract = new ethers.Contract(hhNFTCollectionContract, NFTCollectionABI, wallet);

            const itemArray = [];

            contract.totalSupply().then(result => {

                let totalSup = parseInt(result, 16);

                for (let i = 0; i < totalSup; i++) {

                    let tokenId = i + 1;

                    const owner = contract.ownerOf(tokenId);

                    const rawUri = contract.tokenURI(tokenId);
                    const uri = Promise.resolve(rawUri);
                    const getUri = uri.then(value => {

                        let ipfsUri = value;

                        console.log("Unclean IPFS Uri :", ipfsUri)

                        let cleanUri = ipfsUri.replace("ipfs://", "https://ipfs.io/ipfs/")

                        console.log(cleanUri);

                        let metadata = axios.get(cleanUri).catch(function (error) {

                            console.log(error.toJSON());

                        });

                        return metadata;
                    })

                    getUri.then(value => {
                        let rawImage = value.data.image;
                        let name = value.data.name;
                        let desc = value.data.description;
                        let image = rawImage.replace("ipfs://", "https://ipfs.io/ipfs/")
                        Promise.resolve(owner).then(value => {
                            let ownerAddress = value;
                            let meta = {
                                name: name,
                                img: image,
                                tokenId: tokenId,
                                wallet: ownerAddress,
                                description: desc,

                            }

                            console.log("Owner of Nft=>", owner);
                            console.log("Metadata Of NFT =>", meta);
                            itemArray.push(meta);
                        })
                    })
                }

            })

            await new Promise(r =>
                setTimeout(r, 2000)
            );
            setnft(itemArray);
            setloadingState("false");

        }
        catch (error) {
            console.log("Error is", error)
        }
    }

    if (loadingState === "false" && !nft.length)
        return (
            <Container>
                <NavbarCustom />
                <Grid.Container className="justify-center pt-2" >
                    <Grid>

                        <Card isHoverable variant="bordered" className=" rounded-md p-2 font-cormorant font-bold ">
                            <Card.Header className="justify-center flex-1">
                                {user}
                            </Card.Header>

                            <Row className=" justify-between pl-4 pr-4  ">

                                <Button bordered color={"error"} size={"sm"} onPress={connectUser} className="font-bold justify-center rounded-sm">Refresh Wallet</Button>

                                <Button bordered color={"secondary"} size={"sm"} onPress={getWalletNFT}
                                    className="font-bold justify-center rounded-sm"
                                >Refresh NFT's</Button>
                            </Row>

                        </Card>
                    </Grid>
                </Grid.Container>
                <Container xs className="    ">


                    <Image
                        className="h-52"
                        src="/nonft.png"
                    />


                </Container>
            </Container>

        );

    return (

        <Container md >
            <NavbarCustom />
            <Grid.Container className="justify-center pt-2" >
                <Grid>

                    <Card isHoverable variant="bordered" className=" rounded-md p-2 font-cormorant font-bold ">
                        <Card.Header className="justify-center flex-1">
                            {user}
                        </Card.Header>

                        <Row className=" justify-between pl-4 pr-4  ">

                            <Button bordered color={"error"} size={"sm"} onPress={connectUser} className="font-bold justify-center rounded-sm">Refresh Wallet</Button>

                            <Button bordered color={"secondary"} size={"sm"} onPress={getWalletNFT}
                                className="font-bold justify-center rounded-sm"
                            >Refresh NFT's</Button>
                        </Row>

                    </Card>
                </Grid>
            </Grid.Container>
            <Grid.Container className=" mt-1  ">
                {nft.map((nfts, i) => {
                    var owner = user;
                    if (owner.indexOf(nfts.wallet) !== -1) {
                        async function executeRelist() {
                            const { price } = resalePrice;
                            if (!price) { return }
                            try {
                                relistNFT()
                            }

                            catch (error) { "something went wrong here is the error ", console.log(error); }

                        }
                        async function relistNFT() {

                            const web3modal = new Web3Modal();
                            const connection = await web3modal.connect();
                            const provider = new ethers.providers.Web3Provider(connection);
                            const signer = provider.getSigner();
                            const price = ethers.utils.parseUnits(resalePrice.price, 'ether');
                            const contractNFT = new ethers.Contract(hhNFTCollectionContract, NFTCollectionABI, signer);
                            await contractNFT.setApprovallForAll(hhNFTResell, true);
                            let contractResell = new ethers.Contract(hhNFTResell, resellNFTABI, signer);
                            let listingFees = await contractResell.getlistingFee();
                            listingFees = listingFees.toString();
                            let transaction = await contractResell.listNftSale(nfts.tokenId, price, { value: listingFees });
                            await transaction.wait();
                            router.push('/');
                        }
                        return (


                            <Card variant="flat"
                                isHoverable
                                // isPressable
                                borderWeight="extrabold"
                                className="  w-1/4 h-1/5 rounded-lg ml-auto mr-auto mt-11 border-slate-100 border-spacing-4 bg-gradient-to-r from-sky-500 to-indigo-300">
                                <Card.Header className="p-2 ">
                                    <Row>
                                        <Text className="z-10 font-cormorant  text-white font-thin">
                                            {nfts.name}
                                        </Text>
                                    </Row>
                                </Card.Header>
                                <Card.Divider />
                                <Card.Body>
                                    <Card.Image

                                        src={nfts.img} />
                                    <Card.Divider className="mt-4" />
                                    <Text className="text-white font-thin font-cormorant">
                                        {nfts.description}
                                    </Text>

                                    <Card.Divider />
                                    <Row className="pt-2 ">
                                        {/* <Textarea
                                        placeholder="Price in Eth"
                                        
                                            underlined
                                            color="warning"
                                            size="xs"
                                            minRows={1}
                                            maxRows={1}
                                            className="font-extrabold text-white"
                                        /> */}
                                        <Input
                                            rounded
                                            bordered
                                            placeholder="Price in Eth"
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
                })}
            </Grid.Container>


        </Container>
    );


}

