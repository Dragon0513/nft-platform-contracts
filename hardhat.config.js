require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('solidity-coverage');

const networks = process.env.INFURA_KEY && process.env.OWNER_ADDRESS && process.env.MNEMONIC ?
  {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/' + process.env.INFURA_KEY,
      chainId: 4,
      from: process.env.OWNER_ADDRESS,
      gas: 5000000,
      accounts: {
        mnemonic: process.env.MNEMONIC
      },
    }
  }
  :
  {};

const etherscan = process.env.ETHERSCAN_API_KEY ?
  {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
  :
  {};

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks,
  solidity: "0.8.0",
  etherscan,
};
