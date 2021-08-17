const pinata = require('@pinata/sdk')(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function main() {
    // OpenSea proxy registry addresses for rinkeby and mainnet.
    const proxyRegistryAddress = '0xf57b2c51ded3a29e6891aba85459d600256cf317';

    const name = 'This is a test for RFLabs';

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
    const contractURI = `ipfs://${res.IpfsHash}`;
    const symbol = 'TST';
    const contract = await RFOXCollection.deploy(contractURI, name, symbol, proxyRegistryAddress);

    console.log('Deployed to', contract.address, 'in transaction', contract.deployTransaction.hash);

    {
        console.log('Waiting to check contract deployment..');
        await sleep(10000);

        const RFOXCollection_ = await ethers.getContractFactory('RFOXCollection');
        const contract_ = await RFOXCollection_.attach(contract.address);

        console.log('Check contract deployment',
            await contract_.contractURI(),
            await contract_.name(),
            await contract_.symbol()
        );
    }

    console.log('Verify smart contract in Etherscan ..')

    await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [contractURI, name, symbol, proxyRegistryAddress],
    });

}

main()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
