import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Home from './HomePage'
import { MantineProvider } from '@mantine/core';
import { QueryClient as QCC, QueryClientProvider as QCCP } from 'react-query';
import { QueryClient as QC, QueryClientProvider as QCP } from '@tanstack/react-query';

const queryClient = new QCC();

const queryClient2 = new QC();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QCCP client={queryClient}>
      <QCP client={queryClient2}>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Home />
        </MantineProvider>
      </QCP>
    </QCCP>
  </React.StrictMode>
);