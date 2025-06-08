import { useCallback } from "react";
import { Avatar, Name } from "@coinbase/onchainkit/identity";
import {
  Transaction,
  TransactionButton,
  TransactionSponsor,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import type { LifecycleStatus } from "@coinbase/onchainkit/transaction";
import { Wallet, ConnectWallet } from "@coinbase/onchainkit/wallet";
import { useAccount } from "wagmi";
import { calls } from "../utils/calls";

export default function TransactionComponent() {
  const { address } = useAccount();
  // console.log("TransactionComponent address", address);
  // console.log("Chain ID:", process.env.NEXT_PUBLIC_CHAIN_ID);
  const handleOnStatus = useCallback((status: LifecycleStatus) => {
    console.log("LifecycleStatus", status);
  }, []);
  // console.log("calls: ", calls);

  return address ? (
    <Transaction
      chainId={parseInt(process.env.NEXT_PUBLIC_CHAIN_ID ?? "84532")}
      calls={calls}
      onStatus={handleOnStatus}
    >
      <TransactionButton />
      <TransactionSponsor />
      <TransactionStatus>
        <TransactionStatusLabel />
        <TransactionStatusAction />
      </TransactionStatus>
    </Transaction>
  ) : (
    <Wallet>
      <ConnectWallet>
        <Avatar className="h-6 w-6" />
        <Name />
      </ConnectWallet>
    </Wallet>
  );
}
