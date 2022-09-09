import Head from 'next/head'
import Image from 'next/image'
import { Container } from "@nextui-org/react"
import NavbarCustom from '../components/Navbar';
import { Router } from 'next/router'
import Fonts from '../components/Fonts';

export default function Home() {
  return (
    <Container >

      <Head >
        <title>Nft Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Fonts />

      <NavbarCustom />

    </Container>






  )
}
