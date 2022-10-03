import Head from 'next/head'
import Image from 'next/image'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal";
import Router, { useRouter } from 'next/router';
import { Grid, Card, Text, Button, Row, Spacer, Container, Input, Col } from '@nextui-org/react';
import { simpleCrypto, encryptedHardHat } from '../components/configuration';
import NFTCollectionABI from "../components/ABI/NFTCollection.json"
import NFTresellABI from "../components/ABI/NFTReselll.json"
import { hhRpc } from '../components/configuration';
import { hhNFTCollectionContract } from '../components/configuration';
import { hhNFTResell } from '../components/configuration';
import NavbarCustom from '../components/Navbar';
import Navbar1 from '../components/Navbar1';
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};






export default function Home() {

  const [hhNFTList, sethhNFTList] = useState([])
  const router = useRouter();
  useEffect(() => {
    loadHardhatResell()
  }, [sethhNFTList])

  async function loadHardhatResell() {
    let hhPriKey = simpleCrypto.decrypt(encryptedHardHat);
    const provider = new ethers.providers.JsonRpcProvider(hhRpc);
    const wallet = new ethers.Wallet(hhPriKey, provider);
    const NFTCollectionContract = new ethers.Contract(hhNFTCollectionContract, NFTCollectionABI, wallet);
    const marketResellContract = new ethers.Contract(hhNFTResell, NFTresellABI, wallet);
    const listedNFTData = await marketResellContract.getListedNft();
    console.log("listed NFT Data", listedNFTData);
    const itemArray = [];

    await Promise.all(
      listedNFTData.map(async (i) => {
        const rawId = i.tokenId;
        const market = i.owner;
        let itemId = parseInt(rawId, 16);
        let cost = i.sellingPrice;
        if (market == hhNFTResell) {
          const tokenUri = await NFTCollectionContract.tokenURI(itemId);
          let cleanUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
          const metadata = axios.get(cleanUri);

          console.log("Market Owner is", market);
          console.log("cost is ", cost)
          console.log("Item Id is ", itemId)
          console.log("cost is ", cost)


          let price = ethers.utils.formatUnits(cost.toString(), 'ether');
          metadata.then((value) => {
            let rawImg = value.data.image;
            let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            let item = {
              price,
              // tokenId: tokenId,
              tokenId: itemId,
              image: image,
              name: value.data.name,
              description: value.data.description,
            };
            itemArray.push(item);
            console.log("Image URL", item.image)

          });

        }

      }))
    await new Promise((r) => setTimeout(r, 3300));
    sethhNFTList(itemArray);


  }

  return (
    <Container xl className='bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 min-h-screen max-w-6xl rounded-2xl'>
      <div className=''>
        <div className=''>
          <Container xl className=''>
            <Container sm className=' mt-2.5 mb-2.5 max-w-5xl'>
              <Text
                h1
                
                weight="bold"
                className=' justify-center flex  text-transparent text-6xl bg-clip-text bg-gradient-to-t from-blue-700 to-blue-900 '
              >
                Latest Nft's Listed For Sale
              </Text>
              <Carousel className='bg-conic-to-t from-gray-900 via-gray-100 to-gray-900 rounded-xl pt-2 flex justify-evenly  '
                swipeable={true}
                draggable={false}
                showDots={true}
                responsive={responsive}
                ssr={true}
                infinite={true}
                autoPlay={true}
                autoPlaySpeed={4005}
                keyBoardControl={true}
                customTransition="all .5"
                transitionDuration={3000}
                containerClass="carousel-container"
                removeArrowOnDeviceType={["tablet", "mobile"]}
                dotListClass="custom-dot-list-style"
                itemClass="carousel-item-padding-60-px"
              >

                {
                  hhNFTList.map((nft, i) => (

                    <div>
                      <Card.Image
                        css={{ marginLeft: '$1', maxWidth: '500px' }}
                        key={i}
                        src={nft.image}
                        className="justify-center flex-1 ml-5 mr-5 rounded-xl"
                      />

                    </div>
                  ))
                }

              </Carousel >

            </Container>
          </Container>
        </div>
        <Container xl>
          <Grid.Container>
            <Row>

              {
                hhNFTList.slice(0, 9).map((nft, i) => {
                  async function buyListedNFT() {
                    try {
                      const web3modal = new Web3Modal();
                      const connection = await web3modal.connect();
                      const provider = new ethers.providers.Web3Provider(connection);
                      const signer = provider.getSigner();
                      const nftResellContract = new ethers.Contract(hhNFTResell, NFTresellABI, signer);
                      const listedNftPrice = ethers.utils.parseUnits(nft.price, 'ether');
                      const transaction = await nftResellContract.buyNft(nft.tokenId, { value: listedNftPrice })
                      await transaction.wait();
                      console.log("Transaction Receipt ", transaction);
                      router.push("/")

                    }
                    catch (error) {
                      console.log("-_- Error occured :::::> ", error);
                    }


                  }
                  return (


                    <Container md className='flex justify-center  pb-1 ' >
                      <Grid xs={5}>
                        <Card variant="flat"
                          isHoverable
                          isPressable
                          borderWeight="extrabold"
                          key={i}
                          className="  rounded-lg ml-auto mr-auto mt-11 max-w-xs border-slate-50 border-spacing-4 flex justify-between flex-grow flex-shrink-0 Pastel bg-gradient-to-bl from-indigo-200 via-indigo-400 to-indigo-900 ">
                          <Card.Header className="p-2 flex justify-evenly">
                            <Row>
                              <Text className=" font-cormorant  text-white font-thin">
                                {nft.name}
                              </Text>

                            </Row>
                            <Row>

                            </Row>
                            <Text className='text-white font-bold'>{nft.tokenId}</Text>

                          </Card.Header>
                          <Card.Divider />
                          <Card.Body>
                            <Card.Image

                              src={nft.image}


                            />
                            <Card.Divider className="mt-4" />
                            <Text className="text-white font-thin font-cormorant">
                              {nft.description}
                            </Text>

                            <Card.Divider />
                            <Row className="flex justify-center max-w-xs">

                              <Text className='font-bold text-white'>
                                {nft.price} Eth
                              </Text>

                            </Row>
                            <Row className="pt-2 flex justify-center ">

                              <Button
                                bordered
                                size={"xs"}
                                color={"success"}
                                className="ml-2 rounded-sm"
                                onPress={buyListedNFT}

                              >
                                Buy NFT
                              </Button>
                            </Row>
                          </Card.Body>
                        </Card>

                      </Grid>

                    </Container>



                  )
                })
              }
            </Row>
          </Grid.Container>
        </Container>
      </div>
    </Container>
  );
}








/* 
<Row>
          {
            hhNFTList.map((nft, i) => (
              <Grid.Container gap={2} justify="flex-start">

                <Grid  >
                  <Card variant="flat"
                    isHoverable
                    isPressable
                    borderWeight="extrabold"
                    className="  w-1/3   rounded-lg ml-auto mr-auto mt-11 border-slate-50 border-spacing-4 bg-gradient-to-r from-emerald-500 to-red-200">
                    <Card.Header className="p-2">
                      <Row>
                        <Text className=" font-cormorant  text-white font-thin">
                          {nft.name}
                        </Text>

                      </Row>
                      <Text className='text-white font-bold'> {nft.tokenId}</Text>
                    </Card.Header>
                    <Card.Divider />
                    <Card.Body>
                      <Card.Image

                        src={nft.image} />
                      <Card.Divider className="mt-4" />
                      <Text className="text-white font-thin font-cormorant">
                        {nft.description}
                      </Text>

                      <Card.Divider />
                      <Row className="pt-2 ">

                        <Input
                          readOnly
                          color="error"
                          size="xs"
                          initialValue={nft.price}

                        />

                        <Button
                          bordered
                          size={"xs"}
                          color={"error"}
                          className="ml-2 rounded-sm"
                        // onPress={executeRelist}

                        >
                          Buy NFT
                        </Button>
                      </Row>
                    </Card.Body>
                  </Card>



                </Grid>


              </Grid.Container>
            ))
          }
        </Row>

*/