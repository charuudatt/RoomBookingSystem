import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App.tsx";
import { AuthProvider } from "@/context/AuthContext";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
