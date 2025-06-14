// src/wagmiConfig.ts
import { createConfig } from 'wagmi';
import { base } from 'wagmi/chains';
import { http } from 'wagmi';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

export const wagmiConfig = createConfig({
  chains: [base],  // poderia trocar por sua rede HyperEVM quando estiver registrada
  transports: {
    [base.id]: http(),
  },
  connectors: [farcasterFrame()],
  // removidos: autoConnect, publicClient, configureChains...
});
