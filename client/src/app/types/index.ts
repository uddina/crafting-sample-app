export type Recipe = {
  id: number;
  name: string;
  required_inputs: number;
}

export type NFT = {
  tokenId: string;
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
