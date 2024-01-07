import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter"

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  gasReporter: {
    enabled: false //Enable to get gas usage report when testing with `npx hardhat test`
  }
};

export default config;
