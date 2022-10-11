import { bscChain, polyChain, goerliChain, hardhatChain } from "./networkChange";
import React, { useEffect } from "react";
import { Dropdown } from "@nextui-org/react";

export default function Changenetwork() {
    const [selected, setSelected] = React.useState(new Set (["Set Network"]));

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

        if (selectedValue ==="BSC Testnet" ) {
            bscChain();
            console.log("Inside BSC testnwet")
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
        // console.log("Selected value is '", selectedValue,"'");
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
