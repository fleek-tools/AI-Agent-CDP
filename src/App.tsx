import { RainbowKitProvider, ConnectButton } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'viem/chains';
import ChatInterface from './components/ChatInterface';
import '@rainbow-me/rainbowkit/styles.css';

const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">CDP Agent Demo</h1>
                  <p className="text-sm text-gray-500">xAI Powered Blockchain Assistant</p>
                </div>
                <ConnectButton />
              </div>
            </header>
            <main className="max-w-7xl mx-auto py-6 px-4">
              <ChatInterface />
            </main>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}