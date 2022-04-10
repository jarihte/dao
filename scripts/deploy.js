const hre = require("hardhat");
const cb = require("../tools/createBytes");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  
  
  const Dao = await hre.ethers.getContractFactory("Ballot");
  const pitch = cb.createBytes("Time for an important decision");
  const proposal1 = cb.createBytes("option 1");
  const proposal2 = cb.createBytes("option 2");
  const proposal3 = cb.createBytes("the answer C")
  const dao = await Dao.deploy("0x0CCD818D400D97760C1102EB99BE664F4cD0B26F", pitch, [proposal1, proposal2, proposal3]);

  await dao.deployed();

  console.log("DAO deployed to:", dao.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
