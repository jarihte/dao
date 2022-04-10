require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");

// Go to https://www.alchemyapi.io, sign up, create
// a new App in its dashboard, and replace "KEY" with its key
const ALCHEMY_API_KEY_ROPSTEN = "<inser_your_key>";
const ALCHEMY_API_KEY_KOVAN = "<inser_your_key>";
const INFURA_API_KEY = "<inser_your_key>";

// Replace this private key with your Ropsten account private key
// To export your private key from Metamask, open Metamask and
// go to Account Details > Export Private Key
// Be aware of NEVER putting real Ether into testing accounts
const WALLET_PRIVATE_KEY_DEPLOYER = "<inser_your_key>";
const WALLET_PRIVATE_KEY_ADDR1 = "<inser_your_key>";
const WALLET_PRIVATE_KEY_ADDR2 = "<inser_your_key>";
const WALLET_PRIVATE_KEY_ADDR3 = "<inser_your_key>";
const WALLET_PRIVATE_KEY_ADDR4 = "<inser_your_key>";
const WALLET_PRIVATE_KEY_ADDR5 = "<inser_your_key>";
const WALLET_PRIVATE_KEY_ADDR6 = "<inser_your_key>";


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
 module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.3",
      },
    ],
  },   
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {
      /* Workaround for a Metamask configuration issue */
      chainId: 1337
    },
    testnet_ropsten_alchemy: {
      url: `https://eth-ropsten.alchemyapi.io/v2/${ALCHEMY_API_KEY_ROPSTEN}`,
      accounts: [`${WALLET_PRIVATE_KEY_DEPLOYER}`,`${WALLET_PRIVATE_KEY_ADDR1}`,`${WALLET_PRIVATE_KEY_ADDR2}`,`${WALLET_PRIVATE_KEY_ADDR3}`,`${WALLET_PRIVATE_KEY_ADDR4}`,`${WALLET_PRIVATE_KEY_ADDR5}`,`${WALLET_PRIVATE_KEY_ADDR6}`],
      timeout: 60000
    },
    testnet_kovan_alchemy: {
      url: `https://eth-kovan.alchemyapi.io/v2/${ALCHEMY_API_KEY_KOVAN}`,
      accounts: [`${WALLET_PRIVATE_KEY_DEPLOYER}`,`${WALLET_PRIVATE_KEY_ADDR1}`,`${WALLET_PRIVATE_KEY_ADDR2}`,`${WALLET_PRIVATE_KEY_ADDR3}`,`${WALLET_PRIVATE_KEY_ADDR4}`,`${WALLET_PRIVATE_KEY_ADDR5}`,`${WALLET_PRIVATE_KEY_ADDR6}`],
      timeout: 60000
    },
    testnet_kovan_infura: {
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${WALLET_PRIVATE_KEY_DEPLOYER}`,`${WALLET_PRIVATE_KEY_ADDR1}`,`${WALLET_PRIVATE_KEY_ADDR2}`,`${WALLET_PRIVATE_KEY_ADDR3}`,`${WALLET_PRIVATE_KEY_ADDR4}`,`${WALLET_PRIVATE_KEY_ADDR5}`,`${WALLET_PRIVATE_KEY_ADDR6}`],
      timeout: 60000
    }
  }
};
