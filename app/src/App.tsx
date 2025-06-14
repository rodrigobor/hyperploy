import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import sdk from '@farcaster/frame-sdk';
import HomePage from './pages/HomePage';
import DeployPage from './pages/DeployPage';
import SuccessPage from './pages/SuccessPage';
import './styles/tailwind.css';

import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from './wagmiConfig';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.race([
          sdk.actions.ready({ disableNativeGestures: true }),
          new Promise(resolve => setTimeout(resolve, 1500))
        ]);
        await sdk.actions.addMiniApp();
      } catch (err) {
        console.error('Farcaster SDK init error:', err);
      } finally {
        setShowSplash(false);
      }
    };
    initialize();
  }, []);

  if (showSplash) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <img src="/hyperploy-logo.png" alt="Loading..." className="w-20 h-20" />
      </div>
    );
  }

  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/deploy" element={<DeployPage />} />
            <Route path="/success" element={<SuccessPage />} />
          </Routes>
        </Router>
      </QueryClientProvider>
    </WagmiConfig>
  );
}

export default App;
