const { PublicKey } = require("@solana/web3.js");

// replace with your program id
const programId = new PublicKey("FR7NVcRWT5WWDAXvNKvJqbFKF4Nm3urGqFvnBwAbktkv");
const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("airdrop")], // Seed(s) used to derive the PDA
    programId                // The program's ID
);

console.log("PDA:", pda.toBase58());
console.log("Bump:", bump);
