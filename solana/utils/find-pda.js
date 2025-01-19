const { PublicKey } = require("@solana/web3.js");

const programId = new PublicKey("GXuzrsV8hyhdwA73eajkmKn1QpCrVuASaexCkVvqTsXc");
const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("airdrop")], // Seed(s) used to derive the PDA
    programId                // The program's ID
);

console.log("PDA:", pda.toBase58());
console.log("Bump:", bump);
