import App from "./App.js"

import { createRoot } from "react-dom/client"
import { StrictMode } from "react"

createRoot(document.getElementById('root')!)!.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
