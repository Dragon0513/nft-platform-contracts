const RFOXCollection = artifacts.require("./RFOXCollection.sol");

module.exports = async (deployer, network, addresses) => {
    // OpenSea proxy registry addresses for rinkeby and mainnet.
    const proxyRegistryAddress = network === 'rinkeby' ?
        "0xf57b2c51ded3a29e6891aba85459d600256cf317":
        "0xa5409ec958c83c3f309868babaca7c86dcb077c1";

    // await deployer.deploy(RFOXCollection, proxyRegistryAddress, { gas: 5000000 });
    await deployer.deploy(RFOXCollection, "ipfs://QmYSrTKu4GQoKSH17wn5SsCVEaEQMwxDRsTfwrzD43HWRD", 'some collection', 'col', { gas: 5000000 });
};
