### 1\. Overview

Deploying a Solana Anchor program involves uploading your code to the Solana blockchain. There are two primary networks to deploy to:

- Devnet: For testing and development purposes.
- Mainnet: The live network where real transactions occur.

### Currently the tax is set to 1% but it can be changes in the line of solana/program/airdrop/src/lib.rs

let tax_in_tokens = amount.checked_div(100).ok_or(CustomError::Overflow)?;

just replace 100 with the amount of tax you want to take for example 200 for 2%, 1000 for 10% etc.

### **Note: For Easier deployment you can go to** [**https://beta.solpg.io/**](https://beta.solpg.io/) **both for mainnet and devnet and connect your phantom wallet so that you are the owner of the contract not the beta.solpg wallets**

### 2\. Prerequisites

Make sure you have the following:

1. A computer with Node.js and Anchor CLI installed.
2. A Solana wallet with:
    - Devnet SOL for deployment on Devnet (free from airdrops).
    - Mainnet SOL for deployment on Mainnet (can be purchased from an exchange).
3. The program code files

### 3\. Install Required Tools

Follow these steps to install the required tools:

1. Install Nodejs

<https://nodejs.org/en/download>

1. Install Solana CLI and Anchor:

<https://solana.com/docs/intro/installation>

### 4\. Configure Solana Wallet

1. Generate or Import Wallet:

If you don’t already have a wallet, generate one:  
<br/>solana-keygen new --outfile ~/solana-wallet.json

- - If you have a wallet, save the keypair file (e.g., solana-wallet.json) in a secure location.

Set Your Wallet as Default:  
<br/>solana config set --keypair &lt;path to your keypair file&gt;

1. Set Network (Devnet or Mainnet):

For Devnet:  
<br/>solana config set --url <https://api.devnet.solana.com>

For Mainnet:  
<br/>solana config set --url <https://api.mainnet-beta.solana.com>

### 5\. Get SOL for Deployment

- For Devnet:

Airdrop SOL to your wallet:  
<br/>solana airdrop 2

Check your balance:  
<br/>solana balance

- For Mainnet:

Transfer SOL from an exchange to your wallet address.

### 6\. Deploy the Program

1. Navigate to the Program Folder:

Open your terminal and go to the program directory:  
<br/>cd /path/to/your/anchor/project

1. Build the Program:

Compile the program into a deployable format:  
<br/>anchor build

1. Deploy to Devnet or Mainnet:

Deploy to Devnet:  

anchor deploy --provider.cluster devnet

Deploy to Mainnet:  
<br/>anchor deploy --provider.cluster mainnet

1. Note the Program ID:
    - After deployment, Anchor will output a Program ID. This is the unique identifier for your program on the blockchain. Save this for future reference.

### 7\. Verify Deployment

Use the following command to confirm the deployment:  
<br/>solana program show &lt;PROGRAM_ID&gt;

- Replace &lt;PROGRAM_ID&gt; with the Program ID from the previous step.

### 9\. Keep Your Wallet Safe

1. Never share your wallet key file or passphrase with anyone.
2. Always keep a backup of your wallet file.

### 10\. Troubleshooting

- If you encounter any issues, refer to the Solana or Anchor documentation or consult a developer for assistance.