// scripts/deploy.ts

import { ethers } from "hardhat";
import {
  ImmutableERC20MinterBurnerPermit,
  ImmutableERC20MinterBurnerPermit__factory,
} from "../typechain-types";

async function main() {
  // Define transaction overrides if necessary
  const transactionOverrides = {
    maxFeePerGas: 100000000000,
    maxPriorityFeePerGas: 100000000000,
    gasLimit: 10000000,
  };

  // Get the deployer's signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  //   console.log("Account balance:", (await deployer.getBalance()).toString());

  // Create a contract factory for ImmutableERC20MinterBurnerPermit
  const factory: ImmutableERC20MinterBurnerPermit__factory =
    await ethers.getContractFactory("ImmutableERC20MinterBurnerPermit");

  // Define constructor arguments
  const roleAdmin = process.env.ROLE_ADMIN as string;
  const minterAdmin = process.env.MINTER_ADMIN as string;
  const hubOwner = process.env.HUB_OWNER as string;
  const name = process.env.TOKEN_NAME as string;
  const symbol = process.env.TOKEN_SYMBOL as string;
  const maxTokenSupply = ethers.parseUnits(
    process.env.MAX_TOKEN_SUPPLY as string,
    18
  );

  // Deploy the contract
  const contract: ImmutableERC20MinterBurnerPermit = await factory
    .connect(deployer)
    .deploy(
      roleAdmin,
      minterAdmin,
      hubOwner,
      name,
      symbol,
      maxTokenSupply,
      transactionOverrides
    );

  console.log("Deploying ImmutableERC20MinterBurnerPermit...");

  // Wait for the deployment to be mined
  const deployedContract = await contract.waitForDeployment();
  console.log("Contract deployed to:", await deployedContract.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
