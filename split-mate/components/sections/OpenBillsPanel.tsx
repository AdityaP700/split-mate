// /components/sections/OpenBillsPanel.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

// --- THIS IS THE CRITICAL FIX ---
// Use the same, single source of truth for the Bill type.
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

export default function OpenBillsPanel({ bills }: { bills: Bill[] }) {
  return (
    <Card className="bg-white/5 border border-white/10 rounded-xl p-6">
      <CardHeader className="p-0 mb-4">
        <CardTitle className="text-xl text-white">Your Open Bills</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {bills && bills.length > 0 ? (
          <div className="space-y-4">
            {bills.map(bill => (
              <div key={bill.billId} className="p-3 bg-white/5 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-white">{bill.description}</p>
                  <p className="font-mono text-sm text-white/80">${bill.totalAmount.toFixed(2)}</p>
                </div>
                <div className="mt-2">
                  <p className="text-xs text-white/60 mb-1">Payment Status:</p>
                  <div className="flex -space-x-2">
                    {bill.participants.map(p => (
                      <div key={p.address} title={`${p.username} - ${p.hasPaid ? 'Paid' : 'Pending'}`}>
                        <Image
                          src={`https://api.dicebear.com/8.x/initials/svg?seed=${p.username}`}
                          alt={p.username}
                          width={28}
                          height={28}
                          className={`rounded-full border-2 transition-all ${p.hasPaid ? 'border-green-500' : 'border-gray-500 opacity-60'}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-white/60">
            <p>You have no open bills.</p>
            <p className="text-sm">Bills you create will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}