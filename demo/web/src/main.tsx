import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GrantPolishProvider } from "./hooks/GrantPolishContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GrantPolishProvider>
      <App />
    </GrantPolishProvider>
  </StrictMode>,
);
