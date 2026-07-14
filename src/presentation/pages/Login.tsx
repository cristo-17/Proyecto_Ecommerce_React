// src/presentation/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

// 1. Mock Data (Alineado con el diccionario de roles: ADMIN, PROVEEDOR, CLIENTE)
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

// 2. Esquema de Validación Estricto (Zod)
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
      // Delay simulado para efecto de carga
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Búsqueda en datos locales
      const userFound = MOCK_USERS.find(
        (u) => u.email === data.email && u.password === data.password,
      );

      if (userFound) {
        // Guardamos en localStorage
        localStorage.setItem("auth_token", `simulated_token_${userFound.id}`);
        localStorage.setItem("user_role", userFound.rol);
        localStorage.setItem("user_name", userFound.nombre);

        // Redirección estricta y limpia
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
    } catch {
      setAuthError("Ocurrió un error inesperado. Inténtalo nuevamente.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 p-4 font-sans">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-sm w-full max-w-md border border-zinc-200/60">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-zinc-900 mb-3 tracking-tight">
            AppCelulares
          </h1>
          <p className="text-zinc-500 text-sm font-light tracking-wide">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {authError && (
          <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium text-center border border-red-100">
            {authError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            {...register("email")}
            type="email"
            label="Correo Electrónico"
            placeholder="ejemplo@correo.com"
            variant="bordered"
            isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            fullWidth
            classNames={{
              inputWrapper:
                "border-zinc-200 bg-white shadow-none hover:border-zinc-300 focus-within:!border-zinc-900 transition-colors",
              label: "text-zinc-500 font-medium text-xs",
              input: "text-zinc-900 placeholder:text-zinc-400",
              errorMessage: "text-red-500 text-xs font-medium mt-1",
            }}
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
            classNames={{
              inputWrapper:
                "border-zinc-200 bg-white shadow-none hover:border-zinc-300 focus-within:!border-zinc-900 transition-colors",
              label: "text-zinc-500 font-medium text-xs",
              input: "text-zinc-900 placeholder:text-zinc-400",
              errorMessage: "text-red-500 text-xs font-medium mt-1",
            }}
          />

          <Button
            type="submit"
            color="default"
            variant="solid"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            className="w-full h-12 font-medium bg-zinc-900 text-white hover:bg-zinc-800 shadow-none mt-4 transition-colors"
          >
            {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-4">
          <a
            href="#"
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
          >
            ¿Olvidaste tu contraseña?
          </a>
          <p className="text-xs text-zinc-400 font-light leading-relaxed border-t border-zinc-100 pt-6">
            Credenciales de prueba: admin@test.com / proveedor@test.com
            <br />
            Pass: password123
          </p>
        </div>
      </div>
    </div>
  );
};
