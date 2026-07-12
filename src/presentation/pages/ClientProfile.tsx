// src/presentation/pages/ClientProfile.tsx
import { useState } from "react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { CreditCard, Trash2, AlertTriangle, Plus } from "lucide-react";
import type { FormaPago } from "../../domain/models/appCelulares.model";

// Mock Data de Tarjetas
const MOCK_CARDS: FormaPago[] = [
  {
    id: "card-1",
    usuarioId: "usr-003",
    numeroTarjeta: "**** **** **** 4242",
    titular: "Cliente Frecuente",
    fechaExpiracion: "12/28",
  },
  {
    id: "card-2",
    usuarioId: "usr-003",
    numeroTarjeta: "**** **** **** 8899",
    titular: "Cliente Frecuente",
    fechaExpiracion: "05/27",
  },
];

export const ClientProfile = () => {
  const [cards, setCards] = useState<FormaPago[]>(MOCK_CARDS);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleConfirmDeleteAccount = () => {
    alert("Cuenta eliminada exitosamente. Redirigiendo al inicio...");
    setIsDeleteAccountOpen(false);
    // Aquí va la lógica real de logout y redirección
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl py-8 flex flex-col gap-10">
      {/* CABECERA */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
        <p className="text-gray-500 mt-1">
          Gestiona tus preferencias, formas de pago y seguridad.
        </p>
      </div>

      {/* SECCIÓN: MIS FORMAS DE PAGO */}
      <section className="flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-gray-200 pb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Mis Formas de Pago
          </h2>
          <Button
            onPress={() => setIsAddCardOpen(true)}
            color="primary"
            variant="flat"
            size="sm"
            startContent={<Plus size={16} />}
          >
            Agregar Tarjeta
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
          {cards.length === 0 ? (
            <p className="text-gray-500 italic text-sm">
              No tienes tarjetas registradas.
            </p>
          ) : (
            cards.map((card) => (
              <Card
                key={card.id}
                className="bg-white border border-gray-100 shadow-sm"
              >
                <CardBody className="p-5 flex flex-row justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-50 p-3 rounded-full text-primary">
                      <CreditCard size={24} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800 tracking-wider">
                        {card.numeroTarjeta}
                      </span>
                      <span className="text-xs text-gray-500 uppercase">
                        {card.titular} - Vence: {card.fechaExpiracion}
                      </span>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 size={18} />
                  </Button>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* SECCIÓN: ZONA PELIGROSA */}
      <section className="mt-8">
        <div className="border-2 border-danger-200 bg-danger-50 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-danger-700 flex items-center gap-2">
              <AlertTriangle size={20} /> Zona Peligrosa
            </h3>
            <p className="text-sm text-danger-600/80 max-w-lg">
              Al eliminar tu cuenta perderás el acceso a tu historial de
              compras, tus preferencias y todas las reseñas que hayas realizado.
              Esta acción es irreversible.
            </p>
          </div>
          <Button
            onPress={() => setIsDeleteAccountOpen(true)}
            color="danger"
            className="font-bold shadow-md flex-shrink-0"
          >
            Eliminar mi cuenta
          </Button>
        </div>
      </section>

      {/* MODAL: AGREGAR TARJETA */}
      <Modal
        isOpen={isAddCardOpen}
        onOpenChange={() => setIsAddCardOpen(false)}
      >
        <ModalContent>
          <ModalHeader className="font-bold">Agregar Nueva Tarjeta</ModalHeader>
          <ModalBody className="flex flex-col gap-4 pb-6">
            <Input
              label="Número de Tarjeta"
              placeholder="0000 0000 0000 0000"
              variant="bordered"
            />
            <Input
              label="Titular de la Tarjeta"
              placeholder="Ej. Juan Pérez"
              variant="bordered"
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Fecha de Expiración"
                placeholder="MM/YY"
                variant="bordered"
              />
              <Input
                label="CVC"
                placeholder="123"
                variant="bordered"
                type="password"
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setIsAddCardOpen(false)}
            >
              Cancelar
            </Button>
            <Button color="primary" onPress={() => setIsAddCardOpen(false)}>
              Guardar Tarjeta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL: CONFIRMACIÓN ELIMINAR CUENTA */}
      <Modal
        isOpen={isDeleteAccountOpen}
        onOpenChange={() => setIsDeleteAccountOpen(false)}
        size="sm"
      >
        <ModalContent>
          <ModalHeader className="text-danger font-bold flex items-center gap-2">
            <AlertTriangle size={20} /> Eliminar Cuenta
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-600 text-sm leading-relaxed">
              ¿Estás completamente seguro de que deseas eliminar tu cuenta de
              forma permanente? No podremos recuperar tus datos una vez
              confirmes.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setIsDeleteAccountOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmDeleteAccount}
              className="font-bold"
            >
              Sí, eliminar cuenta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
