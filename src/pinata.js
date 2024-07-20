// Load environment variables from a .env file (uncomment if using environment variables)
// require('dotenv').config();

// Pinata API credentials (should be stored securely, e.g., in environment variables)
const key = '9f5409f1b8b52548fd82';
const secret = '1b4aff073173946b48b6c57e20a8068496c784f1d3ff4ee5356e5d415d6e78e5';

// Import axios for making HTTP requests and FormData for handling file uploads
const axios = require('axios');
const FormData = require('form-data');

// Function to upload JSON data to IPFS via Pinata
export const uploadJSONToIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    
    // Making an axios POST request to Pinata to upload the JSON
    return axios 
        .post(url, JSONBody, {
            headers: {
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            // On success, return the IPFS URL of the uploaded content
            return {
                success: true,
                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            // Log and return the error message if the upload fails
            console.log(error);
            return {
                success: false,
                message: error.message,
            };
        });
};

// Function to upload files to IPFS via Pinata
export const uploadFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    
    // Create a FormData object to hold the file and metadata
    let data = new FormData();
    data.append('file', file);

    // Metadata for the file, can include name and key-value pairs
    const metadata = JSON.stringify({
        name: 'testname',
        keyvalues: {
            exampleKey: 'exampleValue'
        }
    });
    data.append('pinataMetadata', metadata);

    // Optional: Pinata options for pinning configuration
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    // Making an axios POST request to Pinata to upload the file
    return axios 
        .post(url, data, {
            maxBodyLength: 'Infinity', // Ensure no size limit on the request body
            headers: {
                'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                pinata_api_key: key,
                pinata_secret_api_key: secret,
            }
        })
        .then(function (response) {
            // Log and return the IPFS URL of the uploaded file
            console.log("image uploaded", response.data.IpfsHash);
            return {
                success: true,
                pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
            };
        })
        .catch(function (error) {
            // Log and return the error message if the upload fails
            console.log(error);
            return {
                success: false,
                message: error.message,
            };
        });
};
