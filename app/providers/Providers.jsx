// app/providers/providers.jsx
"use client";

import { Toaster } from "sonner";
import AuthSessionProvider from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import { CartProvider } from "../components/context/CartContext";
import { ToastContainer } from "react-toastify";

export function Providers({ children }) {
  return (
    <AuthSessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>{children}</CartProvider>

        <ToastContainer position="bottom-right" />
      </ThemeProvider>
      {/* Wrap other providers inside if needed */}
    </AuthSessionProvider>
  );
}
