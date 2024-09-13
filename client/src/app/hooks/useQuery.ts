import { useQuery } from "@tanstack/react-query";
import { Address, Collection, NFT, Recipe } from "../types";
import { useImmutableProvider, usePassportProvider } from "@/app/context";
import { ImmutableERC1155Abi } from "@imtbl/contracts";
import { Contract } from "ethers";

const serverURL = process.env.NEXT_PUBLIC_SERVER_URL;

export function useCollectionQuery(): {
  data: Collection | undefined;
  error: any;
  isLoading: boolean;
} {
  return useQuery<any, any, Collection, any>({
    queryKey: ["collection"],
    queryFn: async () => {
      const response = await fetch(`${serverURL}/collection`);
      return response.json();
    },
    select: (data) =>
      <Collection>{
        address: data.address,
      },
  });
}

export function useRecipesQuery(): {
  data: Recipe[] | undefined;
  error: any;
  isLoading: boolean;
} {
  return useQuery<any, any, Recipe[], any>({
    queryKey: ["recipes"],
    queryFn: async () => {
      const response = await fetch(`${serverURL}/recipes`);
      return response.json();
    },
    select: (data) =>
      data.map(
        (recipe: any) =>
          <Recipe>{
            id: recipe.id,
            name: recipe.name,
            inputs: recipe.inputs,
            outputs: recipe.outputs,
          }
      ),
  });
}

export function useCollectionItemsQuery({
  collection,
  owner,
}: {
  collection: Address;
  owner: Address | undefined;
}): {
  data: NFT[] | undefined;
  error: any;
  isLoading: boolean;
} {
  const { blockchainDataClient } = useImmutableProvider();

  return useQuery<any, any, NFT[], any>({
    queryKey: ["collection_items"],
    refetchInterval: 1000 * 2,
    enabled: !!owner && !!collection,
    queryFn: async () =>
      blockchainDataClient.listNFTsByAccountAddress({
        chainName: "imtbl-zkevm-testnet",
        accountAddress: owner!,
        contractAddress: collection,
      }),
    select: (data) =>
      data.result.map(
        (nft: any) =>
          <NFT>{
            tokenId: nft.token_id,
            value: nft.balance,
          }
      ),
  });
}

export function useApprovalQuery(): {
  getIsApprovedForAll: ({
    collection,
    operator,
  }: {
    collection: Collection;
    operator: Address;
  }) => Promise<boolean>;
} {
  const { web3Provider, walletAddress } = usePassportProvider();

  const getIsApprovedForAll = async ({
    collection,
    operator,
  }: {
    collection: Collection;
    operator: Address;
  }): Promise<boolean> => {
    if (!walletAddress) {
      throw new Error("User is not authenticated");
    }
    const contract = new Contract(
      collection.address as string,
      ImmutableERC1155Abi,
      web3Provider?.getSigner()
    );
    const res = await contract.isApprovedForAll(walletAddress as `0x${string}`, operator);
    return res;
  };

  return {
    getIsApprovedForAll,
  };
}
