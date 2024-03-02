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
    }
  }
};

// const config: HardhatUserConfig = {
//   solidity: {
//     version: "0.5.0", // Adjust this to an appropriate version
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       },
//       evmVersion: "byzantium" // Adjust this to match your GoQuorum's EVM capabilities
//     }
//   },
//   gasReporter: {
//     enabled: false //Enable to get gas usage report when testing with `npx hardhat test`
//   },
//   networks: {
//     alastria: {
//       url: process.env.ALASTRIA_RPC_URL,
//       accounts: [deployerPrivateKey]
//     }
//   }
// };

export default config;
