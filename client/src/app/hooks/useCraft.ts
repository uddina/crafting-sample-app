import { useConnect, useWriteContract } from "wagmi";
import { GuardedMulticaller2Abi, ImmutableERC721Abi } from "@imtbl/contracts";
import { Address, Collection, CraftResult } from "../types";
import { usePassportProvider } from "@/context";

type Call = {
  target: `0x${string}`;
  functionSignature: string;
  data: `0x${string}`;
};

type ExecuteArgs = {
  multicallSigner: `0x${string}`;
  reference: `0x${string}`;
  calls: Call[];
  deadline: bigint;
  signature: `0x${string}`;
};

export function useSubmitCraft(): {
  submitCraft: (recipeId: number, inputs: number[]) => Promise<CraftResult>;
} {
  const { passportState, walletAddress } = usePassportProvider();

  const submitCraft = async (recipeId: number, inputs: number[]): Promise<CraftResult> => {
    if (!passportState.authenticated || !walletAddress) {
      throw new Error("User is not authenticated");
    }
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/craft/${recipeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        player_address: walletAddress,
        inputs: inputs,
      }),
    });
    const data = await res.json();
    const calls = data.calls.map((call: { target: any; functionSignature: any; data: any; }) => ({
      target: call.target,
      functionSignature: call.functionSignature,
      data: call.data,
    }))
    return {
      multicallerAddress: data.multicallerAddress,
      multicallSigner: data.multicallSigner,
      reference: data.reference,
      calls: calls,
      deadline: data.deadline,
      signature: data.signature,
    };
  };

  return {
    submitCraft,
  };
}

export function useCraftTx(): {
  sendCraftTx: ({
    multicallerAddress,
    executeArgs,
  }: {
    multicallerAddress: Address;
    executeArgs: ExecuteArgs;
  }) => Promise<void>;
  reset: () => void;
  isPending: boolean;
  data: `0x${string}` | undefined;
  error: any;
} {
  const { data, error, isPending, reset, writeContractAsync } = useWriteContract();
  const { connectors } = useConnect();

  const sendCraftTx = async ({
    multicallerAddress,
    executeArgs,
  }: {
    multicallerAddress: Address;
    executeArgs: ExecuteArgs;
  }) => {
    if (isPending) return;
    const passportConnector = connectors.find(
      (connector) => connector.id === "com.immutable.passport"
    );
    if (!passportConnector) {
      throw new Error("Passport connector not found");
    }
    reset();
    console.log("Sending craft tx", executeArgs, multicallerAddress);
    await writeContractAsync(
      {
        connector: passportConnector,
        abi: GuardedMulticaller2Abi,
        address: multicallerAddress,
        functionName: "execute",
        args: [
          executeArgs.multicallSigner,
          executeArgs.reference,
          executeArgs.calls,
          executeArgs.deadline,
          executeArgs.signature,
        ],
      },
      {
        onError: (err) => {
          console.error("Error sending craft tx", err);
        },
      }
    );
  };

  return {
    sendCraftTx,
    reset,
    isPending,
    data,
    error,
  };
}

export function useSetApprovalAllTx(): {
  setApprovalForAll: ({
    collection,
    operator,
  }: {
    collection: Collection;
    operator: Address;
  }) => Promise<void>;
  reset: () => void;
  isPending: boolean;
  data: `0x${string}` | undefined;
  error: any;
} {
  const { data, error, isPending, reset, writeContractAsync } = useWriteContract();
  const { connectors } = useConnect();

  const setApprovalForAll = async ({
    collection,
    operator,
  }: {
    collection: Collection;
    operator: Address;
  }) => {
    if (isPending) return;
    const passportConnector = connectors.find(
      (connector) => connector.id === "com.immutable.passport"
    );
    if (!passportConnector) {
      throw new Error("Passport connector not found");
    }
    reset();
    await writeContractAsync({
      connector: passportConnector,
      abi: ImmutableERC721Abi,
      address: collection.address,
      functionName: "setApprovalForAll",
      args: [operator, true],
    });
  };

  return {
    setApprovalForAll,
    reset,
    isPending,
    data,
    error,
  };
}
