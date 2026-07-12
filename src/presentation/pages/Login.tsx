// src/presentation/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

// 1. Esquema de Validación Estricto (Zod)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type LoginFormData = z.infer<typeof loginSchema>;

// 2. Mock Data (Alineado con el diccionario de roles: ADMIN, PROVEEDOR, CLIENTE)
const MOCK_USERS = [
  {
    id: "usr-001",
    email: "admin@test.com",
    password: "password123",
    rol: "ADMIN",
    nombre: "Administrador Principal",
  },
  {
    id: "usr-002",
    email: "proveedor@test.com",
    password: "password123",
    rol: "PROVEEDOR",
    nombre: "Samsung Global",
  },
  {
    id: "usr-003",
    email: "cliente@test.com",
    password: "password123",
    rol: "CLIENTE",
    nombre: "Cliente Frecuente",
  },
];

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
    await new Promise((resolve) => setTimeout(resolve, 800)); // Delay simulado

    const userFound = MOCK_USERS.find(
      (u) => u.email === data.email && u.password === data.password,
    );

    if (userFound) {
      localStorage.setItem("auth_token", `simulated_token_${userFound.id}`);
      localStorage.setItem("user_role", userFound.rol);

      // BUG 1 CORREGIDO: Redirección estricta y limpia
      switch (userFound.rol) {
        case "ADMIN":
        case "PROVEEDOR":
          navigate("/dashboard"); // Redirige a la zona privada de gestión
          break;
        case "CLIENTE":
        default:
          navigate("/"); // Redirige a la tienda para seguir comprando
          break;
      }
    } else {
      setAuthError(
        "Credenciales incorrectas. Verifica tu correo o contraseña.",
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
            Credenciales: admin@test.com / proveedor@test.com
            <br />
            Pass: password123
          </p>
        </div>
      </div>
    </div>
  );
};
