import React, { Component, ErrorInfo } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorFallback from './ErrorFallback';
import './index.css';

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: any }> {
  state = { error: null };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any, info: ErrorInfo) {
    console.error('Erro capturado no ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
