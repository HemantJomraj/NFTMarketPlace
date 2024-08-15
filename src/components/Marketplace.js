import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import { ethers } from "ethers";

// Storing Data into Variables and Constants
export default function Marketplace() {
    const sampleData = [
        {
            "name": "NFT#1",
            "description": "RIVIAN",
            "website":"http://axieinfinity.io",
            "image":"https://gateway.pinata.cloud/ipfs/QmZgsSMVvRE9xxAZR1X1uYmMFvDAiFtPaR22L3HL2rqZsU",
            "price":"0.014 ETH",
            "currentlySelling":"True",
            "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "name": "NFT#2",
            "description": "TESLA",
            "website":"http://axieinfinity.io",
            "image":"https://gateway.pinata.cloud/ipfs/QmawBYRwwF1dkUb9mU6nEHWQLn5QYnkvAyh4sLW74PNoTu",
            "price":"0.01 ETH",
            "currentlySelling":"True",
            "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
        {
            "name": "NFT#3",
            "description": "LUCID MOTORS",
            "website":"http://axieinfinity.io",
            "image":"https://gateway.pinata.cloud/ipfs/QmYMuj1WWcZDHwidYzWH5a4Jw2Jgx2Fbp4mq8UAtVVcme6",
            "price":"0.01 ETH",
            "currentlySelling":"True",
            "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
        },
    ];
    const [data, updateData] = useState(sampleData);
    const [dataFetched, updateFetched] = useState(false);

    // Function to get All NFTs
    async function getAllNFTs() {
        try {
            if (typeof window.ethereum === 'undefined') {
                throw new Error("MetaMask is not installed");
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
            const transaction = await contract.getAllNFTs();

            const items = await Promise.all(transaction.map(async i => {
                let tokenURI = await contract.tokenURI(i.tokenId);
                console.log("getting this tokenUri", tokenURI);
                tokenURI = GetIpfsUrlFromPinata(tokenURI);
                let meta = await axios.get(tokenURI);
                meta = meta.data;

                let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
                let item = {
                    price,
                    tokenId: i.tokenId.toNumber(),
                    seller: i.seller,
                    owner: i.owner,
                    image: meta.image,
                    name: meta.name,
                    description: meta.description,
                }
                return item;
            }));

            updateFetched(true);
            updateData(items);
        } catch (error) {
            console.error("Error fetching NFTs:", error);
        }
    }

    // Function to handle buying NFT with ERC20 tokens
    async function buyNFT(tokenId, price) {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);

            // Ensure the user has approved the marketplace to spend their tokens
            const tokenContractAddress = "0xYourERC20TokenAddressHere"; // Replace with your ERC20 token address
            const tokenContract = new ethers.Contract(tokenContractAddress, [
                "function approve(address spender, uint256 amount) public returns (bool)"
            ], signer);

            // Approve the marketplace contract to spend the required amount
            const approval = await tokenContract.approve(MarketplaceJSON.address, ethers.utils.parseUnits(price, 'ether'));
            await approval.wait();

            // Execute the purchase
            const transaction = await contract.executeSale(tokenId);
            await transaction.wait();

            console.log("NFT purchased successfully!");

            // Refresh the list of NFTs
            getAllNFTs();
        } catch (error) {
            console.error("Error buying NFT:", error);
        }
    }

    useEffect(() => {
        if (!dataFetched) {
            getAllNFTs();
        }
    }, [dataFetched]);

    return (
        <div>
            <Navbar />
            <div className="flex flex-col place-items-center mt-20">
                <div className="md:text-xl font-bold text-white">
                    Top NFTs in the Marketplace
                </div>
                <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                    {data.map((value, index) => (
                        <NFTTile
                            data={value}
                            key={index}
                            buyNFT={() => buyNFT(value.tokenId, value.price)} // Pass buyNFT function to NFTTile
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
