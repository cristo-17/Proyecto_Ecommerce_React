// src/presentation/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { RolUsuario } from "../../domain/models/appCelulares.model";

// 1. Esquema de Validación Estricto (Zod)
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es obligatorio")
    .email("Formato de correo inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

// Inferimos el tipo TypeScript directamente del esquema
type LoginFormData = z.infer<typeof loginSchema>;

// 2. Mock Data: Semilla temporal de usuarios para pruebas
const MOCK_USERS = [
  {
    id: "usr-001",
    email: "admin@test.com",
    password: "password123",
    rol: "ADMIN" as RolUsuario,
    nombre: "Administrador Principal",
  },
  {
    id: "usr-002",
    email: "vendedor@test.com",
    password: "password123",
    rol: "VENDEDOR" as RolUsuario,
    nombre: "Juan Vendedor",
  },
  {
    id: "usr-003",
    email: "cliente@test.com",
    password: "password123",
    rol: "CLIENTE" as RolUsuario,
    nombre: "Cliente Frecuente",
  },
];

export const Login = () => {
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  // 3. Configuración de react-hook-form con Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched", // Valida cuando el usuario sale del input
  });

  // 4. Lógica de Autenticación y Ruteo Dinámico
  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);

    // Simulamos un pequeño delay de red
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Búsqueda estricta en nuestra semilla de datos
    const userFound = MOCK_USERS.find(
      (u) => u.email === data.email && u.password === data.password,
    );

    if (userFound) {
      // Guardamos la sesión temporal
      localStorage.setItem("auth_token", `simulated_token_${userFound.id}`);
      localStorage.setItem("user_role", userFound.rol);

      // Redirección basada en el rol del dominio
      switch (userFound.rol) {
        case "ADMIN":
          navigate("/dashboard"); // Panel principal de administración
          break;
        case "PROVEEDOR":
          navigate("/admin/proveedores"); // Área de gestión permitida para proveedores
          break;
        case "CLIENTE":
        default:
          navigate("/checkout"); // Área privada del cliente
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

        {/* Alerta de Error General */}
        {authError && (
          <div className="mb-6 p-3 bg-danger-50 text-danger-600 rounded-lg text-sm font-medium text-center border border-danger-200">
            {authError}
          </div>
        )}

        {/* 5. Integración del Formulario con HeroUI */}
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
            classNames={{
              inputWrapper: "bg-default-50 hover:bg-default-100",
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
              inputWrapper: "bg-default-50 hover:bg-default-100",
            }}
          />

          <Button
            type="submit"
            color="primary"
            variant="solid"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            className="font-semibold shadow-md"
          >
            {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
          </Button>
        </form>
      </div>
    </div>
  );
};
