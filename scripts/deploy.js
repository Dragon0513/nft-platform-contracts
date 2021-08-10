const pinata = require('@pinata/sdk')(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function main() {
    // OpenSea proxy registry addresses for rinkeby and mainnet.
    // const proxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317';

    const name = 'OpenSea Creatures for RFOX';

    const res = await pinata.pinJSONToIPFS({
        name,
        "description": "Friendly monsters of the Open sea.",
        "external_link": "https://github.com/ProjectOpenSea/opensea-creatures/",
        "image": "https://example.com/image.png",
    }, {
        pinataMetadata: {
            name: 'Collection',
            keyvalues: {
                // customKey: 'customValue',
                // customKey2: 'customValue2'
            }
        },
        pinataOptions: {
            cidVersion: 0
        }
    });
    console.log(res);

    const RFOXCollection = await ethers.getContractFactory("RFOXCollection");
    const contract = await RFOXCollection.deploy(`ipfs://${res.IpfsHash}`, name, 'TST');

    console.log('Deployed to', contract.address, 'in transaction', contract.deployTransaction.hash);
}

main();
