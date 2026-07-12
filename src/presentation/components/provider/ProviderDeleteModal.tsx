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
    <Modal isOpen={isOpen} onOpenChange={onClose} size="sm">
      <ModalContent>
        <ModalHeader className="flex gap-2 items-center text-danger font-bold text-xl">
          <AlertTriangle />
          Confirmar Eliminación
        </ModalHeader>
        <ModalBody>
          <p className="text-gray-600 leading-relaxed">
            ¿Estás seguro de que deseas eliminar este celular? Esta acción
            también borrará sus reseñas y <strong>no se puede deshacer</strong>.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            className="font-medium"
          >
            Cancelar
          </Button>
          <Button
            color="danger"
            onPress={onConfirm}
            className="font-bold shadow-md shadow-danger/20"
          >
            Sí, Eliminar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
