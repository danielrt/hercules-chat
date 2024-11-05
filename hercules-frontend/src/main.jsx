import React from 'react';
import { createRoot } from 'react-dom/client';
import HerculesAPP from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <HerculesAPP />
  </React.StrictMode>
);