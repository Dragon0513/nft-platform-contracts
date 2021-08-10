require('@nomiclabs/hardhat-ethers')

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/' + process.env.INFURA_KEY,
      chainId: 4,
      from: process.env.OWNER_ADDRESS,
      gas: 5000000,
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
    }
  },
  solidity: "0.8.0",
};
