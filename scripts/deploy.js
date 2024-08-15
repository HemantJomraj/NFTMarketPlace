// Importing ethers from Hardhat and fs for file system operations
const { ethers } = require("hardhat");
const hre = require("hardhat");
const fs = require("fs");

async function main() {
  // Get the deployer's wallet address and balance
  const [deployer] = await ethers.getSigners();
  const balance = await deployer.getBalance();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", ethers.utils.formatEther(balance.toString()));

  // Specify the ERC20 token address that will be used for payments
  const ERC20TokenAddress = "0xYourERC20TokenAddressHere"; // Replace with your ERC20 token address

  // Fetching the contract factory for the NFTMarketplace contract
  const Marketplace = await hre.ethers.getContractFactory("NFTMarketplace");

  // Deploying the NFTMarketplace contract with the ERC20 token address
  const marketplace = await Marketplace.deploy(ERC20TokenAddress);

  // Waiting for the deployment to complete
  await marketplace.deployed();

  console.log("NFTMarketplace deployed to:", marketplace.address);

  // Preparing the data to be written to the JSON file
  // This includes the deployed contract's address and its ABI
  const data = {
    address: marketplace.address,
    abi: JSON.parse(marketplace.interface.format('json'))
  }

  // This writes the ABI and address to the Marketplace.json file
  fs.writeFileSync('./src/Marketplace.json', JSON.stringify(data));

  console.log("Marketplace.json has been saved!");
}

// Execute the main function and handle any errors that occur
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
