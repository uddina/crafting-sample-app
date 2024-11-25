// scripts/deployERC721.ts

import { ethers } from "hardhat";
import {
  ClashOfCatsERC721,
  ClashOfCatsERC721__factory,
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
    ROLE_ADMIN,
    MINTER_ADMIN,
    HUB_OWNER,
    OPERATOR_ALLOWLIST,
    ROYALTY_RECEIVER,
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOKEN_BASE_URI,
    TOKEN_CONTRACT_URI,
    ROYALTY_FEE,
  } = process.env;

  if (
    !ROLE_ADMIN ||
    !MINTER_ADMIN ||
    !HUB_OWNER ||
    !OPERATOR_ALLOWLIST ||
    !ROYALTY_RECEIVER ||
    !TOKEN_NAME ||
    !TOKEN_SYMBOL ||
    !TOKEN_BASE_URI ||
    !TOKEN_CONTRACT_URI ||
    !ROYALTY_FEE
  ) {
    throw new Error("One or more environment variables are missing.");
  }

  // Convert royalty fee to uint96
  const royaltyFee = parseInt(ROYALTY_FEE);
  if (royaltyFee > 10_000) {
    throw new Error("ROYALTY_FEE cannot exceed 10,000 (100%)");
  }

  // Create a contract factory for ClashOfCatsERC721
  const factory: ClashOfCatsERC721__factory = await ethers.getContractFactory(
    "ClashOfCatsERC721",
    deployer
  );

  console.log("ROLE_ADMIN: ", ROLE_ADMIN);
  console.log("TOKEN_NAME: ", TOKEN_NAME);
  console.log("TOKEN_SYMBOL: ", TOKEN_SYMBOL);
  console.log("TOKEN_BASE_URI: ", TOKEN_BASE_URI);
  console.log("TOKEN_CONTRACT_URI: ", TOKEN_CONTRACT_URI);
  console.log("OPERATOR_ALLOWLIST: ", OPERATOR_ALLOWLIST);
  console.log("ROYALTY_RECEIVER: ", ROYALTY_RECEIVER);
  console.log("royaltyFee: ", royaltyFee);
  console.log("transactionOverrides: ", transactionOverrides);

  // Deploy the contract with constructor arguments
  const contract: ClashOfCatsERC721 = await factory.deploy(
    ROLE_ADMIN,
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOKEN_BASE_URI,
    TOKEN_CONTRACT_URI,
    OPERATOR_ALLOWLIST,
    ROYALTY_RECEIVER,
    royaltyFee,
    transactionOverrides
  );

  console.log("Deploying ClashOfCatsERC721...");

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
