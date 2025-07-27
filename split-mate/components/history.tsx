"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock } from 'lucide-react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';

// --- Bill Type ---
type Bill = {
  billId: string;
  creatorAddress: string;
  creatorUsername: string;
  description: string;
  totalAmount: number;
  participants: { address: string; username: string; hasPaid: boolean }[];
  status: 'pending' | 'settled';
  createdAt: string;
};

// --- Status Badge ---
const StatusBadge = ({ bill, currentUserAddress }: { bill: Bill; currentUserAddress?: string }) => {
  if (bill.creatorAddress.toLowerCase() === currentUserAddress?.toLowerCase()) {
    return bill.status === 'settled' ? (
      <Badge variant="outline" className="bg-white/10 border-white/20 text-white/80">
        <CheckCircle className="w-3 h-3 mr-1" /> Settled
      </Badge>
    ) : (
      <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20">
        <ArrowUpRight className="w-3 h-3 mr-1" /> Owed to You
      </Badge>
    );
  } else {
    const me = bill.participants.find((p) => p.address.toLowerCase() === currentUserAddress?.toLowerCase());
    if (me?.hasPaid) {
      return (
        <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
          <ArrowDownLeft className="w-3 h-3 mr-1" /> You Paid
        </Badge>
      );
    }
    return (
      <Badge variant="default" className="bg-amber-500/10 text-amber-400 border-amber-500/20">
        <Clock className="w-3 h-3 mr-1" /> You Owe
      </Badge>
    );
  }
};

// --- History Component with Pagination ---
export default function History({ history }: { history: Bill[] }) {
  const { address: currentUserAddress } = useAccount();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const filteredHistory = history.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.creatorUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.participants.some((p) => p.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <Card className="w-full bg-white/5 border border-white/10 shadow-lg shadow-black/20 rounded-xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-white/5">
        <div>
          <CardTitle className="text-xl text-white">Transaction History</CardTitle>
          <CardDescription className="text-sm text-white/60 mt-1">
            A complete on-chain record of all your past splits.
          </CardDescription>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <Input
            type="text"
            placeholder="Search by description or user..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-64 pl-9 bg-white/5 border-white/10 rounded-lg focus:bg-white/10 focus:ring-2 focus:ring-[#0553f3]"
          />
        </div>
      </CardHeader>

      {/* Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-semibold text-white/40 uppercase tracking-wider">
            <div className="col-span-5">Description</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">Date</div>
          </div>
          {/* Table Body */}
          <div>
            {paginatedHistory.length > 0 ? (
              paginatedHistory.map((entry, index) => (
                <motion.div
                  key={entry.billId}
                  className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="col-span-5 flex items-center gap-3">
                    <Image
                      src={`https://api.dicebear.com/8.x/initials/svg?seed=${entry.creatorUsername}`}
                      alt={entry.creatorUsername}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-medium text-white">{entry.description}</p>
                      <p className="text-xs text-white/50">
                        {entry.creatorAddress.toLowerCase() === currentUserAddress?.toLowerCase()
                          ? `with ${entry.participants.length} people`
                          : `from ${entry.creatorUsername}`}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <StatusBadge bill={entry} currentUserAddress={currentUserAddress} />
                  </div>
                  <div className="col-span-2 font-mono text-sm text-white/90">${entry.totalAmount.toFixed(2)}</div>
                  <div className="col-span-3 text-sm text-white/70">{formatDate(entry.createdAt)}</div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-16 text-white/60">No history found for your search.</div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Pagination */}
      {filteredHistory.length > itemsPerPage && (
        <div className="p-6 border-t border-white/5 flex justify-center items-center gap-2 text-sm text-white/60">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="bg-transparent border-white/20"
          >
            Previous
          </Button>
          <span className="px-2">Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="bg-transparent border-white/20"
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
