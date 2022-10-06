// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract mintNft is ERC721URIStorage, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter public _tokenId;
    address marketContractAddress;
    uint public mintingFees = 0.1 ether;

    constructor(address aMarketContractAddress) ERC721("Imagica", "IMGCA") {
        marketContractAddress = aMarketContractAddress;
    }

    event minted(uint indexed tokenId);

    function mintNftToSell(string memory _tokenURI)
        public
        nonReentrant
        returns (uint tokenId)
    {
        _tokenId.increment();
        uint latestTokenId = _tokenId.current();
        _safeMint(msg.sender, latestTokenId);
        _setTokenURI(latestTokenId, _tokenURI);
        setApprovalForAll(marketContractAddress, true);
        emit minted(latestTokenId);
        return latestTokenId;
    }

    function mintNftToKeep(string memory tokenURI)
        public
        payable
        nonReentrant
        returns (uint tokenId)
    {
        require(
            msg.value == mintingFees,
            "Ensure to Pay the Exact Minting Fees"
        );
        _tokenId.increment();
        uint latestTokenId = _tokenId.current();
        _safeMint(msg.sender, latestTokenId);
        _setTokenURI(latestTokenId, tokenURI);
        setApprovalForAll(marketContractAddress, true);
        emit minted(latestTokenId);
        return latestTokenId;
    }
}
