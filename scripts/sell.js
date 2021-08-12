const MnemonicWalletSubprovider = require("@0x/subproviders").MnemonicWalletSubprovider;
const RPCSubprovider = require("web3-provider-engine/subproviders/rpc");
const Web3ProviderEngine = require("web3-provider-engine");
const opensea = require("opensea-js");
const OpenSeaPort = opensea.OpenSeaPort;
const Network = opensea.Network;

const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS;
const OWNER_ADDRESS = process.env.OWNER_ADDRESS;

// This example provider won't let you make transactions, only read-only calls:
// const provider = new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/' + NODE_API_KEY)
const provider = new Web3ProviderEngine();
provider.addProvider(new MnemonicWalletSubprovider({
  mnemonic: process.env.MNEMONIC,
  baseDerivationPath: `44'/60'/0'/0`,
}));
provider.addProvider(new RPCSubprovider({
  rpcUrl: "https://rinkeby.infura.io/v3/" + process.env.INFURA_KEY
}));
provider.start();

const seaport = new OpenSeaPort(provider,
  {
    networkName: Network.Rinkeby
    // apiKey: API_KEY,
  },
  arg => console.log(arg)
)

async function main() {
  const a = await seaport.api.getBundles({ owner: OWNER_ADDRESS });
  console.log(a)

  const asset = await seaport.api.getAsset({
    tokenAddress: NFT_CONTRACT_ADDRESS,
    tokenId: 1,
  })
  console.log(asset)

  // Example: simple fixed-price sale of an item owned by a user.
  console.log("Auctioning an item for a fixed price...");
  const fixedPriceSellOrder = await seaport.createSellOrder({
    asset: {
      tokenId: "1",
      tokenAddress: NFT_CONTRACT_ADDRESS,
    },
    startAmount: 0.05,
    expirationTime: 0,
    accountAddress: OWNER_ADDRESS,
  });
  console.log(
    `Successfully created a fixed-price sell order! ${fixedPriceSellOrder.asset.openseaLink}\n`
  );

}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
