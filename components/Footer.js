import Link from "next/link";

const Footer = () => {
    return (
        <div className="w-full flex md:justify-center justify-between items-center flex-col p-2 ">
            <div className="w-full flex sm:flex-row flex-col justify-between items-center my-4">
                <div className="flex flex-[0.5] justify-center items-center">
                    <img src={"/chitra.png"} alt="EthxChain Logo" className="w-40" />
                </div>
                <div className="flex flex-1 justify-evenly items-center flex-wrap sm:mt-0 mt-2 w-full">
                    <Link href="/" >
                        <a className="text-gray-800 uppercase text-[20px] text-center mx-2 cursor-pointer">marketplace </a>
                    </Link>
                    <Link href="/" >
                        <a className="text-gray-800 uppercase text-[20px] text-center mx-2 cursor-pointer">my nft </a>
                    </Link>
                    <Link href="/" >
                        <a className="text-gray-800 uppercase text-[20px] text-center mx-2 cursor-pointer">mint nft </a>
                    </Link>

                    {/* <p className="text-gray-800 uppercase text-[20px] text-center mx-2 cursor-pointer">Collections</p> */}
                </div>
            </div>
            <div className="flex justify-center items-center flex-col ">
                <p className="text-gray-900 uppercase text-sm text-center">Built by Ethix Jambhulkar</p>
                <Link href="https://www.ethix.live" target="_blank" rel="noreferrer" >
                    <a className="text-gray-900 text-sm text-center"> Ethix.live</a>
                </Link>
            </div>
            <div className="sm:w-[90%] w-full h-[0.25px] bg-gray-400 mt-2" />
            <div className="sm:w-[90%] w-full flex justify-between items-center mt-3">
                <p className="text-gray-900 text-sm text-center">@ImagicArt 2022</p>
                <p className="text-gray-900 text-sm text-center">All Rights Reserved</p>
            </div>
        </div>
    );
}

export default Footer;