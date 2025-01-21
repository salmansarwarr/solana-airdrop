const { Keypair } = require("@solana/web3.js");
const bs58 = require("bs58");
const fs = require("fs");

// Replace with your private key
const ADMIN_PRIVATE_KEY =
    "SPG4PeT31MybtiLCoZCQonxL6Q1HgrJMC6LpaMspW7zUgQsRxVpn2kGbyscRBSXKE4B63mn8oLLqbWvrRcigxwP"; // Replace with your private key string
// Decode the private key string into a Uint8Array
const decodedPrivateKey = bs58.decode(ADMIN_PRIVATE_KEY);

const adminKeypair = Keypair.fromSecretKey(decodedPrivateKey);

// Extract the secret key as an array of integers
const keypairData = Array.from(adminKeypair.secretKey);

// Define the path and filename for the JSON file
const filePath = "./keypair.json";

// Write the keypair data to a JSON file
fs.writeFileSync(filePath, JSON.stringify(keypairData, null, 2), "utf8");

console.log(`Keypair saved to ${filePath}`);