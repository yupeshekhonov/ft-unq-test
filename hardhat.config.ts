import dotenv from 'dotenv'
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

dotenv.config()
const { RPC_OPAL, PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    hardhat: {},
    opal: {
      url: RPC_OPAL,
      accounts: [`${PRIVATE_KEY}`]
    },
  }
};

export default config;