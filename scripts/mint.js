const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NUM_CREATURES = 5;

const pinata = require('@pinata/sdk')(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function main() {
  const RFOXCollection = await ethers.getContractFactory('RFOXCollection');
  const contract = await RFOXCollection.attach(process.env.NFT_CONTRACT_ADDRESS);

  // Creatures issued directly to the owner.
  for (var i = 0; i < NUM_CREATURES; i++) {
    console.log("minting ");

    const res = await pinata.pinJSONToIPFS({
      name: `Chainlink Elf #${i}`,
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
    console.log(res);

    const result = await contract.safeMint(OWNER_ADDRESS, res.IpfsHash);
    console.log("Minted creature. Transaction: " + result.transactionHash);
  }
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
