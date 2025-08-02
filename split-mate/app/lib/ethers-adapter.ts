// src/lib/ethers-adapters.ts

import type { WalletClient } from 'viem';
import { providers } from 'ethers'
import { type HttpTransport } from 'viem'

/**
 * Converts a Wagmi WalletClient into an Ethers.js Signer.
 *
 * @param walletClient - The WalletClient instance from @wagmi/core
 * @returns An ethers.js Signer for sending transactions and signing messages
 */
export function walletClientToSigner(walletClient: WalletClient): providers.JsonRpcSigner {
  const { account, chain, transport } = walletClient

  // Ensure required fields are available
  if (!chain) {
    throw new Error("walletClient.chain is undefined. Ensure wallet is connected.");
  }

  if (!account) {
    throw new Error("walletClient.account is undefined. Ensure wallet is connected.");
  }

  const network: providers.Network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  const provider = new providers.Web3Provider(
    transport as unknown as providers.ExternalProvider,
    network
  )

  return provider.getSigner(account.address)
}

/**
 * Example: If you also have a viem PublicClient and want to wrap it:
 *
 * import { type PublicClient } from 'viem'
 *
 * export function publicClientToProvider(publicClient: PublicClient<HttpTransport>) {
 *   return new providers.Web3Provider(
 *     publicClient.transport as unknown as providers.ExternalProvider,
 *     {
 *       chainId: publicClient.chain.id,
 *       name: publicClient.chain.name,
 *       ensAddress: publicClient.chain.contracts?.ensRegistry?.address,
 *     }
 *   )
 * }
 */
