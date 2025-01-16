import React from 'react';
import ReactDOM from 'react-dom';
import App from './AppComponent.js';
import { AuthProvider } from './AuthContext';

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
