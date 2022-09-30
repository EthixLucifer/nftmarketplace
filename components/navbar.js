import { Navbar, Button, Link, Text, Image, Card, Radio, Container, Row, Col } from "@nextui-org/react";
const navbarElements = " h-8 hover:bg-cyan-100 hover:outline-cyan-700 rounded-sm hover:border flex-shrink";

const NavbarCustom = () => {
    return (
        <Container sm className="mt-1 font-cormorant font-extrabold">
            <Container className=" ">
                <Navbar disableShadow="true" isCompact="false" isBordered="true" variant={"floating"} borderWeight={"normal"}
                    className="rounded-sm "
                >
                    <Navbar.Content className="flex justify-evenly ">
                        <Navbar.Content   >

                            <Image src="/chitra1.png"

                                // href="./"
                                className="h-32 w-32"
                            />
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
                                Mint New NFT's
                            </Navbar.Link>
                        </Navbar.Content>

                    </Navbar.Content>
                </Navbar>
            </Container>
        </Container>

    );
}
export default NavbarCustom;