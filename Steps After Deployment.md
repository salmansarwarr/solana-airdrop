### **Instructions to Fund the Vault for the Airdrop Program**

After deploying the Solana Anchor program, you'll need to fund the vault account with the tokens that will be distributed as part of the airdrop. Here's a step-by-step guide:

#### **1\. Understand the Vault's Role**

The **vault** is a token account controlled by the program. It holds the tokens that will be distributed to users when they claim their airdrop allocation.

#### **2\. Obtain the PDA**

The vault address is derived during the program's deployment.

There is a script in the solana/utils folder of the delivery, you can see the pda by running the script

#### **3\. Install Solana CLI (If Not Already Installed)**

If you haven’t installed the Solana Command Line Interface (CLI):

<https://solana.com/docs/intro/installation>

#### **4\. Fund Your Wallet**

Ensure your Solana wallet has enough tokens to cover both the vault funding and transaction fees.

**On Devnet:** Airdrop free SOL:  
<br/>solana airdrop 2

- **On Mainnet:** Transfer SOL from an exchange to your wallet.

Check your wallet balance:

solana balance

#### **5\. Fund the Vault**

You will need to transfer the required amount of tokens to the vault account.

##### **Step-by-Step:**

1. **Identify the Token Mint Address:** The mint address is the unique identifier for the token you want to distribute in the airdrop. It is the program Id of your token

**Create an Associated Token Account for the Vault (if it doesn't exist):** Run this command to create a token account for the vault:  
<br/>spl-token create-account &lt;TOKEN_MINT_ADDRESS&gt; --owner &lt;PDA&gt;

1. Replace &lt;TOKEN_MINT_ADDRESS&gt; with your token's mint address and &lt;PDA&gt; with contract’s pda

**Transfer Tokens to the Vault:** Use the following command to fund the vault (the created account from the above command):  
<br/>spl-token transfer &lt;TOKEN_MINT_ADDRESS&gt; &lt;AMOUNT&gt; &lt;VAULT_ADDRESS&gt; --fund-recipient

- - Replace &lt;TOKEN_MINT_ADDRESS&gt; with the mint address of your token.
    - Replace &lt;AMOUNT&gt; with the number of tokens you want to transfer.
    - Replace &lt;VAULT_ADDRESS&gt; with the vault's public key.

**Verify the Transfer:** Check the vault's balance to ensure it received the tokens:  
<br/>spl-token balance &lt;VAULT_ADDRESS&gt;

#### **6\. Confirm Program Readiness**

Once the vault is funded, the airdrop program will be ready to handle user claims. You can proceed with setting allocations for recipients.

#### **7\. Keep Your Wallet Secure**

Never share your wallet keys or passphrase. Always double-check the vault address before transferring tokens.

###

###

### **Instructions for Frontend**

#### **1\. Replace the Mint Address**

1. Navigate to the frontend code of your project.

Open the file located at:  
<br/>frontend/src/constants/constants.js

1. Replace tokenMintAddress with the actual mint address of the token you plan to use for the airdrop.  

2. Replace taxRecieverAddress with the actual reciever address of the tax
3. Replace tokenDecimals with the decimals of your token

#### **2\. Replace the IDL File**

The IDL (Interface Definition Language) file ensures the frontend understands how to interact with the deployed program.

Locate the current IDL file in the frontend:  
frontend/src/assets/

1. Replace the existing IDL file with the updated one generated during deployment:

You can find the IDL file in your Anchor project directory under:  
bash  
<br/>target/idl/&lt;program_name&gt;.json

Rename the file to idl.json and Copy this file to the frontend directory:  
<br/>frontend/src/assets/idl.json

Save all changes

#### **3\. Access the Admin Route**

To initialize and allocate funds, use the admin interface on the website.

1. **Log In as Admin:**
    - Open the website in your browser.

Navigate to the admin route by appending /admin to the URL. For example:  
<br/><https://yourwebsite.com/admin>

1. **Initialize the Vault:**
    - In the admin panel, look for an option or button labeled **"Initialize Vault"** or similar.
    - Enter the total number of tokens you want to allocate for the airdrop.
    - initialize the vault.
2. **Allocate Funds to Recipients:**
    - In the admin panel, look for the **"Set Allocation"** or **"Allocate Funds"** section.
    - input their wallet addresses and allocation amounts.

#### **5\. Test the Airdrop**

To confirm everything is set up correctly:

1. Try claiming tokens from a test recipient's wallet using the website's claim functionality.
2. Verify that the vault's balance decreases by the claimed amount.

#### **6\. Important Notes**

- Always double-check the mint address, program ID, IDL file, and allocations before confirming any transactions.

By following these steps, you’ll ensure proper setup, funding, and functionality of the airdrop program.