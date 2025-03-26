import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primeicons/primeicons.css';
import { PrimeReactProvider } from 'primereact/api';
import 'primeflex/primeflex.css';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import './index.css';
import './flags.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import myStore, { persistor } from './store/store';
import { PersistGate } from 'redux-persist/integration/react';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <Provider store={myStore}> 
   <PersistGate loading={null} persistor={persistor}>
  <BrowserRouter>
    <PrimeReactProvider>
        <App />
    </PrimeReactProvider>
  </BrowserRouter>
  </PersistGate>
 </Provider>
 </React.StrictMode>

);
