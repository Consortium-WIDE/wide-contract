import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const WideSignatureLogger = await ethers.getContractFactory("WideSignatureLogger");
  const contract = await WideSignatureLogger.deploy();

  console.log("WideSignatureLogger address:", await contract.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
