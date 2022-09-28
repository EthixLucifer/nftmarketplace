// import '../styles/globals.css'

import { NextUIProvider } from "@nextui-org/react";
import Fonts from "../components/Fonts";
import theme from "../components/theme";
import styles from '../styles/globals.css'


function Web3Marketplace({ Component, pageProps }) {
  return (

    <NextUIProvider theme= {theme}>
      
      
      <Component {...pageProps} />
    </NextUIProvider>
  );
}

export default Web3Marketplace;
