import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// 1. Import necessary modules
import { WagmiProvider, createConfig, http } from 'wagmi';
import { sepolia } from 'wagmi/chains'; // Use Sepolia testnet
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReownProvider, injected, walletConnect, coinbaseWallet } from '@reown/react';
import { BrowserRouter } from 'react-router-dom';

// 2. Setup QueryClient for React Query
const queryClient = new QueryClient();

// 3. Configure Wagmi
const wagmiConfig = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

// 4. Get WalletConnect Project ID from environment variables
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;
if (!walletConnectProjectId) {
    throw new Error("VITE_WALLETCONNECT_PROJECT_ID is not set. Please add it to your .env file");
}

// 5. Configure Reown
const reownConfig = {
  connectors: [
    injected(),
    walletConnect({
      projectId: walletConnectProjectId,
      metadata: {
        name: 'Decentralized Voting DApp',
        description: 'A simple and secure voting application on the blockchain.',
        url: window.location.host,
        icons: ['']
      }
    }),
    coinbaseWallet({
      appName: 'Decentralized Voting DApp',
    }),
  ],
};


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 6. Wrap the App with all necessary providers */}
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
          <ReownProvider config={reownConfig}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </ReownProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
);
