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

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="4xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="text-2xl font-bold">
          {productToEdit ? "Editar Equipo" : "Publicar Nuevo Equipo"}
        </ModalHeader>
        <ModalBody>
          <form
            id="product-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preview de Imagen y URL */}
              <div className="flex flex-col gap-4">
                <div className="w-full h-64 bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                  {watchedImageUrl ? (
                    <Image
                      src={watchedImageUrl}
                      className="object-contain w-full h-full"
                      radius="none"
                    />
                  ) : (
                    <span className="text-gray-400 font-medium">
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
                />
              </div>

              {/* Datos del Producto */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 h-max">
                <h3 className="md:col-span-2 font-bold text-gray-800 border-b pb-2">
                  Datos Generales
                </h3>

                <Input
                  {...register("marca", { required: "Requerido" })}
                  label="Marca"
                  placeholder="Ej. Samsung"
                  variant="bordered"
                  isInvalid={!!errors.marca}
                  errorMessage={errors.marca?.message}
                />
                <Input
                  {...register("modelo", { required: "Requerido" })}
                  label="Modelo"
                  placeholder="Ej. Galaxy S24"
                  variant="bordered"
                  isInvalid={!!errors.modelo}
                  errorMessage={errors.modelo?.message}
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
                />

                <h3 className="md:col-span-2 font-bold text-gray-800 border-b pb-2 mt-2">
                  Especificaciones Técnicas
                </h3>

                <Input
                  {...register("especificaciones.ram", {
                    required: "Requerido",
                  })}
                  label="Memoria RAM"
                  variant="bordered"
                  isInvalid={!!errors.especificaciones?.ram}
                />
                <Input
                  {...register("especificaciones.almacenamiento", {
                    required: "Requerido",
                  })}
                  label="Almacenamiento"
                  variant="bordered"
                  isInvalid={!!errors.especificaciones?.almacenamiento}
                />
                <Input
                  {...register("especificaciones.pantalla", {
                    required: "Requerido",
                  })}
                  label="Pantalla"
                  variant="bordered"
                  isInvalid={!!errors.especificaciones?.pantalla}
                />
                <Input
                  {...register("especificaciones.procesador", {
                    required: "Requerido",
                  })}
                  label="Procesador"
                  variant="bordered"
                  isInvalid={!!errors.especificaciones?.procesador}
                />
                <Input
                  {...register("especificaciones.camaraPrincipal", {
                    required: "Requerido",
                  })}
                  label="Cámara Principal"
                  variant="bordered"
                  isInvalid={!!errors.especificaciones?.camaraPrincipal}
                />
                <Input
                  {...register("especificaciones.bateria", {
                    required: "Requerido",
                  })}
                  label="Batería"
                  variant="bordered"
                  isInvalid={!!errors.especificaciones?.bateria}
                />
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter className="border-t border-gray-100">
          <Button color="danger" variant="light" onPress={onClose}>
            Cancelar
          </Button>
          <Button
            color="primary"
            type="submit"
            form="product-form"
            className="font-bold"
          >
            {productToEdit ? "Guardar Cambios" : "Publicar Equipo"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
