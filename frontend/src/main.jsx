import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import fonts (Inter is standard, but would typically use Google Fonts link in index.html)
// For now, relying on system Inter or Fallbacks specified in tokens.css

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
