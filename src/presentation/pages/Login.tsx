// src/presentation/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { httpClient } from "../../infrastructure/api/httpClient";

// 1. Esquema de Validación Estricto (Zod)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    
    try {
      // Llamada real al backend de Spring Boot (http://localhost:8080/api/auth/login)
      const response = await httpClient.post("/auth/login", data);
      
      // Extraemos los datos reales que envía Java
      const { token, rol, nombre } = response.data;

      // Guardamos en localStorage (Tu ProtectedRoute usará esto)
      localStorage.setItem("auth_token", token);
      localStorage.setItem("user_role", rol);
      localStorage.setItem("user_name", nombre);

      // Redirección estricta basada en el rol real
      switch (rol) {
        case "ADMIN":
        case "PROVEEDOR":
          navigate("/dashboard"); 
          break;
        case "CLIENTE":
        default:
          navigate("/"); 
          break;
      }
        } catch {
      // Si Spring Boot devuelve 401 (No autorizado), mostramos el error visual
      setAuthError(
        "Credenciales incorrectas. Verifica tu correo o contraseña."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-default-100 p-4">
      <div className="bg-background p-8 rounded-xl shadow-lg w-full max-w-md border border-default-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">AppCelulares</h1>
          <p className="text-default-500 text-sm">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {authError && (
          <div className="mb-6 p-3 bg-danger-50 text-danger-600 rounded-lg text-sm font-medium text-center border border-danger-200">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            {...register("email")}
            type="email"
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            variant="bordered"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            fullWidth
          />

          <Input
            {...register("password")}
            type="password"
            label="Contraseña"
            placeholder="********"
            variant="bordered"
            isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
            fullWidth
          />

          <Button
            type="submit"
            color="primary"
            variant="solid"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
          >
            {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-default-400">
            Credenciales reales (Base de Datos): admin@test.com
            <br />
            Pass: 123456
          </p>
        </div>
      </div>
    </div>
  );
};