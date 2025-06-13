import { ReactNode } from 'react';

export interface WalletDropdownLinkProps {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}

export interface WalletDropdownDisconnectProps {
  className?: string;
}