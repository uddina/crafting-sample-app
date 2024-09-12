import { createContext, ReactNode, useContext } from "react";
import { createConfig, http, useClient, WagmiProvider as WagmiConfig } from "wagmi";
import { immutableZkEvmTestnet } from "wagmi/chains";
import { injected } from "wagmi/connectors";

// create the Wagmi config for Immutable zkEVM Testnet
export const config = createConfig({
  chains: [immutableZkEvmTestnet],
  connectors: [injected()],
  transports: {
    [immutableZkEvmTestnet.id]: http(),
  },
});

const WagmiContext = createContext<{ config: typeof config }>({
  config,
});

export function WagmiProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiContext.Provider value={{ config }}>
      <WagmiConfig config={config}>{children}</WagmiConfig>;
    </WagmiContext.Provider>
  );
}

export function useWagmiProvider() {
  const { config } = useContext(WagmiContext);
  return {
    config,
  };
}
