import { ArrowUpRight, ArrowDownLeft, CheckCircle, Clock } from 'lucide-react';

const getAvatarUrl = (seed: string) => `https://api.dicebear.com/8.x/initials/svg?seed=${seed}`;

export const historyData = [
  {
    id: 'txn_1',
    description: 'Dinner at The Nook',
    person: { name: 'alice.eth', avatar: getAvatarUrl('Alice') },
    date: '2024-05-28T18:30:00Z',
    amount: 15.50,
    status: 'You Paid', // You paid for them, they owe you
  },
  {
    id: 'txn_2',
    description: 'Movie Tickets',
    person: { name: 'bob.eth', avatar: getAvatarUrl('Bob') },
    date: '2024-05-27T20:00:00Z',
    amount: 5.00,
    status: 'They Paid', // They paid for you, you owe them
  },
  {
    id: 'txn_3',
    description: 'Coffee Run',
    person: { name: 'Charlie', avatar: getAvatarUrl('Charlie') },
    date: '2024-05-25T10:00:00Z',
    amount: 8.75,
    status: 'Paid Back', // A settled transaction
  },
  {
    id: 'txn_4',
    description: 'Concert Tickets',
    person: { name: 'diana.eth', avatar: getAvatarUrl('Diana') },
    date: '2024-05-22T19:00:00Z',
    amount: 42.10,
    status: 'You Paid',
  },
    {
    id: 'txn_5',
    description: 'Groceries',
    person: { name: 'eve.eth', avatar: getAvatarUrl('Eve') },
    date: '2024-05-20T12:00:00Z',
    amount: 22.40,
    status: 'Pending', // A request sent but not yet paid
  },
];