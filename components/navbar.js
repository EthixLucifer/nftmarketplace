import { Navbar, Button, Link, Text, Image, Card, Radio, Container, Row, Col } from "@nextui-org/react";
const navbarElements = " h-8 hover:bg-cyan-100 hover:outline-cyan-700 rounded-sm hover:border flex-shrink";
import {useRouter}  from "next/router";

const NavbarCustom = () => {
    
    return (
        <Container md className="text-xl font-extrabold pb-1">
            <Container className=" ">
                <Navbar shouldHideOnScroll disableShadow="true" isCompact="false" isBordered="false" variant={"floating"} borderWeight={"light"}
                    className="rounded-sm border-transparent  "
                >
                    <Navbar.Brand>

                        <Image src="/chitra1.png"

                            // href="./"
                            className="h-32 w-32"
                          
                        />
                    </Navbar.Brand>
                    <Navbar.Content className="flex justify-center ">
                        <Navbar.Content   >

                        </Navbar.Content >

                        <Navbar.Content >
                            <Navbar.Link
                                href="/" className={navbarElements}>
                                Marketplace
                            </Navbar.Link>
                        </Navbar.Content>


                        <Navbar.Content>
                            <Navbar.Link href="/Collections" className={navbarElements}>
                                Collections
                            </Navbar.Link>
                        </Navbar.Content>

                        <Navbar.Content>
                            <Navbar.Link href="/myNFT" className={navbarElements}>
                                My NFT's
                            </Navbar.Link>
                        </Navbar.Content>


                        <Navbar.Content>
                            <Navbar.Link href="/mintNft" className={navbarElements}>
                                Mint  NFT
                            </Navbar.Link>
                        </Navbar.Content>

                    </Navbar.Content>
                </Navbar>
            </Container>
        </Container>

    );
}
export default NavbarCustom;