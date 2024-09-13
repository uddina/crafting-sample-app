import { passport, x } from '@imtbl/sdk';
import { providers } from 'ethers';
import jwtDecode from 'jwt-decode';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useImmutableProvider } from '.';

export type PassportState = {
  authenticated: boolean;
  zkEvmRegistered: boolean;
  ready: boolean;
};

type DecodedAccessToken = {
  imx_eth_address?: string;
  imx_stark_address?: string;
  imx_user_admin_address?: string;
  zkevm_eth_address?: string;
  zkevm_user_admin_address?: string;
};

const PassportContext = createContext<{
  logout: () => void;
  loginCallback: () => void;
  triggerLogin: () => void;
  userInfo?: passport.UserProfile;
  passportState: PassportState;
  walletAddress?: string;
  zkEvmProvider?: providers.Web3Provider;
}>({
  loginCallback: () => undefined,
  triggerLogin: () => undefined,
  logout: () => undefined,
  passportState: {
    authenticated: false,
    zkEvmRegistered: false,
    ready: false,
  },
});

export function PassportProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [provider, setProvider] = useState<x.IMXProvider | undefined>();
  const [zkEvmProvider, setZkEvmProvider] = useState<
    providers.Web3Provider | undefined
  >();
  const [userInfo, setUserInfo] = useState<passport.UserProfile>();
  const [walletAddress, setWalletAddress] = useState<string>();
  const [userProfile, setUserProfile] = useState<passport.UserProfile | null>();
  const [passportState, setPassportState] = useState<PassportState>({
    authenticated: false,
    zkEvmRegistered: false,
    ready: false,
  });
  const immutableProvider = useImmutableProvider();
  const { passportClient } = immutableProvider;

  const triggerLogin = useCallback(async () => {
    setUserProfile(await passportClient.login());
  }, [passportClient]);

  const logout = useCallback(async () => {
    try {
      await passportClient.logout();
    } catch (e) {
      console.error('Logout error', e);
    }
    setUserProfile(undefined);
    setUserInfo(undefined);
    setWalletAddress(undefined);
    setPassportState({
      authenticated: false,
      zkEvmRegistered: false,
      ready: true,
    });
  }, [passportClient]);

  const loginCallback = useCallback(
    async () => passportClient.loginCallback(),
    [passportClient],
  );

  const getImxProvider = async () => {
    let passportProvider = provider;
    if (!passportProvider) {
      passportProvider = await passportClient.connectImx();
      setProvider(passportProvider);
    }
    return passportProvider;
  };

  // Check if a session exists on first initialisation
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setZkEvmProvider(
          new providers.Web3Provider(passportClient.connectEvm()),
        );
        const profile = await passportClient.getUserInfo();
        if (profile) {
          setUserProfile(profile);
        } else {
          setPassportState({
            authenticated: false,
            zkEvmRegistered: false,
            ready: true,
          });
        }
      } catch (e) {
        // Likely due to invalid refresh token, force a re-auth
        await logout();
      }
    };
    fetchUser();
  }, [logout, passportClient]);

  // Handle userProfile set
  useEffect(() => {
    const authenticate = async () => {
      if (!userProfile) return;

      try {
        const idToken = await passportClient.getIdToken();
        const accessToken = await passportClient.getAccessToken();
        if (!!accessToken && !!idToken) {
          let imxProvider = await getImxProvider();

          // Currently no way to get this immediately from the SDK post login so we decode the access token for speed
          const decodedAccessToken = jwtDecode<DecodedAccessToken>(accessToken);
          const zkEvmRegistered =
            !!decodedAccessToken.zkevm_eth_address &&
            !!decodedAccessToken.zkevm_user_admin_address;

          if (zkEvmRegistered) {
            setWalletAddress(await imxProvider.getAddress());
          }
          setUserInfo(userProfile);
          setPassportState({
            authenticated: true,
            zkEvmRegistered: zkEvmRegistered,
            ready: true,
          });
        } else {
          // Invalid session, no access or id token
          await logout();
        }
      } catch (error) {
        console.error({ error });
        await logout();
      }
    };
    authenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfile]);

  // Register off chain if necessary and get wallet address
  useEffect(() => {
    // Track registration state so that the last one to complete correctly sets the passportState
    let zkEvmRegistered = passportState.zkEvmRegistered;

    if (passportState.authenticated) {
      const registerZkEvm = async () => {
        try {
          const passportProvider = passportClient.connectEvm();
          if (!passportState.zkEvmRegistered) {
            await passportProvider.request({
              method: 'eth_requestAccounts',
            });
            zkEvmRegistered = true;
            setPassportState({
              authenticated: true,
              zkEvmRegistered: zkEvmRegistered,
              ready: true,
            });
          }
        } catch (error) {
          console.log(error, 'passportRegistration', { network: 'zkEVM' });
        }
      };

      registerZkEvm();
    }
    // Only trigger this hook on authentication changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passportState.authenticated]);

  const providerValues = useMemo(
    () => ({
      loginCallback,
      logout,
      triggerLogin,
      userInfo,
      walletAddress,
      passportState,
      zkEvmProvider,
    }),
    [
      loginCallback,
      logout,
      triggerLogin,
      userInfo,
      walletAddress,
      passportState,
      zkEvmProvider,
    ],
  );

  return (
    <PassportContext.Provider value={providerValues}>
      {children}
    </PassportContext.Provider>
  );
}

export function usePassportProvider() {
  const {
    loginCallback,
    triggerLogin,
    logout,
    userInfo,
    walletAddress,
    passportState,
    zkEvmProvider,
  } = useContext(PassportContext);
  return {
    loginCallback,
    triggerLogin,
    logout,
    userInfo,
    walletAddress,
    passportState,
    zkEvmProvider,
  };
}
