# DAO PoC


## Prerequisites

1. Node.js installed on your local machine:
```properties
sudo apt update
sudo apt install curl git
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install nodejs
```

2. MetaMask Chrome extension installed in your browser:
[Download & Install](https://metamask.io/download/)


## Install and Configure the Ethereum Development Environment

1. Initialize the Development Environment with Hardhat:
```properties
npm install --save-dev hardhat
npx hardhat
npm install --save-dev "hardhat@^2.9.2"
```

2. Install tools for Hardhat:
```properties
npm install --save-dev @nomiclabs/hardhat-ethers ethers @nomiclabs/hardhat-waffle ethereum-waffle chai
npm audit fix
```


## Test the contracts

1. Run the unit tests with Hardhat and Chai:
```properties
npx hardhat test
```


## Compile and deploy

0. Launch the local node in a dedicated terminal (**for local deploiement only**):
```properties
npx hardhat node
```

1. Compile the contracts:
```properties
npx hardhat compile
```

2. Deploy the contracts:
   - locally (**for simulating the deploiement only**):
    ```properties
    npx hardhat run scripts/deploy.js
    ```
   - locally:
    ```properties
    npx hardhat run scripts/deploy.js --network localhost
    ```
   - on the testnet (ropsten):
    ```properties
    npx hardhat run scripts/deploy.js --network testnet_ropsten
    ```
   - on the testnet (kovan):
    ```properties
    npx hardhat run scripts/deploy.js --network testnet_kovan
    ```
    - on the mainnet:
    ```properties
    npx hardhat run scripts/deploy.js --network mainnet
    ```