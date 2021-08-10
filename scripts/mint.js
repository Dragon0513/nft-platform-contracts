const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3");
const MNEMONIC = process.env.MNEMONIC;
const NODE_API_KEY = process.env.INFURA_KEY;
const FACTORY_CONTRACT_ADDRESS = process.env.FACTORY_CONTRACT_ADDRESS;
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;
const NETWORK = process.env.NETWORK;
const NUM_CREATURES = 12;

const pinata = require('@pinata/sdk')(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

if (!MNEMONIC || !NODE_API_KEY || !OWNER_ADDRESS || !NETWORK) {
  console.error(
    "Please set a mnemonic, Alchemy/Infura key, owner, network, and contract address."
  );
  return;
}

// {
//     "description": "Friendly monsters of the Open sea.",
//     "external_link": "https://github.com/ProjectOpenSea/opensea-creatures/",
//     "image": "https://example.com/image.png",
//     "name": "OpenSea Creatures for RFOX"
// }

const NFT_ABI = [
  {
    constant: false,
    inputs: [
      {
        name: "_to",
        type: "address",
      },
      {
        name: "_tokenURI",
        type: "string",
      },
    ],
    name: "safeMint",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const network = NETWORK === "mainnet" || NETWORK === "live" ? "mainnet" : "rinkeby";
  const provider = new HDWalletProvider(MNEMONIC, "https://" + network + ".infura.io/v3/" + NODE_API_KEY);
  const web3Instance = new web3(provider);

  const nftContract = new web3Instance.eth.Contract(
    NFT_ABI,
    NFT_CONTRACT_ADDRESS,
    { gasLimit: "1000000" }
  );
  console.log(nftContract);

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
          customKey: 'customValue',
          customKey2: 'customValue2'
        }
      },
      pinataOptions: {
        cidVersion: 0
      }
    });
    console.log(res);

    const result = await nftContract.methods
      .safeMint(OWNER_ADDRESS, res.IpfsHash)
      .send({ from: OWNER_ADDRESS });
    console.log("Minted creature. Transaction: " + result.transactionHash);
  }
}

main();
