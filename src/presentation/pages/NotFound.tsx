// src/presentation/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-primary drop-shadow-sm">404</h1>
        <h2 className="text-3xl font-bold mt-4 text-foreground">Página no encontrada</h2>
        <p className="text-default-500 mt-2 mb-8 max-w-md mx-auto">
          Lo sentimos, la ruta a la que intentas acceder no existe, ha sido movida o no tienes los permisos necesarios.
        </p>
        
        <Button 
          as={Link} 
          to="/" 
          color="primary" 
          variant="shadow" 
          size="lg"
          className="font-semibold"
        >
          Regresar al Inicio
        </Button>
      </div>
    </div>
  );
};