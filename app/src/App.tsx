import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import sdk from '@farcaster/frame-sdk';
import HomePage from './pages/HomePage';
import DeployPage from './pages/DeployPage';
import SuccessPage from './pages/SuccessPage';
import './styles/tailwind.css';

function App() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        await Promise.race([
          sdk.actions.ready(),
          new Promise((resolve) => setTimeout(resolve, 1500)) // fallback
        ]);
        setIsReady(true);
        await sdk.actions.addMiniApp();
      } catch (err) {
        console.error('Farcaster SDK init error:', err);
        setIsReady(true); // ainda assim deixa o app prosseguir
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
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/deploy" element={<DeployPage />} />
        <Route path="/success" element={<SuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
