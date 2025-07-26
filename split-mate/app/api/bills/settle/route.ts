// /app/api/bills/settle/route.ts
import dbConnect from "@/app/lib/models/mongodb";
import Bill from "@/app/lib/models/Bill";
import { ethers } from 'ethers'; // We use ethers.js on the backend

// --- NFT MINTING SETUP ---
import { contractABI } from "@/components/abi"; // Import the ABI
const NFT_CONTRACT_ADDRESS = "0x1c91347f2A44538ce62453BEBd9Aa907C662b4bD";

// A secure function to initialize our server-side "minter" wallet
const getMinterWallet = () => {
  if (!process.env.BASE_SEPOLIA_RPC_URL) throw new Error("BASE_SEPOLIA_RPC_URL is not set");
  if (!process.env.MINTER_PRIVATE_KEY) throw new Error("MINTER_PRIVATE_KEY is not set");

  const provider = new ethers.providers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
  const minterWallet = new ethers.Wallet(process.env.MINTER_PRIVATE_KEY, provider);
  return minterWallet;
};
// --- END SETUP ---


export async function POST(request: Request) {
  try {
    const { billId, payerAddress } = await request.json();
    await dbConnect();
    
    // Update the participant's status and get the updated bill document back
    const updatedBill = await Bill.findOneAndUpdate(
      { billId, 'participants.address': payerAddress },
      { $set: { 'participants.$.hasPaid': true } },
      { new: true } // This option returns the updated document
    );

    // --- NFT MINTING LOGIC ---
    // Check if the bill is now fully settled and hasn't been settled before
    if (updatedBill && updatedBill.status === 'pending' && updatedBill.participants.every(p => p.hasPaid)) {
        console.log(`Bill ${billId} is fully settled. Preparing to mint NFTs...`);
        
        // Mark the bill as 'settled' in the DB to prevent re-minting
        updatedBill.status = 'settled';
        await updatedBill.save();

        const minterWallet = getMinterWallet();
        const nftContract = new ethers.Contract(NFT_CONTRACT_ADDRESS, contractABI, minterWallet);

        // All participants + the creator will receive an NFT
        const allRecipients = [
            updatedBill.creatorAddress, 
            ...updatedBill.participants.map(p => p.address)
        ];
        // Remove duplicates in case the creator is also a participant
        const uniqueRecipients = [...new Set(allRecipients)];

        console.log("Minting NFTs for:", uniqueRecipients);

        // For a real app, you would generate unique metadata for each bill (e.g., on IPFS)
        const metadataUri = "https://ipfs.io/ipfs/QmXnW8z5Z1b7d6f3c9e5f4e5f4e5f4e5f4e5f4e5f4e5f4e";

        // Asynchronously mint an NFT for every person involved
        for (const recipientAddress of uniqueRecipients) {
            try {
                // Your contract function is `mintAnNFT(address to, string memory tokenURI)`
                const tx = await nftContract.mintAnNFT(recipientAddress, metadataUri);
                console.log(`Submitted mint transaction for ${recipientAddress}. Tx hash: ${tx.hash}`);
                // We don't wait for each tx to complete to speed up the API response
                // In production, you might move this to a background job queue
            } catch (mintError) {
                console.error(`Failed to submit mint transaction for ${recipientAddress}:`, mintError);
            }
        }
    }
    
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Error in /api/bills/settle:", error);
    return new Response(JSON.stringify({ success: false, error: "Server error" }), { status: 500 });
  }
}