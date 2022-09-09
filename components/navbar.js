import { Navbar, Button, Link, Text, Image, Card, Radio, Container, Row, Col } from "@nextui-org/react";

const NavbarCustom = () => {
    return (
        <Container sm className="mt-1">
            <Navbar isCompact="true" isBordered className="">

                <Navbar.Brand className="pr-4">
                    <Image src="/chitra.png"
                        width={40}
                        height={40}
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

                <Navbar.Content hideIn={"sm"} >

                    <Navbar.Link href="/Marketplace">
                        Marketplace
                    </Navbar.Link>

                    <Navbar.Link href="/Collections">
                        Collections
                    </Navbar.Link>
                    <Navbar.Link href="/myNFT">
                        My NFT's
                    </Navbar.Link>

                </Navbar.Content>

                <Button bordered color="secondary" auto size={"sm"}>
                    Sign Up
                </Button>

                <Button bordered color="success" auto size={"sm"} >
                    Login
                </Button>

            </Navbar>
        </Container>

    );
}
export default NavbarCustom;