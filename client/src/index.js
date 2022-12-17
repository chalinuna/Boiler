import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';
import { Provider } from "react-redux";
import store from './Store/store.js'

import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

export let persisotr = persistStore(store)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(  

  <React.StrictMode>
    <CookiesProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persisotr}>
   <BrowserRouter>
       <App />
     </BrowserRouter>
     </PersistGate>
    </Provider>
    </CookiesProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();