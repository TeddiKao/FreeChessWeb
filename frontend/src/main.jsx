import App from "./App.jsx"

import { createRoot } from "react-dom/client"
import React, { StrictMode } from "react"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
