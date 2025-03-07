import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './styles/variables.css';

// Render without StrictMode to prevent double renders
ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);
