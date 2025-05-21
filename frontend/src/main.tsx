import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/routes/router";
import "@/styles/globals.css";
import { initAuth } from "@/lib/api/auth";

// App wrapper to handle auth initialization
function App() {
  useEffect(() => {
    // Setup auth listener
    const unsubscribe = initAuth();
    
    // Cleanup on unmount
    return () => unsubscribe();
  }, []);
  
  return <RouterProvider router={router} />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
