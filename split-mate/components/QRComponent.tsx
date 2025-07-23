"use client";

import { useState } from "react";
import { contractABI } from "./abi";
import { useContractWrite, useAccount, useConnect, useDisconnect } from "wagmi";
import QRCode from "qrcode";
import Image from "next/image";

const contractAddress = "0x1c91347f2A44538ce62453BEBd9Aa907C662b4bD";

export default function TestPage() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useContractWrite();

  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [qrCodeURL, setQRCodeURL] = useState("");
  const [status, setStatus] = useState(false);

  const handleMint = async () => {
    if (!address || !recipientAddress || !amount) return;

    try {
      const amountInWei = BigInt(Number(amount) * 1e18).toString();
      const qrData = `ethereum:${recipientAddress}@8453/transfer?value=${amountInWei}`;

      const tx = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "mintAnNFT",
        args: [
          address,
          "https://ipfs.io/ipfs/QmXnW8z5Z1b7d6f3c9e5f4e5f4e5f4e5f4e5f4e5f4e5f4e",
        ],
      });

      const qr = await QRCode.toDataURL(qrData);
      setQRCodeURL(qr);
      console.log("Transaction:", tx);
      setStatus(true);
    } catch (err) {
      console.error("Minting failed:", err);
      setStatus(false);
    }
  };

  return (
    <div className="p-4 text-white bg-black min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-xl font-bold mb-4">Mint NFT + Generate QR (Base)</h1>

      {!isConnected ? (
        <>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => connect({ connector })}
              className="mb-4 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              Connect Wallet ({connector.name})
            </button>
          ))}
        </>
      ) : (
        <>
          <p className="mb-2">Connected Address:</p>
          <p className="mb-4 text-green-400 text-sm">{address}</p>

          <input
            type="text"
            placeholder="Recipient Address"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            className="mb-2 px-4 py-2 rounded bg-gray-800 text-white w-80"
          />

          <input
            type="number"
            placeholder="Amount in ETH"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mb-4 px-4 py-2 rounded bg-gray-800 text-white w-80"
          />

          <button
            onClick={handleMint}
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 mb-2"
          >
            Mint NFT + Generate QR
          </button>

          <button
            onClick={() => disconnect()}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Disconnect Wallet
          </button>
        </>
      )}

      {qrCodeURL && (
        <div className="mt-6 flex flex-col items-center">
          <Image
            src={qrCodeURL}
            alt="QR Code"
            width={160}
            height={160}
            className="border border-amber-400 rounded-md"
          />
          <p className="mt-4 text-sm text-yellow-300">
            Scan to Pay on Base (Chain ID 8453)
          </p>
        </div>
      )}

      {status && (
        <p className="mt-4 text-green-500 font-medium">
          ✅ NFT minted successfully!
        </p>
      )}
    </div>
  );
}
