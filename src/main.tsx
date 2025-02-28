import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { registerSW } from "virtual:pwa-register";

// Importación de estilos de PrimeReact
import "primereact/resources/themes/lara-dark-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

// Registro del Service Worker para PWA
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("Nueva versión disponible. Recarga la página para actualizar.");
  },
  onOfflineReady() {
    console.log("La PWA está lista para usarse sin conexión.");
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
