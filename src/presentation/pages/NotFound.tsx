// src/presentation/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";

export const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 font-sans">
      <div className="text-center flex flex-col items-center">
        {/* 404 Gigante como elemento gráfico de fondo */}
        <h1 className="text-[10rem] md:text-[14rem] leading-none font-extrabold text-default-200 tracking-tighter select-none">
          404
        </h1>

        {/* Título y Subtítulo Minimalistas */}
        <h2 className="text-2xl md:text-3xl font-semibold text-foreground mt-4 tracking-tight">
          Página no encontrada
        </h2>
        <p className="text-default-500 mt-4 mb-10 max-w-md mx-auto font-light leading-relaxed tracking-wide">
          Lo sentimos, la ruta a la que intentas acceder no existe, ha sido
          movida o no tienes los permisos necesarios.
        </p>

        {/* Botón de Retorno Premium */}
        <Button
          as={Link}
          to="/"
          color="default"
          size="lg"
          className="font-medium bg-foreground text-background hover:opacity-80 shadow-none px-8 transition-colors"
          startContent={<ArrowLeft size={18} strokeWidth={1.5} />}
        >
          Regresar al Inicio
        </Button>
      </div>
    </div>
  );
};
