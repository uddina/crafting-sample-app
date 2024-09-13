import { config, passport } from "@imtbl/sdk";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { createContext } from "react";
import { providers } from "ethers";

export const passportInstance = new passport.Passport({
  baseConfig: {
    environment: config.Environment.SANDBOX,
    publishableKey: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY ?? "", // replace with your publishable API key from Hub
  },
  clientId: process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID ?? "CLIENT_ID", // replace with your client ID from Hub
  redirectUri: process.env.NEXT_PUBLIC_PASSPORT_REDIRECT_URI ?? "REDIRECT_URI", // replace with one of your redirect URIs from Hub
  logoutRedirectUri: process.env.NEXT_PUBLIC_PASSPORT_LOGOUT_REDIRECT_URI ?? "LOGOUT_REDIRECT_URI", // replace with one of your logout URIs from Hub
  audience: "platform_api",
  scope: "openid offline_access email transact",
  popupOverlayOptions: {
    disableGenericPopupOverlay: false, // Set to true to disable the generic pop-up overlay
    disableBlockedPopupOverlay: false, // Set to true to disable the blocked pop-up overlay
  },
});

const PassportContext = createContext<{
  web3Provider: providers.Web3Provider | undefined;
  walletAddress: string | undefined;
  client: passport.Passport;
  login: () => Promise<void>;
}>({
  web3Provider: undefined,
  walletAddress: undefined,
  client: passportInstance,
  login: async () => {},
});

export function PassportProvider({ children }: { children: React.ReactNode }) {
  const [web3Provider, setWeb3Provider] = useState<providers.Web3Provider | undefined>();
  const [walletAddress, setWalletAddress] = useState<string>();

  const login = async () => {
    await passportInstance.login();
    const web3Provider = new providers.Web3Provider(passportInstance.connectEvm());
    setWeb3Provider(web3Provider);
    const accounts = await web3Provider?.provider?.request({ method: "eth_requestAccounts" });
    setWalletAddress(accounts[0]);
  };

  const values = useMemo(
    () => ({ web3Provider, walletAddress, client: passportInstance, login }),
    [web3Provider, walletAddress, login]
  );

  return <PassportContext.Provider value={values}>{children}</PassportContext.Provider>;
}

export function usePassportProvider() {
  return useContext(PassportContext);
}
