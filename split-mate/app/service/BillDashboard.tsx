// src/components/BillDashboard.tsx
"use client";
import { useState, useEffect } from "react";
import { useXMTP } from "../context/XMTPContext";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { toast } from "react-toastify";
import axios from "axios";

// This is the type for a single bill document from your database
type Bill = {
  billId: string;
  creatorUsername: string;
  creatorAddress: string;
  description: string;
  participants: {
    address: string;
    username: string;
    owedAmount: number;
  }[];
};

// The component now receives the live bills as a prop
const BillDashboard = ({ bills, fetchDashboardData }: { bills: Bill[], fetchDashboardData: () => void }) => {
  const { sendMessage } = useXMTP();
  const { address } = useAccount();

  // Wagmi hook for sending the payment
  const { data: hash, isSuccess, sendTransaction, isPending } = useSendTransaction();

  // State to track which bill is currently being processed
  const [processingBillId, setProcessingBillId] = useState<string | null>(null);

  const handlePayBill = (bill: Bill) => {
    // Find the current user in the participants list to get their details
    const currentUserParticipant = bill.participants.find(p => p.address.toLowerCase() === address?.toLowerCase());
    
    if (!currentUserParticipant) {
      toast.error("Error: You are not a participant in this bill.");
      return;
    }
    
    setProcessingBillId(bill.billId); // Remember which bill is being paid
    
    sendTransaction({
  to: bill.creatorAddress as `0x${string}`,
  value: parseEther(String(currentUserParticipant.owedAmount)),
});

  };

  // --- THE "WOW" MOMENT ---
  // This effect runs after a successful payment transaction
  useEffect(() => {
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
      // 1. Send receipt via XMTP
      sendMessage(paidBill.creatorAddress, JSON.stringify(confirmationPayload));

      // 2. Update DB and then refresh dashboard
      axios
        .post('/api/bills/settle', { billId: processingBillId, payerAddress: address })
        .then(() => {
          fetchDashboardData(); // 🔄 refresh UI after successful update
        })
        .catch(err => {
          console.error("Failed to settle bill in DB:", err);
          toast.error("Database update failed, but transaction went through.");
        });
    }

    setProcessingBillId(null);
  }
}, [isSuccess, hash]);

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Incoming Bills</h2>
      {bills.length === 0 ? (
        <div className="text-center py-8 text-white/60">
          <p>You're all settled up!</p>
          <p className="text-sm">When a friend sends you a bill, it will appear here.</p>
        </div>
      ) : (
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
                    {isPending && processingBillId === bill.billId ? "Paying..." : "Pay Now"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BillDashboard;