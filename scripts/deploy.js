const pinata = require('@pinata/sdk')(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function main() {
    // OpenSea proxy registry addresses for rinkeby and mainnet.
    const proxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317';

    const name = 'New collection for RFOX';

    const res = await pinata.pinJSONToIPFS({
        name,
        "description": "Friendly monsters of the Open sea.",
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
            cidVersion: 0
        }
    });
    console.log(res);

    const RFOXCollection = await ethers.getContractFactory("RFOXCollection");
    const contract = await RFOXCollection.deploy(`ipfs://${res.IpfsHash}`, name, 'TST', proxyRegistryAddress);

    console.log('Deployed to', contract.address, 'in transaction', contract.deployTransaction.hash);
}

main();
