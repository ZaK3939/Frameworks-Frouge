import { createWalletClient, encodeFunctionData, http } from "viem";
import { mnemonicToAccount } from "viem/accounts";
import { optimismSepolia } from "viem/chains";

const NFT_WALLET_MNEMONIC = process.env.NFT_WALLET_MNEMONIC as string;
const PRIVY_COLLECTION_NFT_ADDRESS = process.env
  .PRIVY_COLLECTION_NFT_ADDRESS as `0x${string}`; // Optimism Sepolia Testnet

const MINT_ABI = {
  inputs: [
    { internalType: "address", name: "to", type: "address" },
    { internalType: "uint256", name: "tokenId", type: "uint256" },
  ],
  name: "mint",
  outputs: [],
  stateMutability: "nonpayable",
  type: "function",
};

export const airdropTo = async (recipient: `0x${string}`, id: number) => {
  try {
    const client = createWalletClient({
      chain: optimismSepolia,
      transport: process.env.OPTIMISM_SEPOLIA_RPC
        ? http(`${process.env.OPTIMISM_SEPOLIA_RPC}`)
        : http(),
    });
    const account = mnemonicToAccount(NFT_WALLET_MNEMONIC);

    console.log(
      `Minting NFT (${PRIVY_COLLECTION_NFT_ADDRESS}) for`,
      recipient,
      "with ID",
      id,
    );
    const tx = await client.sendTransaction({
      account: account,
      to: PRIVY_COLLECTION_NFT_ADDRESS,
      data: encodeFunctionData({
        abi: [MINT_ABI],
        functionName: "mint",
        args: [recipient, id],
      }),
    });
    return tx;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
