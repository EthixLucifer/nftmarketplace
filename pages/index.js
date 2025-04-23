import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal";
import { useRouter } from 'next/router';
import { Grid, Card, Text, Button, Row, Spacer, Container } from '@nextui-org/react';
import { simpleCrypto, encryptedHardHat, encryptedTestnet } from '../components/configuration';
import MintNFTABI from "../components/ABI/MintNft.json"
import ImagicaMarketABI from "../components/ABI/ImagicaMarket.json"
import { hhRpc, polRpc, bscRpc, goerRpc } from '../components/configuration';
import { hhMintNftContract, hhImagicaMarketContract } from '../components/configuration';
import { goerMintNftContract, goerImagicaMarketContract } from '../components/configuration';
import { bscMintNftContract, bscImagicaMarketContract } from '../components/configuration';
import { polMintNftContract, polImagicaMarketContract } from '../components/configuration';

import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";


export default function Home() {

  const [hhNFTList, sethhNFTList] = useState([])
  const [goerNFTList, setgoerNFTList] = useState([])
  const [bscNFTList, setbscNFTList] = useState([])
  const [polNFTList, setpolNFTList] = useState([])
  const router = useRouter();

  useEffect(() => {
    loadHardhatResell();
    loadGoerliResell();
    loadBscResell();
    loadPolygonResell();

  }, [sethhNFTList, setgoerNFTList, setbscNFTList, setpolNFTList]);

  // Sets NFTs listed on Hardhat Network 
  async function loadHardhatResell() {
    try {
      let hhPriKey = simpleCrypto.decrypt(encryptedHardHat);
      const provider = new ethers.providers.JsonRpcProvider(hhRpc);
      const wallet = new ethers.Wallet(hhPriKey, provider);
      const ImagicaMarketContract = new ethers.Contract(hhImagicaMarketContract, ImagicaMarketABI, wallet);
      const mintNFTContract = new ethers.Contract(hhMintNftContract, MintNFTABI, wallet);
      const listedNFTData = await ImagicaMarketContract.getAvailableNFT();
      console.log("listed NFT on Hardhat Network====> ", listedNFTData);
      const itemArray = [];

      await Promise.all(
        listedNFTData.map(async (i) => {
          const rawTokenId = i.tokenId;
          const rawItemId = i.itemId;
          const market = i.owner;
          let tokenId = parseInt(rawTokenId, 16);
          let itemId = parseInt(rawItemId, 16);
          let cost = i.price;
          const tokenUri = await mintNFTContract.tokenURI(tokenId);
          let cleanUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
          const metadata = axios.get(cleanUri);

          console.log("Market Owner is", market);
          console.log("cost is ", cost)
          console.log("Token Id is ", tokenId)
          console.log("Item Id is ", i.itemId)
          console.log("cost is ", cost)


          let price = ethers.utils.formatUnits(cost.toString(), 'ether');
          metadata.then((value) => {
            let rawImg = value.data.image;
            let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            let item = {
              price,
              itemId: itemId,
              tokenId: tokenId,
              image: image,
              name: value.data.name,
              description: value.data.description,
              seller: i.seller,
            };
            itemArray.push(item);
            console.log("Image URL", item.image)

          });

        }))
      await new Promise((r) => setTimeout(r, 3300));
      sethhNFTList(itemArray);
    }
    catch (error) {
      console.log(error.message);
    }

  }


  // Sets NFTs listed on Goerli Network 
  async function loadGoerliResell() {
    try {
      let PriKey = simpleCrypto.decrypt(encryptedTestnet);
      const provider = new ethers.providers.JsonRpcProvider(goerRpc);
      const wallet = new ethers.Wallet(PriKey, provider);
      const ImagicaMarketContract = new ethers.Contract(goerImagicaMarketContract, ImagicaMarketABI, wallet);
      const mintNFTContract = new ethers.Contract(goerMintNftContract, MintNFTABI, wallet);
      const listedNFTData = await ImagicaMarketContract.getAvailableNFT();
      console.log("listed NFT on Goerli Network :::::=>", listedNFTData);
      const itemArray = [];

      await Promise.all(
        listedNFTData.map(async (i) => {
          const rawTokenId = i.tokenId;
          const rawItemId = i.itemId;
          const market = i.owner;
          let tokenId = parseInt(rawTokenId, 16);
          let itemId = parseInt(rawItemId, 16);
          let cost = i.price;
          const tokenUri = await mintNFTContract.tokenURI(tokenId);
          let cleanUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
          const metadata = axios.get(cleanUri);

          console.log("Market Owner is", market);
          console.log("cost is ", cost);
          console.log("Token Id is ", tokenId);
          console.log("Item Id is ", i.itemId);
          console.log("cost is ", cost);


          let price = ethers.utils.formatUnits(cost.toString(), 'ether');
          metadata.then((value) => {
            let rawImg = value.data.image;
            let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            let item = {
              price,
              itemId: itemId,
              tokenId: tokenId,
              image: image,
              name: value.data.name,
              description: value.data.description,
              seller: i.seller,
            };
            itemArray.push(item);
            console.log("Image URL", item.image)

          });
        }))
      await new Promise((r) => setTimeout(r, 3300));
      setgoerNFTList(itemArray);
    }
    catch (error) {
      console.log(error.message);
    }

  }

  // Sets NFTs listed on BSC Testnet Network 
  async function loadBscResell() {
    try {
      let PriKey = simpleCrypto.decrypt(encryptedTestnet);
      const provider = new ethers.providers.JsonRpcProvider(bscRpc);
      const wallet = new ethers.Wallet(PriKey, provider);
      const ImagicaMarketContract = new ethers.Contract(bscImagicaMarketContract, ImagicaMarketABI, wallet);
      const mintNFTContract = new ethers.Contract(bscMintNftContract, MintNFTABI, wallet);
      const listedNFTData = await ImagicaMarketContract.getAvailableNFT();
      console.log("listed NFT on Bsc Network :::::=>", listedNFTData);
      const itemArray = [];

      await Promise.all(
        listedNFTData.map(async (i) => {
          const rawTokenId = i.tokenId;
          const rawItemId = i.itemId;
          const market = i.owner;
          let tokenId = parseInt(rawTokenId, 16);
          let itemId = parseInt(rawItemId, 16);
          let cost = i.price;
          const tokenUri = await mintNFTContract.tokenURI(tokenId);
          let cleanUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
          const metadata = axios.get(cleanUri);

          console.log("Market Owner is", market);
          console.log("cost is ", cost);
          console.log("Token Id is ", tokenId);
          console.log("Item Id is ", i.itemId);
          console.log("cost is ", cost);


          let price = ethers.utils.formatUnits(cost.toString(), 'ether');
          metadata.then((value) => {
            let rawImg = value.data.image;
            let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            let item = {
              price,
              itemId: itemId,
              tokenId: tokenId,
              image: image,
              name: value.data.name,
              description: value.data.description,
              seller: i.seller,
            };
            itemArray.push(item);
            console.log("Image URL", item.image)

          });
        }))
      await new Promise((r) => setTimeout(r, 3300));
      setbscNFTList(itemArray);
    }
    catch (error) {
      console.log(error.message);
    }

  }

  // Sets NFTs listed on BSC Testnet Network 
  async function loadPolygonResell() {
    try {
      let PriKey = simpleCrypto.decrypt(encryptedTestnet);
      const provider = new ethers.providers.JsonRpcProvider(polRpc);
      const wallet = new ethers.Wallet(PriKey, provider);
      const ImagicaMarketContract = new ethers.Contract(polImagicaMarketContract, ImagicaMarketABI, wallet);
      const mintNFTContract = new ethers.Contract(polMintNftContract, MintNFTABI, wallet);
      const listedNFTData = await ImagicaMarketContract.getAvailableNFT();
      console.log("listed NFT on Polygon Network :::::=>", listedNFTData);
      const itemArray = [];

      await Promise.all(
        listedNFTData.map(async (i) => {
          const rawTokenId = i.tokenId;
          const rawItemId = i.itemId;
          const market = i.owner;
          let tokenId = parseInt(rawTokenId, 16);
          let itemId = parseInt(rawItemId, 16);
          let cost = i.price;
          const tokenUri = await mintNFTContract.tokenURI(tokenId);
          let cleanUri = tokenUri.replace("ipfs://", "https://ipfs.io/ipfs/");
          const metadata = axios.get(cleanUri);

          console.log("Market Owner is", market);
          console.log("cost is ", cost);
          console.log("Token Id is ", tokenId);
          console.log("Item Id is ", i.itemId);
          console.log("cost is ", cost);


          let price = ethers.utils.formatUnits(cost.toString(), 'ether');
          metadata.then((value) => {
            let rawImg = value.data.image;
            let image = rawImg.replace("ipfs://", "https://ipfs.io/ipfs/");
            let item = {
              price,
              itemId: itemId,
              tokenId: tokenId,
              image: image,
              name: value.data.name,
              description: value.data.description,
              seller: i.seller,
            };
            itemArray.push(item);
            console.log("Image URL", item.image)

          });
        }))
      await new Promise((r) => setTimeout(r, 3300));
      setpolNFTList(itemArray);
    }
    catch (error) {
      console.log(error.errorArgs);
    }

  }


  return (
    <div>



      {/* Loads nfts from the Goerli Network */}
      <Container xl className='bg-transparent min-h-screen max-w-6xl rounded-2xl'>
        <div className=''>

          <div className=''>
            <Container xl className=''>
              <Container sm className=' mt-2.5 mb-2.5 max-w-5xl'>
                <Text
                  h1

                  weight="bold"
                  className=' justify-center flex  text-transparent text-6xl bg-clip-text bg-gradient-to-t from-blue-700 to-blue-900 '
                >
                  Latest Nft&apos;s Listed For Sale on Goerli
                </Text>
                <Carousel
                  additionalTransfrom={0}
                  arrows={false}
                  autoPlay
                  autoPlaySpeed={3590}
                  centerMode={false}

                  containerClass="container-with-dots"
                  customTransition="all 3s linear"
                  dotListClass=""
                  draggable={true}
                  focusOnSelect={false}
                  infinite
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  pauseOnHover
                  renderArrowsWhenDisabled={false}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: {
                        max: 3000,
                        min: 1024
                      },
                      items: 3,
                      partialVisibilityGutter: 40
                    },
                    mobile: {
                      breakpoint: {
                        max: 464,
                        min: 0
                      },
                      items: 1,
                      partialVisibilityGutter: 30
                    },
                    tablet: {
                      breakpoint: {
                        max: 1024,
                        min: 464
                      },
                      items: 2,
                      partialVisibilityGutter: 30
                    }
                  }}
                  rewind={false}
                  rewindWithAnimation={false}
                  rtl={false}
                  shouldResetAutoplay
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={2}
                  swipeable
                  transitionDuration={1000}
                  className="mt-4"
                >

                  {
                    goerNFTList.map((nft, i) => (

                      <div key={nft.itemId}>
                        <Card.Image
                          css={{ marginLeft: '$1', maxWidth: '5000px' }}
                          key={i}
                          src={nft.image}
                          className="justify-center flex-1 ml-5 mr-5 rounded-xl "
                        />

                      </div>
                    ))
                  }

                </Carousel >
              </Container>
            </Container>
          </div>


          <Grid.Container>
            <Row>

              {
                goerNFTList.slice(0, 9).map((nft, i) => {
                  // hhNFTList.map((nft, i) => {
                  console.log("NFT Price  ", nft, "++++");
                  async function buyListedNFT() {
                    try {
                      const web3modal = new Web3Modal();
                      const connection = await web3modal.connect();
                      const provider = new ethers.providers.Web3Provider(connection);
                      const signer = provider.getSigner();
                      const ImagicaMarketContract = new ethers.Contract(goerImagicaMarketContract, ImagicaMarketABI, signer);
                      const listedNftPrice = ethers.utils.parseUnits(nft.price, 'ether');
                      const itemId = parseInt(nft.itemId, 16);
                      const transaction = await ImagicaMarketContract.ImagicabuyNft(goerMintNftContract, itemId, { value: listedNftPrice })
                      await transaction.wait();
                      console.log("Transaction Receipt ", transaction);
                      await new Promise((r) => setTimeout(r, 3300));
                      router.push("/")

                    }
                    catch (error) {
                      console.log("-_- Error occured :::::> ", error);
                    }


                  }
                  return (


                    <Container className='flex justify-center  pb-1 ' key={nft.itemId}>
                      <Grid lg={3}>
                        <Card variant="flat"
                          isHoverable
                          isPressable
                          borderWeight="extrabold"
                          key={i}
                          className=" rounded-lg ml-auto mr-auto mt-11 pr-2  border-slate-50 border-spacing-4 flex justify-between flex-grow flex-shrink-0 Pastel bg-gradient-to-bl from-indigo-200 via-indigo-400 to-indigo-900 ">
                          <Card.Header className="p-2 flex justify-center mt">
                            <Row>
                              <Text className=" font-cormorant  text-white font-thin">
                                {nft.name}
                              </Text>

                            </Row>


                          </Card.Header>
                          <Card.Divider />
                          <Card.Body>
                            <Card.Image
                              className=' max-w-xs'

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
                              <Spacer>

                              </Spacer>
                              <Spacer>

                              </Spacer>
                              <Spacer>

                              </Spacer>
                              <Text className='text-white font-bold'>ID {nft.tokenId}</Text>
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

        </div>
      </Container>


      {/* Loads nfts from the BSC Network */}
      <Container xl className='bg-transparent min-h-screen max-w-6xl rounded-2xl'>
        <div className=''>

          <div className=''>
            <Container xl className=''>
              <Container sm className=' mt-2.5 mb-2.5 max-w-5xl'>
                <Text
                  h1

                  weight="bold"
                  className=' justify-center flex  text-transparent text-6xl bg-clip-text bg-gradient-to-t from-blue-700 to-blue-900 '
                >
                  Latest Nft&apos;s Listed For Sale on BSC
                </Text>
                <Carousel
                  additionalTransfrom={0}
                  arrows={false}
                  autoPlay
                  autoPlaySpeed={3590}
                  centerMode={false}

                  containerClass="container-with-dots"
                  customTransition="all 3s linear"
                  dotListClass=""
                  draggable={true}
                  focusOnSelect={false}
                  infinite
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  pauseOnHover
                  renderArrowsWhenDisabled={false}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: {
                        max: 3000,
                        min: 1024
                      },
                      items: 3,
                      partialVisibilityGutter: 40
                    },
                    mobile: {
                      breakpoint: {
                        max: 464,
                        min: 0
                      },
                      items: 1,
                      partialVisibilityGutter: 30
                    },
                    tablet: {
                      breakpoint: {
                        max: 1024,
                        min: 464
                      },
                      items: 2,
                      partialVisibilityGutter: 30
                    }
                  }}
                  rewind={false}
                  rewindWithAnimation={false}
                  rtl={false}
                  shouldResetAutoplay
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={2}
                  swipeable
                  transitionDuration={1000}
                  className="mt-4"
                >

                  {
                    bscNFTList.map((nft, i) => (

                      <div key={nft.itemId}>
                        <Card.Image
                          css={{ marginLeft: '$1', maxWidth: '5000px' }}
                          key={i}
                          src={nft.image}
                          className="justify-center flex-1 ml-5 mr-5 rounded-xl "
                        />

                      </div>
                    ))
                  }

                </Carousel >
              </Container>
            </Container>
          </div>


          <Grid.Container>
            <Row>

              {
                bscNFTList.slice(0, 9).map((nft, i) => {
                  // hhNFTList.map((nft, i) => {
                  console.log("NFT Price  ", nft, "++++");
                  async function buyListedNFT() {
                    try {
                      const web3modal = new Web3Modal();
                      const connection = await web3modal.connect();
                      const provider = new ethers.providers.Web3Provider(connection);
                      const signer = provider.getSigner();
                      const ImagicaMarketContract = new ethers.Contract(bscImagicaMarketContract, ImagicaMarketABI, signer);
                      const listedNftPrice = ethers.utils.parseUnits(nft.price, 'ether');
                      const itemId = parseInt(nft.itemId, 16);
                      const transaction = await ImagicaMarketContract.ImagicabuyNft(bscMintNftContract, itemId, { value: listedNftPrice })
                      await transaction.wait();
                      console.log("Transaction Receipt ", transaction);
                      await new Promise((r) => setTimeout(r, 3300));
                      router.push("/")

                    }
                    catch (error) {
                      console.log("-_- Error occured :::::> ", error);
                    }


                  }
                  return (


                    <Container className='flex justify-center  pb-1 ' key={nft.itemId}>
                      <Grid lg={3}>
                        <Card variant="flat"
                          isHoverable
                          isPressable
                          borderWeight="extrabold"
                          key={i}
                          className=" rounded-lg ml-auto mr-auto mt-11 pr-2  border-slate-50 border-spacing-4 flex justify-between flex-grow flex-shrink-0 Pastel bg-gradient-to-bl from-indigo-200 via-indigo-400 to-indigo-900 ">
                          <Card.Header className="p-2 flex justify-center mt">
                            <Row>
                              <Text className=" font-cormorant  text-white font-thin">
                                {nft.name}
                              </Text>

                            </Row>


                          </Card.Header>
                          <Card.Divider />
                          <Card.Body>
                            <Card.Image
                              className=' max-w-xs'

                              src={nft.image}


                            />
                            <Card.Divider className="mt-4" />
                            <Text className="text-white font-thin font-cormorant">
                              {nft.description}
                            </Text>

                            <Card.Divider />
                            <Row className="flex justify-center max-w-xs">

                              <Text className='font-bold text-white'>
                                {nft.price} BNB
                              </Text>
                              <Spacer>

                              </Spacer>
                              <Spacer>

                              </Spacer>
                              <Spacer>

                              </Spacer>
                              <Text className='text-white font-bold'>ID {nft.tokenId}</Text>
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

        </div>
      </Container>


      {/* Loads nfts from the PolyGon Network */}
      <Container xl className='bg-transparent min-h-screen max-w-6xl rounded-2xl'>
        <div className=''>

          <div className=''>
            <Container xl className=''>
              <Container sm className=' mt-2.5 mb-2.5 max-w-5xl'>
                <Text
                  h1

                  weight="bold"
                  className=' justify-center flex  text-transparent text-6xl bg-clip-text bg-gradient-to-t from-blue-700 to-blue-900 '
                >
                  Latest Nft&apos;s Listed For Sale on PolyGon
                </Text>
                <Carousel
                  additionalTransfrom={0}
                  arrows={false}
                  autoPlay
                  autoPlaySpeed={3590}
                  centerMode={false}

                  containerClass="container-with-dots"
                  customTransition="all 3s linear"
                  dotListClass=""
                  draggable={true}
                  focusOnSelect={false}
                  infinite
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  pauseOnHover
                  renderArrowsWhenDisabled={false}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: {
                        max: 3000,
                        min: 1024
                      },
                      items: 3,
                      partialVisibilityGutter: 40
                    },
                    mobile: {
                      breakpoint: {
                        max: 464,
                        min: 0
                      },
                      items: 1,
                      partialVisibilityGutter: 30
                    },
                    tablet: {
                      breakpoint: {
                        max: 1024,
                        min: 464
                      },
                      items: 2,
                      partialVisibilityGutter: 30
                    }
                  }}
                  rewind={false}
                  rewindWithAnimation={false}
                  rtl={false}
                  shouldResetAutoplay
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={2}
                  swipeable
                  transitionDuration={1000}
                  className="mt-4"
                >

                  {
                    polNFTList.map((nft, i) => (

                      <div key={nft.itemId}>
                        <Card.Image
                          css={{ marginLeft: '$1', maxWidth: '5000px' }}
                          key={i}
                          src={nft.image}
                          className="justify-center flex-1 ml-5 mr-5 rounded-xl "
                        />

                      </div>
                    ))
                  }

                </Carousel >
              </Container>
            </Container>
          </div>


          <Grid.Container>
            <Row>

              {
                polNFTList.slice(0, 9).map((nft, i) => {
                  // hhNFTList.map((nft, i) => {
                  console.log("NFT Price  ", nft, "++++");
                  async function buyListedNFT() {
                    try {
                      const web3modal = new Web3Modal();
                      const connection = await web3modal.connect();
                      const provider = new ethers.providers.Web3Provider(connection);
                      const signer = provider.getSigner();
                      const ImagicaMarketContract = new ethers.Contract(polImagicaMarketContract, ImagicaMarketABI, signer);
                      const listedNftPrice = ethers.utils.parseUnits(nft.price, 'ether');
                      const itemId = parseInt(nft.itemId, 16);
                      const transaction = await ImagicaMarketContract.ImagicabuyNft(polMintNftContract, itemId, { value: listedNftPrice })
                      await transaction.wait();
                      console.log("Transaction Receipt ", transaction);
                      await new Promise((r) => setTimeout(r, 3300));
                      router.push("/")

                    }
                    catch (error) {
                      console.log("-_- Error occured :::::> ", error);
                    }


                  }
                  return (


                    <Container className='flex justify-center  pb-1 ' key={nft.itemId}>
                      <Grid lg={3}>
                        <Card variant="flat"
                          isHoverable
                          isPressable
                          borderWeight="extrabold"
                          key={i}
                          className=" rounded-lg ml-auto mr-auto mt-11 pr-2  border-slate-50 border-spacing-4 flex justify-between flex-grow flex-shrink-0 Pastel bg-gradient-to-bl from-indigo-200 via-indigo-400 to-indigo-900 ">
                          <Card.Header className="p-2 flex justify-center mt">
                            <Row>
                              <Text className=" font-cormorant  text-white font-thin">
                                {nft.name}
                              </Text>

                            </Row>


                          </Card.Header>
                          <Card.Divider />
                          <Card.Body>
                            <Card.Image
                              className=' max-w-xs'

                              src={nft.image}


                            />
                            <Card.Divider className="mt-4" />
                            <Text className="text-white font-thin font-cormorant">
                              {nft.description}
                            </Text>

                            <Card.Divider />
                            <Row className="flex justify-center max-w-xs">

                              <Text className='font-bold text-white'>
                                {nft.price} Matic
                              </Text>
                              <Spacer>

                              </Spacer>
                              <Spacer>

                              </Spacer>
                              <Spacer>

                              </Spacer>
                              <Text className='text-white font-bold'>ID {nft.tokenId}</Text>
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

        </div>
      </Container>

      {/* Loads nfts from Hardhat Network */}
      
      {/* 

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
                  Latest Nft&apos;s Listed For Sale
                </Text>
                <Carousel
                  additionalTransfrom={0}
                  arrows={false}
                  autoPlay
                  autoPlaySpeed={3590}
                  centerMode={false}

                  containerClass="container-with-dots"
                  customTransition="all 3s linear"
                  dotListClass=""
                  draggable={true}
                  focusOnSelect={false}
                  infinite
                  itemClass=""
                  keyBoardControl
                  minimumTouchDrag={80}
                  pauseOnHover
                  renderArrowsWhenDisabled={false}
                  renderButtonGroupOutside={false}
                  renderDotsOutside={false}
                  responsive={{
                    desktop: {
                      breakpoint: {
                        max: 3000,
                        min: 1024
                      },
                      items: 3,
                      partialVisibilityGutter: 40
                    },
                    mobile: {
                      breakpoint: {
                        max: 464,
                        min: 0
                      },
                      items: 1,
                      partialVisibilityGutter: 30
                    },
                    tablet: {
                      breakpoint: {
                        max: 1024,
                        min: 464
                      },
                      items: 2,
                      partialVisibilityGutter: 30
                    }
                  }}
                  rewind={false}
                  rewindWithAnimation={false}
                  rtl={false}
                  shouldResetAutoplay
                  showDots={false}
                  sliderClass=""
                  slidesToSlide={2}
                  swipeable
                  transitionDuration={1000}
                  className="mt-4"
                >

                  {
                    hhNFTList.map((nft, i) => (

                      <div key={nft.itemId}>
                        <Card.Image
                          css={{ marginLeft: '$1', maxWidth: '5000px' }}
                          key={i}
                          src={nft.image}
                          className="justify-center flex-1 ml-5 mr-5 rounded-xl "
                        />

                      </div>
                    ))
                  }

                </Carousel >
              </Container>
            </Container>
          </div>


          <Grid.Container>
            <Row>

              {
                hhNFTList.slice(0, 9).map((nft, i) => {
                  // hhNFTList.map((nft, i) => {
                  console.log("NFT Price  ", nft, "++++");
                  async function buyListedNFT() {
                    try {
                      const web3modal = new Web3Modal();
                      const connection = await web3modal.connect();
                      const provider = new ethers.providers.Web3Provider(connection);
                      const signer = provider.getSigner();
                      const ImagicaMarketContract = new ethers.Contract(hhImagicaMarketContract, ImagicaMarketABI, signer);
                      const listedNftPrice = ethers.utils.parseUnits(nft.price, 'ether');
                      const itemId = parseInt(nft.itemId, 16);
                      const transaction = await ImagicaMarketContract.ImagicabuyNft(hhMintNftContract, itemId, { value: listedNftPrice })
                      await transaction.wait();
                      console.log("Transaction Receipt ", transaction);
                      await new Promise((r) => setTimeout(r, 3300));
                      router.push("/")

                    }
                    catch (error) {
                      console.log("-_- Error occured :::::> ", error);
                    }


                  }
                  return (


                    <Container className='flex justify-center  pb-1 ' key={nft.itemId}>
                      <Grid lg={3}>
                        <Card variant="flat"
                          isHoverable
                          isPressable
                          borderWeight="extrabold"
                          key={i}
                          className=" rounded-lg ml-auto mr-auto mt-11 pr-2  border-slate-50 border-spacing-4 flex justify-between flex-grow flex-shrink-0 Pastel bg-gradient-to-bl from-indigo-200 via-indigo-400 to-indigo-900 ">
                          <Card.Header className="p-2 flex justify-center mt">
                            <Row>
                              <Text className=" font-cormorant  text-white font-thin">
                                {nft.name}
                              </Text>

                            </Row>


                          </Card.Header>
                          <Card.Divider />
                          <Card.Body>
                            <Card.Image
                              className=' max-w-xs'

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
                              <Spacer>

                              </Spacer>
                              <Spacer>

                              </Spacer>
                              <Spacer>

                              </Spacer>
                              <Text className='text-white font-bold'>ID {nft.tokenId}</Text>
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

        </div>
      </Container>
      
      */}

    </div>
  );
}

