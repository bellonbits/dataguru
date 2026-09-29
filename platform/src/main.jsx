import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import Root from './Root.jsx';
import { AuthProvider } from './lib/auth.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode><HashRouter><AuthProvider><Root /></AuthProvider></HashRouter></React.StrictMode>
);
