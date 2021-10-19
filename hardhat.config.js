require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');
require('solidity-coverage');

const networks = process.env.INFURA_KEY && process.env.OWNER_ADDRESS && process.env.MNEMONIC ?
  {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/' + process.env.INFURA_KEY,
      chainId: 4,
      from: process.env.OWNER_ADDRESS,
      gas: 'auto',
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

const defaultNetwork = process.env.INFURA_KEY && process.env.OWNER_ADDRESS && process.env.MNEMONIC ?
  "rinkeby" :
  "hardhat"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork,
  networks,
  solidity: "0.8.0",
  etherscan,
};
