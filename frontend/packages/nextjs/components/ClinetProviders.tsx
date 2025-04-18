// app/ClientProviders.tsx (or wherever you're wrapping layout)

'use client';

import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { ApolloProvider } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { wagmiConfig } from '~~/utils/wagmiConfig';
import { client as apolloClient } from '~~/lib/apolloClient';
import { ScaffoldEthAppWithProviders } from '~~/components/ScaffoldEthAppWithProviders';
import { ThemeProvider } from '~~/components/ThemeProvider';

const queryClient = new QueryClient();

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider>
          <ApolloProvider client={apolloClient}>
            <ThemeProvider enableSystem={true}>
              <ScaffoldEthAppWithProviders>
                {children}
              </ScaffoldEthAppWithProviders>
            </ThemeProvider>
          </ApolloProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}
