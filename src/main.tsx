import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App/App.tsx';
import { AuthProvider } from './components/auth/AuthContext.tsx';
import './components/globalStyle.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
