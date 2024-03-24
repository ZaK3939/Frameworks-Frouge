import { getOwnerAddressFromFid } from "./farcaster";
import { createOrFindEmbeddedWalletForFid } from "@/app/lib/embedded-wallet";
import { airdropTo } from "@/app/lib/nft";

export async function airdropToPrivy(
  fid: number,
  id: number,
): Promise<string | undefined> {
  const ownerAddress = await getOwnerAddressFromFid(fid);
  if (!ownerAddress) return undefined;

  // Generate an embedded wallet associated with the fid
  const embeddedWalletAddress = await createOrFindEmbeddedWalletForFid(
    fid,
    ownerAddress,
  );
  if (!embeddedWalletAddress) return undefined;
  const tx = await airdropTo(embeddedWalletAddress, id);
  return tx;
}
