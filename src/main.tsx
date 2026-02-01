import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

// Register service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("ServiceWorker registered:", registration);
      })
      .catch((error) => {
        console.log("ServiceWorker registration failed:", error);
      });
  });
}

// Prevent default touch behaviors
document.addEventListener(
  "touchmove",
  (e) => {
    if ((e as any).scale !== 1) {
      e.preventDefault();
    }
  },
  { passive: false }
);

// Prevent context menu on long press
document.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
