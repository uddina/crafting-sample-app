"use client";
import { BiomeCombinedProviders } from "@biom3/react";
import { onDarkBase } from "@biom3/design-tokens";
import { ImmutableProvider, PassportProvider, WagmiProvider } from "../context";
import "./globals.css";
import Layout from "./components/Layout/Layout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <WagmiProvider>
            <ImmutableProvider>
              <PassportProvider>
                <BiomeCombinedProviders skipFontLoad theme={{ base: onDarkBase }}>
                  <Layout>{children}</Layout>
                </BiomeCombinedProviders>
              </PassportProvider>
            </ImmutableProvider>
          </WagmiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}