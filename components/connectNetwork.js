import { bscChain, polyChain, goerliChain, hardhatChain } from "./networkChange";
import detectEthereumProvider from "@metamask/detect-provider";
import React, { useEffect } from "react";
import { Dropdown } from "@nextui-org/react";

export default function Changenetwork() {
    // const [selected, setSelected] = React.useState(new Set(["Set Network"]));
    let initNetwork = "Select Your Network";
    
    async function setRpcUrl() {

        const HARDHAT = "0x539";
        const POLYGON = "0x13881";
        const GOERLI = "0x5";
        const BSC = "0x61";

        const metamask = await detectEthereumProvider();
        console.log("metamask ::::::", metamask)
        try {


            if (metamask.chainId == HARDHAT) {
                initNetwork = "Hardhat";
            }

            else if (metamask.chainId == BSC) {
                initNetwork = "BSC TestNet";
            }

            else if (metamask.chainId == POLYGON) {
                initNetwork = "Polygon TestNet";
            }

            else if (metamask.chainId == GOERLI) {
                initNetwork = "Goerli";
            }

            else {
                console.log("User is using a Different Chain that is not Added Yet");
            }
            // setrpcUrl(RPC);
            // console.log("Initialized the RPC URL to ===>", rpcUrl, "<<<=====");
            // setPrivateKey();
        }
        catch (error) {
            console.log("Encountered Error while setting the RPC url for the marketplace::::=> ", error, "<<<=====");
        }

    }

    const [selected, setSelected] = React.useState(new Set([initNetwork]));

    const selectedValue = React.useMemo(
        () => Array.from(selected).join(", ").replaceAll("_", " "),
        [selected]
    );


    async function changeChain() {
        var bsc = "BSC Testnet";
        const polygon = "Polygon Testnet";
        const goerli = "Goerli";
        const hardhat = "Hardhat Node";
        console.log("Inside changeChain")

        if (bsc == selectedValue) {
            bscChain();
            // console.log("Inside BSC testnwet")
        }

        else if (polygon == selectedValue)
            polyChain();

        else if (goerli == selectedValue)
            goerliChain();

        else if (hardhat == selectedValue)
            hardhatChain();


    }

    useEffect(() => {
        changeChain();
        console.log("Selected is", selected);
        
    }, [selected]);

    return (
        <Dropdown>
            <Dropdown.Button flat color="secondary" className="">
                {selectedValue}
            </Dropdown.Button>
            <Dropdown.Menu
                aria-label="Single selection actions"
                color="secondary"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selected}
                onSelectionChange={setSelected}
                textValue={selected}
                className=""
            >
                <Dropdown.Item textValue="BSC Testnet" key="BSC Testnet">BSC Testnet</Dropdown.Item>
                <Dropdown.Item key="Polygon Testnet">Polygon Testnet</Dropdown.Item>
                <Dropdown.Item key="Goerli">Goerli</Dropdown.Item>
                <Dropdown.Item key="Hardhat Node">Hardhat Node</Dropdown.Item>

            </Dropdown.Menu>
        </Dropdown>
    );
}
