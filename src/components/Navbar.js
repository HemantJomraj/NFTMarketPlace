

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from "react-router-dom";
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';

function Navbar() {

const [connected, toggleConnect] = useState(false);
const location = useLocation();
const [currAddress, updateAddress] = useState('0x');

async function getAddress() {
  const ethers = require("ethers");
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const addr = await signer.getAddress();
  updateAddress(addr);
}

function updateButton() {
  const ethereumButton = document.querySelector('.enableEthereumButton');
  ethereumButton.textContent = "Connected";
  ethereumButton.classList.remove("hover:bg-blue-70");
  ethereumButton.classList.remove("bg-blue-500");
  ethereumButton.classList.add("hover:bg-green-70");
  ethereumButton.classList.add("bg-green-500");
}

async function connectWebsite() {

    console.log("demo");
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    console.log("======",chainId);
    if(chainId !== '0xaa36a7')
    {
      console.log("===ifff");
      //alert('Incorrect network! Switch your metamask network to Rinkeby');
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }],
     })
    }  
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        updateButton();
        console.log("button here");
        getAddress();
        window.location.replace(location.pathname)
      });
}

  useEffect(() => {
    // if(window.ethereum == undefined)
    //   return;
    let val = window.ethereum.isConnected();
    if(val)
    {
      console.log("here");
      getAddress();
      toggleConnect(val);
      updateButton();
    }

    window.ethereum.on('accountsChanged', function(accounts){
      window.location.replace(location.pathname)
    })

  });

    return (
      <div className="">
      <nav className="w-full bg-gray-800">
        <ul className="flex items-center justify-between py-3 px-5 text-white">
          <li className="flex items-center">
            <Link to="/" className="font-bold text-xl">
              NFT Marketplace
            </Link>
          </li>
          <li className="w-2/3">
            <ul className="flex justify-between font-bold text-lg">
              <li className={`nav-item ${location.pathname === "/" ? 'active' : ''}`}>
                <Link to="/" className="nav-link">Marketplace</Link>
              </li>
              <li className={`nav-item ${location.pathname === "/sellNFT" ? 'active' : ''}`}>
                <Link to="/sellNFT" className="nav-link">Create NFT</Link>
              </li>
              <li className={`nav-item ${location.pathname === "/profile" ? 'active' : ''}`}>
                <Link to="/profile" className="nav-link">Profile</Link>
              </li>
              <li>
                <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm" onClick={connectWebsite}>{connected ? "Connected" : "Connect Wallet"}</button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <div className="text-white text-right mr-5 text-sm">
        {currAddress !== "0x" ? "Connected to" : "Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0, 15) + '...') : ""}
      </div>
    </div>
    
    );
  }

  export default Navbar;
