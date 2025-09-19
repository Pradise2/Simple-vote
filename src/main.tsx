
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';


// 1. Import necessary modules from wagmi and Reown
import { WagmiProvider, createConfig, http } from 'wagmi';
// highlight-next-line
import { base } from 'wagmi/chains'; // Import 'base' instead of 'sepolia'
import { ReownProvider, injected, walletConnect, coinbaseWallet } from '@reown/react';

// 2. Configure Wagmi to connect to the Base mainnet
const wagmiConfig = createConfig({
// highlight-start
chains: [base],
transports: {
[base.id]: http(),
},
// highlight-end
});

// 3. Configure Reown with desired wallet connectors
const reownConfig = {
connectors: [
injected(),
walletConnect({
projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // TODO: Get a project ID from WalletConnect Cloud
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
{/* 4. Wrap the App with the providers */}
<WagmiProvider config={wagmiConfig}>
<ReownProvider config={reownConfig}>
<App />
</ReownProvider>
</WagmiProvider>
</React.StrictMode>,
);
