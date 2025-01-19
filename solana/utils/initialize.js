const {
    web3,
    BN,
    Provider,
    Program,
    Wallet,
    AnchorProvider,
} = require("@coral-xyz/anchor");
const {
    PublicKey,
    Keypair,
    Connection,
    SystemProgram,
    clusterApiUrl,
} = require("@solana/web3.js");
const { TOKEN_2022_PROGRAM_ID } = require("@solana/spl-token");
const idl = require("../target/idl/airdrop.json");
const bs58 = require("bs58");

// You'll need to replace these with your actual values
const PROGRAM_ID = new PublicKey(
    "AC4DGuEFdNZDxbUbEGBFZmh5gqRGzoes9Cv2MNgPrqvw"
);

const ADMIN_PRIVATE_KEY =
    "SPG4PeT31MybtiLCoZCQonxL6Q1HgrJMC6LpaMspW7zUgQsRxVpn2kGbyscRBSXKE4B63mn8oLLqbWvrRcigxwP"; // Replace with your private key string
// Decode the private key string into a Uint8Array
const decodedPrivateKey = bs58.decode(ADMIN_PRIVATE_KEY);

async function initializeAirdrop() {
    // Set up connection and wallet
    const connection = new Connection(clusterApiUrl("devnet"));

    // Load your admin wallet - Replace with your actual keypair
    const adminKeypair = Keypair.fromSecretKey(decodedPrivateKey);
    const wallet = new Wallet(adminKeypair);

    // Create provider
    const provider = new AnchorProvider(connection, wallet, {
        commitment: "processed",
    });

    // Load program
    const program = new Program(idl, provider);

    console.log(program);

    // Derive PDA for airdrop account
    const [airdropPDA, bump] = await PublicKey.findProgramAddress(
        [Buffer.from("airdrop")],
        program.programId
    );

    // Set the total tokens for airdrop (adjust based on your needs)
    const totalTokens = new BN(10000);

    // Call initialize_airdrop instruction
    const tx = await program.methods
        .initializeAirdrop(totalTokens, bump)
        .accounts({
            airdrop: airdropPDA,
            admin: adminKeypair.publicKey,
            systemProgram: SystemProgram.programId,
            tokenProgram: TOKEN_2022_PROGRAM_ID,
        })
        .signers([adminKeypair])
        .rpc();

    console.log("Airdrop initialized successfully!");
    console.log("Transaction signature:", tx);
    console.log("Airdrop PDA:", airdropPDA.toString());
    console.log("Admin pubkey:", adminKeypair.publicKey.toString());

    return {
        tx,
        airdropPDA: airdropPDA.toString(),
        admin: adminKeypair.publicKey.toString(),
    };
}

// Helper function to run the script
async function main() {
    const result = await initializeAirdrop();
    console.log("Initialization completed successfully!");
    console.log(result);
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = {
    initializeAirdrop,
};
