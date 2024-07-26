import './App.css'; // Importing the CSS file for styling
import Navbar from './components/Navbar.js'; // Importing the Navbar component
import Marketplace from './components/Marketplace'; // Importing the Marketplace component
import Profile from './components/Profile'; // Importing the Profile component
import SellNFT from './components/SellNFT'; // Importing the SellNFT component
import NFTPage from './components/NFTpage'; // Importing the NFTPage component
import ReactDOM from "react-dom/client"; // Importing ReactDOM for rendering the app
import {
  BrowserRouter, // Importing BrowserRouter for routing capabilities
  Routes, // Importing Routes to define the different routes of the application
  Route, // Importing Route to create individual routes
} from "react-router-dom";


function App() {
  return (
    <div className="container"> 
        {/* Defining the routes for different components */}
        <Routes>
          <Route path="/" element={<Marketplace />}/> {/* Route for the Marketplace component */}
          <Route path="/nftPage" element={<NFTPage />}/> {/* Route for the NFTPage component */}
          <Route path="/profile" element={<Profile />}/> {/* Route for the Profile component */}
          <Route path="/sellNFT" element={<SellNFT />}/> {/* Route for the SellNFT component */}
        </Routes>
    </div>
  );
}

export default App; // Exporting the App component as default
