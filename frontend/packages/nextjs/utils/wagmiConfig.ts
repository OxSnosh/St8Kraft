// utils/wagmiConfig.ts
import { createConfig, http } from 'wagmi';
import { sepolia, localhost } from 'wagmi/chains';

export const wagmiConfig = createConfig({
  chains: [localhost, sepolia],
  transports: {
    [localhost.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(),
  },
  ssr: true,
});
