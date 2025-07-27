// /app/service/BillDashboard.tsx

"use client";
import { useState, useEffect } from "react";
import { useXMTP } from "../context/XMTPContext";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-toastify";
import axios from "axios";

type Bill = {
  billId: string;
  creatorAddress: string;
  creatorUsername: string;
  description: string;
  totalAmount: number;
  participants: {
    address: string;
    username: string;
    owedAmount: number;
    hasPaid: boolean;
  }[];
  status: 'pending' | 'settled';
  createdAt: string;
};

// The component now receives the live bills and the refresh function as props
const BillDashboard = ({ bills, fetchDashboardData }: { bills: Bill[], fetchDashboardData: () => void }) => {
  const { sendMessage } = useXMTP();
  const { address } = useAccount();
  const { data: hash, isSuccess, sendTransaction, isPending } = useSendTransaction();
  const [processingBillId, setProcessingBillId] = useState<string | null>(null);

  const handlePayBill = (bill: Bill) => {
    const currentUserParticipant = bill.participants.find(p => p.address.toLowerCase() === address?.toLowerCase());
    
    if (!currentUserParticipant) {
      toast.error("Error: You are not a participant in this bill.");
      return;
    }
    
    setProcessingBillId(bill.billId);
    
    sendTransaction({
      to: bill.creatorAddress as `0x${string}`, // Type assertion for wagmi
      value: parseEther(String(currentUserParticipant.owedAmount)),
    });
  };

  // --- THE "WOW" MOMENT LOGIC ---
  useEffect(() => {
    // This effect runs only after a wagmi transaction succeeds
    if (isSuccess && hash && processingBillId) {
      console.log("Payment successful! Sending confirmation receipt...");
      toast.success("Payment sent! Notifying your friend...");

      const confirmationPayload = {
        type: 'payment_confirmation',
        billId: processingBillId,
        payerAddress: address,
      };

      const paidBill = bills.find(b => b.billId === processingBillId);
      if (paidBill) {
        // 1. Send the receipt via XMTP
        sendMessage(paidBill.creatorAddress, JSON.stringify(confirmationPayload));

        // 2. Update the bill's status in our database
        axios.post('/api/bills/settle', { billId: processingBillId, payerAddress: address })
          .then(() => {
            // 3. IMPORTANT: Refresh the entire dashboard's data to show the change
            fetchDashboardData();
          })
          .catch(err => {
            console.error("Failed to settle bill in DB:", err);
            toast.error("Database update failed, but your transaction was successful.");
          });
      }

      setProcessingBillId(null); // Reset the processing state
    }
  }, [isSuccess, hash]); // Dependencies are correct

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Incoming Bills</h2>
      {bills && bills.length > 0 ? (
        <div className="space-y-4">
          {bills.map((bill) => {
            const myShare = bill.participants.find(p => p.address.toLowerCase() === address?.toLowerCase())?.owedAmount || 0;
            return (
              <div key={bill.billId} className="p-4 bg-white/5 rounded-lg flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-white">{bill.description}</h3>
                  <p className="text-sm text-white/60">From: {bill.creatorUsername}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-[#6a78f8]">${myShare.toFixed(2)}</p>
                  <button
                    onClick={() => handlePayBill(bill)}
                    disabled={isPending && processingBillId === bill.billId}
                    className="mt-1 px-3 py-1 bg-[#0553f3] text-white text-sm font-semibold rounded-md hover:bg-[#0553f3]/90 disabled:bg-gray-500 transition"
                  >
                    {isPending && processingBillId === bill.billId ? "Processing..." : "Pay Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-white/60">
          <p>You're all settled up!</p>
          <p className="text-sm">When a friend sends you a bill, it will appear here.</p>
        </div>
      )}
    </div>
  );
};

export default BillDashboard;