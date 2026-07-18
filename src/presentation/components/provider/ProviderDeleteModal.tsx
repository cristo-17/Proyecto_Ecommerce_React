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
        base: "bg-content1 rounded-2xl shadow-sm border border-divider",
        header: "border-b border-divider py-4 px-6",
        body: "py-6 px-6",
        footer: "border-t border-divider py-4 px-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex gap-3 items-center text-foreground font-semibold text-lg tracking-tight">
          <div className="p-2 bg-danger/20 rounded-full text-danger">
            <AlertTriangle size={18} strokeWidth={2} />
          </div>
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          <p className="text-default-500 font-light text-sm leading-relaxed tracking-wide">
            ¿Estás seguro de que deseas eliminar este celular? Esta acción
            también borrará todas sus reseñas y{" "}
            <strong className="font-semibold text-foreground">
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
            className="font-medium text-default-500 hover:text-foreground transition-colors"
          >
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            className="font-medium bg-danger text-white hover:bg-danger/80 shadow-none px-6 transition-colors"
          >
            Sí, Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
