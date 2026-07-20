// src/presentation/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useAuthStore } from "../../application/store/useAuthStore";
import { authService } from "../../infrastructure/services/authService";

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
  const { login } = useAuthStore();

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
      const { token, user } = await authService.login(
        data.email,
        data.password,
      );
      login(user, token);

      switch (user.rol) {
        case "ADMIN":
          navigate("/dashboard");
          break;
        case "PROVEEDOR":
          navigate("/dashboard/inventario");
          break;
        case "CLIENTE":
        default:
          navigate("/");
          break;
      }
    } catch (error: any) {
      setAuthError(error.response?.data?.message || "Credenciales inválidas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-sans relative">
      <div className="bg-content1 p-8 sm:p-10 rounded-2xl shadow-sm w-full max-w-md border border-divider">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-foreground mb-3 tracking-tight">
            AppCelulares
          </h1>
          <p className="text-default-500 text-sm font-light tracking-wide">
            Ingresa a tu cuenta para continuar
          </p>
        </div>

        {authError && (
          <div className="mb-8 p-4 bg-danger/10 text-danger rounded-xl text-sm font-medium text-center border border-danger-200">
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
                "border-divider bg-content1 shadow-none hover:border-default-400 focus-within:!border-foreground transition-colors",
              label: "text-default-500 font-medium text-xs",
              input: "text-foreground placeholder:text-default-400",
              errorMessage: "text-danger text-xs font-medium mt-1",
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
                "border-divider bg-content1 shadow-none hover:border-default-400 focus-within:!border-foreground transition-colors",
              label: "text-default-500 font-medium text-xs",
              input: "text-foreground placeholder:text-default-400",
              errorMessage: "text-danger text-xs font-medium mt-1",
            }}
          />

          <Button
            type="submit"
            color="default"
            variant="solid"
            fullWidth
            size="lg"
            isLoading={isSubmitting}
            className="w-full h-12 font-medium bg-foreground text-background hover:opacity-80 shadow-none mt-4 transition-colors"
          >
            {isSubmitting ? "Verificando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="mt-8 text-center flex flex-col gap-4">
          <a
            href="#"
            className="text-sm text-default-500 hover:text-foreground transition-colors font-medium"
          >
            ¿Olvidaste tu contraseña?
          </a>
          <p className="text-xs text-default-400 font-light leading-relaxed border-t border-divider pt-6">
            Credenciales de prueba: admin@test.com / proveedor@test.com
            <br />
            Pass: password123
          </p>
        </div>
      </div>
    </div>
  );
};
