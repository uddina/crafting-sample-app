// scripts/deployGuardedMulticaller2.ts

import { ethers } from "hardhat";
import {
  GuardedMulticaller2,
  GuardedMulticaller2__factory,
} from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

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

  // Validate essential environment variables
  const {
    GUARD_MULTICALLER_OWNER,
    GUARD_MULTICALLER_NAME,
    GUARD_MULTICALLER_VERSION,
  } = process.env;

  if (
    !GUARD_MULTICALLER_OWNER ||
    !GUARD_MULTICALLER_NAME ||
    !GUARD_MULTICALLER_VERSION
  ) {
    throw new Error("One or more environment variables are missing.");
  }

  // Create a contract factory for GuardedMulticaller2
  const factory: GuardedMulticaller2__factory = await ethers.getContractFactory(
    "GuardedMulticaller2",
    deployer
  );

  console.log("Deploying GuardedMulticaller2...");

  // Deploy the contract with constructor arguments and transaction overrides
  const contract: GuardedMulticaller2 = await factory.deploy(
    GUARD_MULTICALLER_OWNER, // address _owner
    GUARD_MULTICALLER_NAME, // string memory _name
    GUARD_MULTICALLER_VERSION, // string memory _version
    transactionOverrides // Transaction Overrides
  );

  console.log("Deploying GuardedMulticaller2...");

  // Wait for the deployment to be mined
  const deployedContract = await contract.waitForDeployment();
  console.log(
    "GuardedMulticaller2 deployed to:",
    await deployedContract.getAddress()
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
