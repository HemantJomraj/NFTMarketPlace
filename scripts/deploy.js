// Importing ethers from Hardhat and fs for file system operations
const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Get the deployer's wallet address and balance
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();

  // Fetching the contract factory for the NFTMarketplace contract
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");

  // Deploying the NFTMarketplace contract
  const marketplace = await Marketplace.deploy();

  // Waiting for the deployment to complete
  await marketplace.deployed();

  // Preparing the data to be written to the JSON file
  // This includes the deployed contract's address and its ABI
  const data = {
    address: marketplace.address,
    abi: JSON.parse(marketplace.interface.format('json'))
  }

  // This writes the ABI and address to the Marketplace.json file
  fs.writeFileSync('./src/Marketplace.json', JSON.stringify(data));
}

// Execute the main function and handle any errors that occur
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
