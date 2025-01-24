const { PublicKey } = require("@solana/web3.js");

// replace with your program id
const programId = new PublicKey("6WJyCHo7YvrSCuuh3FbbD3TwwLZTdwsbh8r7o6fRG6Ga");
const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("mycontract")], // Seed(s) used to derive the PDA
    programId                // The program's ID
);

console.log("PDA:", pda.toBase58());
console.log("Bump:", bump);
