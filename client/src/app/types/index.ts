export type Recipe = {
  id: number;
  name: string;
  inputs: NFT[];
  outputs: NFT[];
}

export type NFT = {
  tokenId: string;
  value: string;
}

export const nftToName = (nft: NFT): string => {
  switch (nft.tokenId.toString()) {
    case '1':
      return 'Wood';
    case '2':
      return 'Metal';
    case '3':
      return 'Spear';
    default:
      return 'Unknown';
  }
}

export type Call = {
  target: `0x${string}`;
  functionSignature: string;
  data: `0x${string}`;
}

export type CraftResult = {
  multicallerAddress: `0x${string}`;
  multicallSigner: `0x${string}`;
  reference: `0x${string}`;
  calls: Call[];
  deadline: number;
  signature: `0x${string}`;
}

export type Address = `0x${string}`

export type Collection = {
  address: Address;
}
