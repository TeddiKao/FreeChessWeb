import { createRoot } from "react-dom/client"
import { StrictMode } from "react"
import App from "@app/App"

createRoot(document.getElementById('root')!)!.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
