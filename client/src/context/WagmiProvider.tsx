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

const WagmiContext = createContext<{ config: typeof config; viemClient: any }>({
  config,
  viemClient: null,
});

export function WagmiProvider({ children }: { children: ReactNode }) {
  const viemClient = useClient({ config });

  return (
    <WagmiContext.Provider value={{ config, viemClient }}>
      <WagmiConfig config={config}>{children}</WagmiConfig>;
    </WagmiContext.Provider>
  );
}

export function useWagmiProvider() {
  const { config, viemClient } = useContext(WagmiContext);
  return {
    config,
    viemClient,
  };
}
