import { config, passport, x, blockchainData } from '@imtbl/sdk';
import { createContext, useContext, useMemo } from 'react';

type Environment = 'prod' | 'sandbox' | 'dev';

type PassportConfig = {
  audience: 'platform_api';
  clientId: string;
  logoutMode?: 'redirect' | 'silent';
  logoutRedirectUri: string;
  redirectUri: string;
  scope: string;
  overrides?: any;
};

const getCoreSdkConfig = (environment: Environment) => {
  switch (environment) {
    case 'prod': {
      return x.imxClientConfig({ environment: x.Environment.PRODUCTION });
    }
    case 'sandbox': {
      return x.imxClientConfig({ environment: x.Environment.SANDBOX });
    }
    case 'dev': {
      return {
        baseConfig: new config.ImmutableConfiguration({
          environment: x.Environment.SANDBOX,
        }),
        overrides: {
          immutableXConfig: x.createConfig({
            basePath: 'https://api.dev.x.immutable.com',
            chainID: 5,
            coreContractAddress: '0xd05323731807A35599BF9798a1DE15e89d6D6eF1',
            registrationContractAddress:
              '0x7EB840223a3b1E0e8D54bF8A6cd83df5AFfC88B2',
          }),
        },
      };
    }
    default: {
      throw new Error(`Invalid environment: "${environment}"`);
    }
  }
};

const getPassportConfig = (environment: Environment) => {
  var passportConfig: PassportConfig = {
    logoutMode: 'redirect',
    audience: 'platform_api',
    scope: 'openid email offline_access transact',
    clientId: process.env.NEXT_PUBLIC_PASSPORT_CLIENT_ID!,
    logoutRedirectUri: process.env.NEXT_PUBLIC_PASSPORT_LOGOUT_REDIRECT_URI!,
    redirectUri: process.env.NEXT_PUBLIC_PASSPORT_REDIRECT_URI!,
  };

  switch (environment) {
    case 'prod': {
      return {
        baseConfig: new config.ImmutableConfiguration({
          environment: config.Environment.PRODUCTION,
        }),
        ...passportConfig,
      };
    }
    case 'sandbox': {
      return {
        baseConfig: new config.ImmutableConfiguration({
          environment: config.Environment.SANDBOX,
        }),
        ...passportConfig,
      };
    }
    default: {
      throw new Error('Invalid environment');
    }
  }
};

const getBlockchainData = () => {
  switch (process.env.NEXT_PUBLIC_ENV) {
    case 'prod': {
      return new blockchainData.BlockchainData({
        baseConfig: {
          environment: config.Environment.PRODUCTION,
        }
      });
    }
    case 'sandbox': {
      return new blockchainData.BlockchainData({
        baseConfig: {
          environment: config.Environment.SANDBOX,
        }
      });
    }
    case 'dev': {
      return new blockchainData.BlockchainData({
        baseConfig: {
          environment: config.Environment.SANDBOX,
        }
      });
    }
    default: {
      throw new Error('Invalid environment');
    }
  }
}

const ImmutableContext = createContext<{
  passportClient: passport.Passport;
  coreSdkClient: x.ImmutableX;
  blockchainDataClient: blockchainData.BlockchainData;
  environment: Environment;
} | null>(null);

export function ImmutableProvider({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const providerValues = useMemo(() => {
    const environment = process.env.NEXT_PUBLIC_ENV as Environment;
    const passportClient = new passport.Passport(
      getPassportConfig(environment)
    );
    const coreSdkClient = new x.ImmutableX(getCoreSdkConfig(environment));
    const blockchainDataClient = getBlockchainData();
    return {
      passportClient,
      coreSdkClient,
      blockchainDataClient,
      environment,
    };
  }, []);

  return (
    <ImmutableContext.Provider value={providerValues}>
      {children}
    </ImmutableContext.Provider>
  );
}

export function useImmutableProvider() {
  const ctx = useContext(ImmutableContext);
  if (!ctx)
    throw new Error(
      'useImmutableProvider must be used within a ImmutableProvider'
    );
  return ctx;
}
