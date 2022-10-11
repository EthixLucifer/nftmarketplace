// import '../styles/globals.css'

import { NextUIProvider } from "@nextui-org/react";
import Fonts from "../components/Fonts";
import theme from "../components/theme";
import styles from '../styles/globals.css'
import NavbarCustom  from "../components/Navbar";



function Web3Marketplace({ Component, pageProps }) {
  return (

    <NextUIProvider theme={theme}>

      <NavbarCustom />
      
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default Web3Marketplace;
