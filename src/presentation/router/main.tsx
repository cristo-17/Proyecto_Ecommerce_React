// src/presentation/router/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HeroUIProvider } from "@heroui/system";
import { AppRouter } from "./App";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import "../../index.css"; // Archivo base de Tailwind v4

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HeroUIProvider>
      <NextThemesProvider attribute="class" defaultTheme="light">
        <AppRouter />
      </NextThemesProvider>
    </HeroUIProvider>
  </StrictMode>,
);
