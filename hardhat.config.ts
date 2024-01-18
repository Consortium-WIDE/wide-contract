import * as dotenv from "dotenv";
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"

const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
if (!deployerPrivateKey) {
  throw new Error("DEPLOYER_PRIVATE_KEY environment variable is not set.");
}

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  gasReporter: {
    enabled: false //Enable to get gas usage report when testing with `npx hardhat test`
  },
  networks: {
    optimismSepolia: {
      url: process.env.OPTIMISM_SEPOLIA_RPC_URL,
      accounts: [deployerPrivateKey],
    },
  }
};

export default config;
