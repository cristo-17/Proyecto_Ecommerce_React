// src/presentation/router/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HeroUIProvider } from "@heroui/system"; 
import { AppRouter } from './App';
import '../../index.css'; // Archivo base de Tailwind v4

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HeroUIProvider>
      <AppRouter />
    </HeroUIProvider>
  </StrictMode>
);