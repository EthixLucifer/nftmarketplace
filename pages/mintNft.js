import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { Text, Card, Container, Grid, Button, Row, Image, Col, Textarea, Input, Popover } from "@nextui-org/react";
import axios from "axios";
import Web3 from "web3"
import { hhImagicaMarketContract, hhMintNftContract, hhRpc, simpleCrypto, encryptedHardHat, ipfsClient } from "../components/configuration";
import ImagicaMarketABI from "../components/ABI/ImagicaMarket.json"
import MintNFTABI from "../components/ABI/MintNft.json"
import NavbarCustom from "../components/Navbar"


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

            const url = `https://ipfs.infura.io/ipfs/${added.path}`;
            setnftUrl(url);
        }
        catch (error) {
            console.log("Error is ::>", error);
        }
    }
}