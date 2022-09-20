import { Navbar, Button, Link, Text, Image, Card, Radio, Container, Row, Col } from "@nextui-org/react";
const navbarElements = " h-8 hover:bg-cyan-100 hover:outline-cyan-700 rounded-sm hover:border";

const NavbarCustom = () => {
    return (
        <Container sm className="mt-1 font-cormorant font-extrabold">
            <Navbar disableShadow="true" isCompact="false" isBordered="true" variant={"floating"} borderWeight={"normal"}
                className="rounded-sm"
            >

                <Navbar.Brand className=" ">
                    <Image src="/chitra.png"
                        width={50}
                        height={50}
                    />
                    <Text h1
                        weight="semibold"
                        css={{
                            textGradient: "45deg, $blue600 -20%, $pink600 50%",
                        }}

                    >
                        CHITRA
                    </Text>
                </Navbar.Brand>



                <Navbar.Content className=""  >


                    <Navbar.Link
                        href="/Marketplace" className={navbarElements}>
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
                {/* <Button shadow bordered color="warning" auto size={"sm"}
                className="rounded-sm"
                >
                    Sign Up
                </Button>

                <Button shadow bordered color="success" auto size={"sm"} 
                className="rounded-sm"
                >
                    Login
                </Button> */}

            </Navbar>
        </Container>

    );
}
export default NavbarCustom;