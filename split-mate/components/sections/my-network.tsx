"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';
import Image from 'next/image';

// --- CHANGE 1: Import the Dialog components from shadcn/ui ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"

// --- CHANGE 2: Import your existing XMTP component ---
import XMTPBillSplitting from '@/components/XMTPBill'; // Adjust path if needed
type NetworkUser = {
  id: string;
  name: string;
  address: string;
  avatar: string;
  icon: React.ComponentType<{ className?: string }>;
  status: string;
  isPositive: boolean | null;
  amount?: string;
  lastInteraction: string;
};
export default function MyNetwork({ network }: { network: NetworkUser[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- CHANGE 3: Add state to control the dialog's visibility ---
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);

 const filteredNetwork = (network ?? []).filter(
  (user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.address.toLowerCase().includes(searchTerm.toLowerCase())
);


  return (
    // The main Card wrapper remains the same
    <Card className="w-full bg-white/5 border border-white/10 shadow-lg shadow-black/20 rounded-xl">
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-white/5">
        <div>
          <CardTitle className="text-xl text-white">My Network</CardTitle>
          <p className="text-sm text-white/60 mt-1">Manage your connections and past splits.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              type="text"
              placeholder="Who are you looking for?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-9 bg-white/5 border-white/10 rounded-lg focus:bg-white/10 focus:ring-2 focus:ring-[#0553f3]"
            />
          </div>
          
          {/* --- CHANGE 4: Wrap the button in the Dialog component --- */}
          <Dialog open={isSplitModalOpen} onOpenChange={setIsSplitModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-[#0553f3] text-white hover:bg-[#0553f3]/90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Start a New Split
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#080d1b] border-white/10 text-white sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create a New Bill Split</DialogTitle>
                <DialogDescription className="text-white/60">
                  Enter the details below to start a new split with your network via XMTP.
                </DialogDescription>
              </DialogHeader>
              
              {/* This is where your existing XMTP component goes */}
              <div className="py-4">
                <XMTPBillSplitting />
              </div>

              {/* Optional: You can add a footer with a close button if your XMTP component doesn't have one */}
              <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setIsSplitModalOpen(false)}>
                    Close
                  </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </div>
      </CardHeader>
      
      {/* The rest of the user list table remains the same */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-white/5 text-xs font-semibold text-white/40 uppercase tracking-wider">
            <div className="col-span-4">Name</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Last Interaction</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
         <div>
  {filteredNetwork.length === 0 ? (
    <div className="text-white/60 text-center py-4">No matching users found.</div>
  ) : (
    filteredNetwork.map((user) => (
      <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors">
        <div className="col-span-4 flex items-center gap-4">
          <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full" />
          <div>
            <p className="font-medium text-white">{user.name}</p>
            <p className="text-xs text-white/50 font-mono">{user.address}</p>
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex items-center gap-2">
            <user.icon className={`w-4 h-4 ${user.isPositive === true ? 'text-green-400' : user.isPositive === false ? 'text-red-400' : 'text-white/50'}`} />
            <div>
              <p className="text-sm font-medium text-white/90">{user.status}</p>
              {user.isPositive !== null && <p className="text-xs text-white/60">{user.amount}</p>}
            </div>
          </div>
        </div>
        <div className="col-span-3 text-sm text-white/70">{user.lastInteraction}</div>
        <div className="col-span-2 text-right">
          <Button variant="ghost" size="sm" className="text-white/70 hover:bg-white/10 hover:text-white">
            View History
          </Button>
        </div>
      </div>
    ))
  )}
</div>

        </div>
      </CardContent>
    </Card>
  );
}