// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract imagicaMarket is IERC721Receiver, ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemId;
    Counters.Counter private _itemsSold;

    address payable owner;
    uint public listingFees = 0.005 ether;
    uint public mintingFees = 0.01 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct vaultItem {
        uint tokenId;
        uint itemId;
        address contractMintedFrom;
        address payable seller;
        address payable owner;
        uint price;
        bool sold;
        bool exists;
    }

    event nftMinted(
        uint indexed tokenId,
        uint indexed itemId,
        address indexed contractMintedFrom,
        address seller,
        address owner,
        uint price,
        bool sold,
        bool exists
    );

    mapping(uint => vaultItem) vaultItemAt;

    function createVaultItem(
        address contractMintedFrom,
        uint _price,
        uint tokenId
    ) public payable nonReentrant {
        require(_price > 0, "Price for the NFT must be greater than Zer0");
        require(
            msg.value == mintingFees,
            "Please pay the Exact Minting amount"
        );

        _itemId.increment();
        uint itemId = _itemId.current();

        vaultItemAt[itemId] = vaultItem(
            tokenId,
            itemId,
            contractMintedFrom,
            payable(msg.sender),
            payable(address(0)),
            _price,
            false,
            true
        );

        IERC721(contractMintedFrom).safeTransferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        emit nftMinted(
            tokenId,
            itemId,
            contractMintedFrom,
            payable(msg.sender),
            address(0),
            _price,
            false,
            true
        );
    }

    function ImagicabuyNft(address contractMintedFrom, uint itemId)
        public
        payable
        nonReentrant
    {
        require(
            vaultItemAt[itemId].exists == true,
            "The NFT you're Trying to Buy Dosen't Exist "
        );
        uint price = vaultItemAt[itemId].price;
        uint tokenId = vaultItemAt[itemId].tokenId;

        require(msg.value == price, "Insufficient Transaction Vaule");

        vaultItemAt[itemId].seller.transfer(price);
        IERC721(contractMintedFrom).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );

        vaultItemAt[itemId].owner = payable(msg.sender);
        vaultItemAt[itemId].sold = true;
        _itemsSold.increment();

        payable(vaultItemAt[itemId].owner).transfer(listingFees);
    }

    function getAvailableNFT() public view returns (vaultItem[] memory) {
        uint itemId = _itemId.current();
        require(itemId > 0, "No Nfts are Available at this State");
        uint currentIndex = 0;
        uint availableNftCount = itemId - _itemsSold.current();

        vaultItem[] memory AvailableNft = new vaultItem[](availableNftCount);

        for (uint i = 0; i < itemId; i++) {
            if (vaultItemAt[i + 1].owner == address(0)) {
                AvailableNft[currentIndex] = vaultItemAt[i + 1];
                currentIndex++;
            }
        }
        return AvailableNft;
    }

    function getMyNFt() public view returns (vaultItem[] memory) {
        uint itemId = _itemId.current();
        require(itemId > 0, "No Nfts are Available at this State");
        uint myNftIndex;
        uint myNftCount;
        for (uint i = 0; i < itemId; i++) {
            if (vaultItemAt[i + 1].seller == msg.sender) myNftCount++;
        }

        vaultItem[] memory myNft = new vaultItem[](myNftCount);

        for (uint i = 0; i < itemId; i++) {
            if (vaultItemAt[i + 1].seller == msg.sender) {
                myNft[myNftIndex] = vaultItemAt[i + 1];
                myNftIndex++;
            }
        }
        return myNft;
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) public override returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }
}
