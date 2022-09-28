import Head from 'next/head'
import Image from 'next/image'
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Web3Modal from "web3modal";
import { useRouter } from 'next/router';
import { Grid, Card, Text, Button, Row, Spacer, Container, Input, Col } from '@nextui-org/react';
import { simpleCrypto, encryptedHardHat } from '../components/configuration';
import NFTCollectionABI from "../components/ABI/NFTCollection.json"
import NFTresellABI from "../components/ABI/NFTReselll.json"
import { hhRpc } from '../components/configuration';
import { hhNFTCollectionContract } from '../components/configuration';
import { hhNFTResell } from '../components/configuration';
import NavbarCustom from '../components/Navbar';

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

    <Container md>
      <NavbarCustom />
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
    </Container>
  );
}
