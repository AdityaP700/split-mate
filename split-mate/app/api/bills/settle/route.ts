// /app/api/bills/settle/route.ts
import dbConnect from "@/app/lib/models/mongodb";
import Bill from "@/app/lib/models/Bill";
import { ethers } from 'ethers'; 

// --- NFT MINTING SETUP ---
import { contractABI } from "@/components/abi"; // Import the ABI
const NFT_CONTRACT_ADDRESS = "0x1c91347f2A44538ce62453BEBd9Aa907C662b4bD";

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
    
    const updatedBill = await Bill.findOneAndUpdate(
      { billId, 'participants.address': payerAddress },
      { $set: { 'participants.$.hasPaid': true } },
      { new: true } // This option returns the updated document
    );

    if (updatedBill && updatedBill.status === 'pending' && updatedBill.participants.every(p => p.hasPaid)) {
        console.log(`Bill ${billId} is fully settled. Preparing to mint NFTs...`);
        
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

        const metadataUri = "https://ipfs.io/ipfs/QmXnW8z5Z1b7d6f3c9e5f4e5f4e5f4e5f4e5f4e5f4e5f4e";

        for (const recipientAddress of uniqueRecipients) {
            try {
                const tx = await nftContract.mintAnNFT(recipientAddress, metadataUri);
                console.log(`Submitted mint transaction for ${recipientAddress}. Tx hash: ${tx.hash}`);
                
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