const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace with ERC20 Payments", function () {
    let NFTMarketplace, marketplace, ERC20Token, erc20, owner, buyer, seller;

    beforeEach(async function () {
        // Get signers
        [owner, buyer, seller] = await ethers.getSigners();

        // Deploy ERC20 Token
        ERC20Token = await ethers.getContractFactory("ERC20Token");
        erc20 = await ERC20Token.deploy("Test Token", "TTK", 18, ethers.utils.parseEther("1000"));
        await erc20.deployed();

        // Transfer ERC20 tokens to the buyer
        await erc20.transfer(buyer.address, ethers.utils.parseEther("100")); // Transfer 100 tokens to buyer

        // Deploy NFTMarketplace with ERC20 token address
        NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
        marketplace = await NFTMarketplace.deploy(erc20.address);
        await marketplace.deployed();
    });

    it("Should allow purchasing an NFT with ERC20 tokens", async function () {
        // Seller mints an NFT and lists it for sale
        const mintPrice = ethers.utils.parseEther("1");
        await marketplace.connect(seller).createToken("ipfs://tokenUri", mintPrice);

        // Buyer approves the marketplace to spend their ERC20 tokens
        await erc20.connect(buyer).approve(marketplace.address, mintPrice);

        // Buyer purchases the NFT
        await marketplace.connect(buyer).executeSale(1);

        // Check ownership of the NFT
        const newOwner = await marketplace.ownerOf(1);
        expect(newOwner).to.equal(buyer.address);

        // Check ERC20 token balance of the seller
        const sellerBalance = await erc20.balanceOf(seller.address);
        expect(sellerBalance.toString()).to.equal(mintPrice.toString());
    });

    it("Should fail if the buyer has insufficient ERC20 tokens", async function () {
        // Seller mints an NFT and lists it for sale
        const mintPrice = ethers.utils.parseEther("1");
        await marketplace.connect(seller).createToken("ipfs://tokenUri", mintPrice);

        // Buyer approves the marketplace but with insufficient balance
        await erc20.connect(buyer).approve(marketplace.address, mintPrice);
        await erc20.connect(buyer).transfer(seller.address, await erc20.balanceOf(buyer.address)); // Empty buyer's balance

        // Try purchasing the NFT and expect failure
        await expect(
            marketplace.connect(buyer).executeSale(1)
        ).to.be.revertedWith("ERC20: transfer amount exceeds balance");
    });

    it("Should fail if the buyer has not approved enough tokens", async function () {
        // Seller mints an NFT and lists it for sale
        const mintPrice = ethers.utils.parseEther("1");
        await marketplace.connect(seller).createToken("ipfs://tokenUri", mintPrice);
    
        // Buyer approves only a portion of the required amount
        await erc20.connect(buyer).approve(marketplace.address, ethers.utils.parseEther("0.5"));
    
        // Try purchasing the NFT and expect failure
        await expect(
            marketplace.connect(buyer).executeSale(1)
        ).to.be.revertedWith("Please approve the required amount of tokens for the purchase");
    });
    
});
