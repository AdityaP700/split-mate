"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge'; // Make sure to install: npx shadcn-ui@latest add badge
import { Search, MoreHorizontal, ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { historyData } from '@/components/sections/history-data'; // Import our mock data
import { motion } from 'framer-motion';

// Helper component for status badges
const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'You Paid':
      return <Badge variant="destructive" className="bg-red-500/10 text-red-400 border-red-500/20"><ArrowUpRight className="w-3 h-3 mr-1" />Owed to you</Badge>;
    case 'They Paid':
      return <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20"><ArrowDownLeft className="w-3 h-3 mr-1" />You Owe</Badge>;
    case 'Paid Back':
      return <Badge variant="outline" className="bg-white/10 border-white/20 text-white/80"><CheckCircle className="w-3 h-3 mr-1" />Settled</Badge>;
    case 'Pending':
      return <Badge variant="default" className="bg-amber-500/10 text-amber-400 border-amber-500/20"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};
interface HistoryEntry {
  id: string;
  description: string;
  status: string;
  amount: number;
  date: string;
  person: {
    name: string;
    avatar: string;
  };
}
interface HistoryPageProps {
  history: HistoryEntry[]; // Replace `any` with your actual type if possible
}

export default function HistoryPage({ history }: HistoryPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHistory = historyData.filter(
    (entry) =>
      entry.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Card className="w-full bg-white/5 border border-white/10 shadow-lg shadow-black/20 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-white/5">
        <div>
          <CardTitle className="text-xl text-white">Transaction History</CardTitle>
          <CardDescription className="text-sm text-white/60 mt-1">
            A complete record of all your past splits.
          </CardDescription>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9 bg-white/5 border-white/10 rounded-lg focus:bg-white/10 focus:ring-2 focus:ring-[#0553f3]"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-semibold text-white/40 uppercase tracking-wider">
            <div className="col-span-4">Description</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">Date</div>
            <div className="col-span-1 text-right"></div>
          </div>
          {/* Table Body */}
          <div>
            {filteredHistory.map((entry, index) => (
              <motion.div
                key={entry.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/5 last:border-b-0 hover:bg-white/[0.03] transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="col-span-4 flex items-center gap-3">
                  <Image src={entry.person.avatar} alt={entry.person.name} width={32} height={32} className="rounded-full" />
                  <div>
                    <p className="font-medium text-white">{entry.description}</p>
                    <p className="text-xs text-white/50">with {entry.person.name}</p>
                  </div>
                </div>
                <div className="col-span-2"><StatusBadge status={entry.status} /></div>
                <div className="col-span-2 font-mono text-sm text-white/90">${entry.amount.toFixed(2)}</div>
                <div className="col-span-3 text-sm text-white/70">{formatDate(entry.date)}</div>
                <div className="col-span-1 text-right">
                  <Button variant="ghost" size="icon" className="w-8 h-8 rounded-full text-white/70 hover:bg-white/10 hover:text-white">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
      {/* Pagination (placeholder) */}
      <div className="p-6 border-t border-white/5 flex justify-center items-center gap-2 text-sm text-white/60">
        <Button variant="outline" size="sm" className="bg-transparent border-white/20">Previous</Button>
        <span className="px-2">Page 1 of 1</span>
        <Button variant="outline" size="sm" className="bg-transparent border-white/20">Next</Button>
      </div>
    </Card>
  );
}