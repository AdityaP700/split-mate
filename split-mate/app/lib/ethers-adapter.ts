// src/lib/ethers-adapters.ts

import { type WalletClient } from '@wagmi/core'
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

  // Build an ethers-compatible network object
  const network: providers.Network = {
    chainId: chain.id,
    name: chain.name,
    // ENS registry address (if available on chain config)
    ensAddress: chain.contracts?.ensRegistry?.address,
  }

  // Use the WalletClient's transport (which implements viem's HttpTransport)
  const provider = new providers.Web3Provider(
    // viem HttpTransport is compatible with Web3Provider
    transport as unknown as providers.ExternalProvider,
    network
  )

  // Return the Signer tied to the user's account address
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
