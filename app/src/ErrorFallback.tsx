// app/src/ErrorFallback.tsx
import React from 'react';

type Props = {
  error: any;
};

export default function ErrorFallback({ error }: Props) {
  return (
    <div style={{ backgroundColor: 'black', color: 'white', padding: '20px' }}>
      <h1>Erro no Mini App</h1>
      <pre>{error?.toString()}</pre>
    </div>
  );
}
