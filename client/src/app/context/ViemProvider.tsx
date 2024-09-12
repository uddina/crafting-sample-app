import { createContext, ReactNode, useContext } from "react";
import { immutableZkEvmTestnet } from "wagmi/chains";
import { http, PublicClient, createPublicClient } from "viem";

const client = createPublicClient({
  chain: immutableZkEvmTestnet,
  transport: http(),
});

const ViemContext = createContext<{ client: PublicClient }>({
  client,
});

export function ViemProvider({ children }: { children: ReactNode }) {
  return <ViemContext.Provider value={{ client }}>{children}</ViemContext.Provider>;
}

export function useViemProvider() {
  const { client } = useContext(ViemContext);
  return {
    client,
  };
}
