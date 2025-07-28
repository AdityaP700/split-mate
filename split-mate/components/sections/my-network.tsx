'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Plus, Search, TrendingUp, TrendingDown, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import XMTPBillSplitting from '@/components/XMTPBill';

// Simplified type (matches your first version)
type NetworkUser = {
  id: string;
  name: string;
  address: string;
  status: 'Owes you' | 'You owe' | 'Settled';
  amount: string;
  lastInteraction: string;
};


// Helper to determine icon and color
const getStatusAttributes = (status: string) => {
  if (status === 'Owes you') return { Icon: TrendingDown, color: 'text-red-400' };
  if (status === 'You owe') return { Icon: TrendingUp, color: 'text-green-400' };
  return { Icon: User, color: 'text-white/50' };
};

export default function MyNetwork({ network }: { network: NetworkUser[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);

   const filteredNetwork = (network || []).filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.address.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <Card className="w-full bg-white/5 border border-white/10 shadow-lg shadow-black/20 rounded-xl">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between p-6 border-b border-white/5">
        <div>
          <CardTitle className="text-xl text-white">My Network</CardTitle>
          <CardDescription className="text-sm text-white/60 mt-1">
            Manage your connections and past splits.
          </CardDescription>
        </div>

        {/* Search + Split Button */}
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

          <Dialog open={isSplitModalOpen} onOpenChange={setIsSplitModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#0553f3] text-white hover:bg-[#0553f3]/90 flex items-center gap-2">
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

              <div className="py-4">
                <XMTPBillSplitting onBillCreated={() => {}} />
              </div>

              <DialogFooter>
                <Button variant="secondary" onClick={() => setIsSplitModalOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      {/* Network Table */}
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
              <div className="text-white/60 text-center py-8">No matching users found.</div>
            ) : (
              filteredNetwork.map((user) => {
                const { Icon, color } = getStatusAttributes(user.status);
                return (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-white/5 last:border-b-0 hover:bg-white/5 transition-colors"
                  >
                    {/* Name */}
                    <div className="col-span-4 flex items-center gap-4">
                      <Image
                        src={`https://api.dicebear.com/8.x/initials/png?seed=${user.name}`}
                        alt={user.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-white/50 font-mono">
                          {`${user.address.slice(0, 6)}...${user.address.slice(-4)}`}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-3">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-4 h-4 ${color}`} />
                        <div>
                          <p className={`text-sm font-medium ${color}`}>{user.status}</p>
                          {user.status !== 'Settled' && (
                            <p className="text-xs text-white/60">{user.amount}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Last Interaction */}
                    <div className="col-span-3 text-sm text-white/70">{user.lastInteraction}</div>

                    {/* Action */}
                    <div className="col-span-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white/70 hover:bg-white/10 hover:text-white"
                      >
                        View History
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
