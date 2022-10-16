// import '../styles/globals.css'

import { NextUIProvider } from "@nextui-org/react";
import theme from "../components/theme";
import styles from '../styles/globals.css'
import NavbarCustom from "../components/Navbar";
import Footer from "../components/Footer"



function Web3Marketplace({ Component, pageProps }) {
  return (

    <NextUIProvider theme={theme}>

      <NavbarCustom />

      <Component {...pageProps} />
      <Footer />
    </NextUIProvider>
  );
}

export default Web3Marketplace;
