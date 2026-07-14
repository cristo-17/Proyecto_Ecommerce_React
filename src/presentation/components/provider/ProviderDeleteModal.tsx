// src/presentation/components/provider/ProviderDeleteModal.tsx
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { AlertTriangle } from "lucide-react";

interface ProviderDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ProviderDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
}: ProviderDeleteModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="sm"
      backdrop="blur"
      classNames={{
        base: "bg-white rounded-2xl shadow-sm border border-zinc-200/60",
        header: "border-b border-zinc-100 py-4 px-6",
        body: "py-6 px-6",
        footer: "border-t border-zinc-100 py-4 px-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex gap-3 items-center text-zinc-900 font-semibold text-lg tracking-tight">
          <div className="p-2 bg-red-50 rounded-full text-red-600">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          <p className="text-zinc-500 font-light text-sm leading-relaxed tracking-wide">
            ¿Estás seguro de que deseas eliminar este celular? Esta acción
            también borrará todas sus reseñas y{" "}
            <strong className="font-semibold text-zinc-700">
              no se puede deshacer
            </strong>
            .
          </p>
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
            color="danger"
            onPress={onConfirm}
            className="font-medium bg-red-600 text-white hover:bg-red-700 shadow-none px-6 transition-colors"
          >
            Sí, Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
