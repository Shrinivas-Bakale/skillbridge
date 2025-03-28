import React from 'react';
import ReactDOM from 'react-dom/client';
import { UNSAFE_NavigationContext as NavigationContext } from 'react-router-dom';
import './styles/global.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Opt-in to React Router v7 features
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <NavigationContext.Provider value={{ future: { v7_startTransition: true, v7_relativeSplatPath: true } }}>
      <App />
    </NavigationContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(); 