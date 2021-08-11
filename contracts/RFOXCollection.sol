// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract OwnableDelegateProxy {}

contract ProxyRegistry {
    mapping(address => OwnableDelegateProxy) public proxies;
}

contract RFOXCollection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {

    string private _contractURI;

    address private _proxyRegistryAddress;
 
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor(string memory contractURI_, string memory name_, string memory symbol_, address proxyRegistryAddress_) ERC721(name_, symbol_) {
        _contractURI = contractURI_;
        _proxyRegistryAddress = proxyRegistryAddress_;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function safeMint(address _to, string memory _tokenURI) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        _tokenIdCounter.increment();
    }
 
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /**
     * Override isApprovedForAll to whitelist user's OpenSea proxy accounts to enable gas-less listings.
     */
    function isApprovedForAll(address owner, address operator) override public view returns (bool) {
        // Whitelist OpenSea proxy contract for easy trading.
        ProxyRegistry proxyRegistry = ProxyRegistry(_proxyRegistryAddress);
        if (address(proxyRegistry.proxies(owner)) == operator) {
            return true;
        }

        return super.isApprovedForAll(owner, operator);
    }

}
