import { User, TrendingUp, TrendingDown } from 'lucide-react';

// A simple function to get a random avatar placeholder
const getAvatarUrl = (seed: string) => `https://api.dicebear.com/8.x/initials/svg?seed=${seed}`;

export const networkData = [
  {
    id: 1,
    name: 'alice.eth',
    address: '0x1234...abcd',
    avatar: getAvatarUrl('Alice'),
    status: 'Owes you',
    amount: '$15.50',
    isPositive: false,
    lastInteraction: '2024-05-28',
    icon: TrendingDown,
  },
  {
    id: 2,
    name: 'bob.eth',
    address: '0x5678...efgh',
    avatar: getAvatarUrl('Bob'),
    status: 'You owe',
    amount: '$5.00',
    isPositive: true,
    lastInteraction: '2024-05-27',
    icon: TrendingUp,
  },
  {
    id: 3,
    name: 'Charlie',
    address: '0x9abc...ijkl',
    avatar: getAvatarUrl('Charlie'),
    status: 'Settled',
    amount: '$0.00',
    isPositive: null,
    lastInteraction: '2024-05-25',
    icon: User,
  },
  {
    id: 4,
    name: 'diana.eth',
    address: '0xdef0...mnop',
    avatar: getAvatarUrl('Diana'),
    status: 'Owes you',
    amount: '$42.10',
    isPositive: false,
    lastInteraction: '2024-05-22',
    icon: TrendingDown,
  },
];