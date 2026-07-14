// src/presentation/components/provider/ProviderProductModal.tsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import type { Product } from "../../../domain/models/appCelulares.model";

interface ProviderProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  onSave: (data: Product) => void;
}

export const ProviderProductModal = ({
  isOpen,
  onClose,
  productToEdit,
  onSave,
}: ProviderProductModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Product>();

  // Sincronización de datos del producto a editar con el formulario
  useEffect(() => {
    if (productToEdit && isOpen) {
      reset(productToEdit);
    } else if (isOpen) {
      reset({
        marca: "",
        modelo: "",
        precio: 0,
        stock: 0,
        imagenUrl: "",
        especificaciones: {
          ram: "",
          almacenamiento: "",
          pantalla: "",
          procesador: "",
          camaraPrincipal: "",
          bateria: "",
        },
      });
    }
  }, [productToEdit, isOpen, reset]);

  const watchedImageUrl = watch("imagenUrl");

  const onSubmit = (data: Product) => {
    // Conversiones de tipo para asegurar que numéricos lleguen como numbers
    data.precio = Number(data.precio);
    data.stock = Number(data.stock);
    onSave(data);
  };

  // Clases compartidas para los Inputs minimalistas
  const inputMinimalistClasses = {
    inputWrapper:
      "border-zinc-200 bg-white shadow-none hover:border-zinc-300 focus-within:!border-zinc-900 transition-colors",
    label: "text-zinc-500 font-medium text-xs",
    input: "text-zinc-900 placeholder:text-zinc-400",
    errorMessage: "text-red-500 text-xs font-medium mt-1",
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      scrollBehavior="inside"
      backdrop="blur"
      classNames={{
        base: "bg-white rounded-2xl shadow-sm border border-zinc-200/60",
        header: "border-b border-zinc-100 py-5 px-8",
        body: "py-6 px-8",
        footer: "border-t border-zinc-100 py-5 px-8",
      }}
    >
      <ModalContent>
        <ModalHeader className="text-xl font-bold text-zinc-900 tracking-tight">
          {productToEdit ? "Editar Equipo" : "Publicar Nuevo Equipo"}
        </ModalHeader>
        <ModalBody>
          <form
            id="product-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Preview de Imagen y URL */}
              <div className="flex flex-col gap-5">
                <div className="w-full h-64 bg-zinc-50 rounded-xl border border-dashed border-zinc-300 flex items-center justify-center overflow-hidden p-2">
                  {watchedImageUrl ? (
                    <Image
                      src={watchedImageUrl}
                      className="object-contain w-full h-full mix-blend-multiply"
                      radius="none"
                    />
                  ) : (
                    <span className="text-zinc-400 font-light text-sm tracking-wide">
                      Vista previa de imagen
                    </span>
                  )}
                </div>
                <Input
                  {...register("imagenUrl", { required: "URL requerida" })}
                  label="URL de la Imagen"
                  placeholder="https://..."
                  variant="bordered"
                  isInvalid={!!errors.imagenUrl}
                  errorMessage={errors.imagenUrl?.message}
                  classNames={inputMinimalistClasses}
                />
              </div>

              {/* Datos del Producto */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Bloque: Datos Generales */}
                <div>
                  <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-3 mb-4">
                    Datos Generales
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      {...register("marca", { required: "Requerido" })}
                      label="Marca"
                      placeholder="Ej. Samsung"
                      variant="bordered"
                      isInvalid={!!errors.marca}
                      errorMessage={errors.marca?.message}
                      classNames={inputMinimalistClasses}
                    />
                    <Input
                      {...register("modelo", { required: "Requerido" })}
                      label="Modelo"
                      placeholder="Ej. Galaxy S24"
                      variant="bordered"
                      isInvalid={!!errors.modelo}
                      errorMessage={errors.modelo?.message}
                      classNames={inputMinimalistClasses}
                    />
                    <Input
                      {...register("precio", {
                        required: "Requerido",
                        min: { value: 1, message: "Debe ser mayor a 0" },
                      })}
                      type="number"
                      label="Precio ($)"
                      variant="bordered"
                      isInvalid={!!errors.precio}
                      errorMessage={errors.precio?.message}
                      classNames={inputMinimalistClasses}
                    />
                    <Input
                      {...register("stock", {
                        required: "Requerido",
                        min: { value: 0, message: "No puede ser negativo" },
                      })}
                      type="number"
                      label="Stock"
                      variant="bordered"
                      isInvalid={!!errors.stock}
                      errorMessage={errors.stock?.message}
                      classNames={inputMinimalistClasses}
                    />
                  </div>
                </div>

                {/* Bloque: Especificaciones Técnicas */}
                <div>
                  <h3 className="text-xs font-semibold text-zinc-900 uppercase tracking-widest border-b border-zinc-100 pb-3 mb-4 mt-2">
                    Especificaciones Técnicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Input
                      {...register("especificaciones.ram", {
                        required: "Requerido",
                      })}
                      label="Memoria RAM"
                      variant="bordered"
                      isInvalid={!!errors.especificaciones?.ram}
                      classNames={inputMinimalistClasses}
                    />
                    <Input
                      {...register("especificaciones.almacenamiento", {
                        required: "Requerido",
                      })}
                      label="Almacenamiento"
                      variant="bordered"
                      isInvalid={!!errors.especificaciones?.almacenamiento}
                      classNames={inputMinimalistClasses}
                    />
                    <Input
                      {...register("especificaciones.pantalla", {
                        required: "Requerido",
                      })}
                      label="Pantalla"
                      variant="bordered"
                      isInvalid={!!errors.especificaciones?.pantalla}
                      classNames={inputMinimalistClasses}
                    />
                    <Input
                      {...register("especificaciones.procesador", {
                        required: "Requerido",
                      })}
                      label="Procesador"
                      variant="bordered"
                      isInvalid={!!errors.especificaciones?.procesador}
                      classNames={inputMinimalistClasses}
                    />
                    <Input
                      {...register("especificaciones.camaraPrincipal", {
                        required: "Requerido",
                      })}
                      label="Cámara Principal"
                      variant="bordered"
                      isInvalid={!!errors.especificaciones?.camaraPrincipal}
                      classNames={inputMinimalistClasses}
                    />
                    <Input
                      {...register("especificaciones.bateria", {
                        required: "Requerido",
                      })}
                      label="Batería"
                      variant="bordered"
                      isInvalid={!!errors.especificaciones?.bateria}
                      classNames={inputMinimalistClasses}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            Cancelar
          </Button>
          <Button
            color="default"
            type="submit"
            form="product-form"
            className="font-medium bg-zinc-900 text-white shadow-none hover:bg-zinc-800 transition-colors px-6"
          >
            {productToEdit ? "Guardar Cambios" : "Publicar Equipo"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
