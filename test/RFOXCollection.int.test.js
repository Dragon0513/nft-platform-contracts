require('@ethersproject/bignumber');
require('isomorphic-fetch');
const { expect } = require('chai');
const pinata = require('@pinata/sdk')(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

function sleep(ms) {
  return new Promise((resolve) => {
      setTimeout(resolve, ms);
  });
}

describe("RFOXCollection Contract", (done) => {
  it('should deploy a new contract & mint a new asset', async () => {
    // Arrange
    const proxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317';

    const name = '[int] This is a test for RFLabs - ' + Date.now();

    const collection = await pinata.pinJSONToIPFS({
        name,
        "description": "[int] Friendly monsters of the Open sea.",
        "external_link": "https://github.com/ProjectOpenSea/opensea-creatures/",
        "image": "ipfs://QmQPt2MWQFrmy6HN8GwQXYCTqQexnb51LBsRypM8YEUGc1",
        "seller_fee_basis_points": 100,
        "fee_recipient": process.env.OWNER_ADDRESS,
        // custom 
        "banner_image": "ipfs://QmQPt2MWQFrmy6HN8GwQXYCTqQexnb51LBsRypM8YEUGc1",
        "wiki_url": "https://github.com/wiki-url-test-ProjectOpenSea/opensea-creatures/",
    }, {
        pinataMetadata: {
            name: 'Collection',
            keyvalues: {
            }
        },
        pinataOptions: {
            cidVersion: 1
        }
    });

    const RFOXCollection = await ethers.getContractFactory("RFOXCollection");
    const contractURI = `ipfs://${collection.IpfsHash}`;
    const contractName = 'RFOX:' + name;
    const symbol = '';

    const asset = await pinata.pinJSONToIPFS({
      name: '[int] Chainlink Elf - ' + Date.now(),
      description: "Inspiring, Based, Mythical, Oracle loving creature. Leading the new world and helping teach about superior digital agreements. Also is good with a bow!",
      image: "https://ipfs.io/ipfs/QmTgqnhFBMkfT9s8PHKcdXBn1f5bG3Q5hmBaR4U6hoTvb1?filename=Chainlink_Elf.png",
      attributes: [
        {
          trait_type: "Strength",
          value: 59
        },
        {
          trait_type: "Dexterity",
          value: 29
        },
      ]
    }, {
      pinataMetadata: {
        name: 'MyCustomName',
        keyvalues: {
        }
      },
      pinataOptions: {
        cidVersion: 1
      }
    });

    // Act
    const contract = await RFOXCollection.deploy(contractURI, contractName, symbol, proxyRegistryAddress);
    await contract.deployed();
    console.log('Deployed to', contract.address, 'in transaction', contract.deployTransaction.hash);

    const result = await contract.safeMint(process.env.OWNER_ADDRESS, asset.IpfsHash);
    console.log("Minted creature. Transaction: " + result.hash);

    // Assert
    const RFOXCollection_ = await ethers.getContractFactory('RFOXCollection');
    const contract_ = await RFOXCollection_.attach(contract.address);

    expect(await contract_.contractURI()).to.equal(contractURI);
    expect(await contract_.name()).to.equal(contractName);
    expect(await contract_.symbol()).to.equal(symbol);
  }).timeout(100000);
});
