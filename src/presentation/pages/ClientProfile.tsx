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
import { CreditCardDisplay } from "../components/CreditCardDisplay";

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

  // Estados locales para la tarjeta interactiva
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleConfirmDeleteAccount = () => {
    alert("Cuenta eliminada exitosamente. Redirigiendo al inicio...");
    setIsDeleteAccountOpen(false);
    // Aquí va la lógica real de logout y redirección
  };

  // --- MANEJADORES DE INPUT CON MÁSCARAS NATIVAS ---

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Elimina todo lo que no sea número
    const value = e.target.value.replace(/\D/g, "");
    // Agrega un espacio cada 4 dígitos
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
  };

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Permite solo letras (con acentos) y espacios
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setCardHolder(value.toUpperCase());
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Elimina todo lo que no sea número
    let value = e.target.value.replace(/\D/g, "");
    // Inserta la barra "/" después de los primeros 2 dígitos
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Elimina todo lo que no sea número
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value);
  };

  return (
    <div className="container mx-auto px-4 max-w-4xl py-12 flex flex-col gap-12 bg-white min-h-screen">
      {/* CABECERA */}
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 tracking-tight">
          Mi Perfil
        </h1>
        <p className="text-zinc-500 font-light mt-2 tracking-wide">
          Gestiona tus preferencias, formas de pago y seguridad.
        </p>
      </div>

      {/* SECCIÓN: MIS FORMAS DE PAGO */}
      <section className="flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
          <h2 className="text-xl font-semibold text-zinc-900 tracking-tight">
            Mis Formas de Pago
          </h2>
          <Button
            onPress={() => setIsAddCardOpen(true)}
            color="default"
            variant="bordered"
            size="sm"
            className="border-zinc-200 text-zinc-900 hover:bg-zinc-50 font-medium transition-colors"
            startContent={<Plus size={16} strokeWidth={1.5} />}
          >
            Agregar Tarjeta
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
          {cards.length === 0 ? (
            <p className="text-zinc-400 font-light text-sm p-4 bg-zinc-50/50 rounded-lg border border-zinc-100">
              No tienes tarjetas registradas.
            </p>
          ) : (
            cards.map((card) => (
              <Card
                key={card.id}
                shadow="none"
                className="bg-white border border-zinc-200/60 rounded-xl hover:border-zinc-300 transition-colors"
              >
                <CardBody className="p-6 flex flex-row justify-between items-center">
                  <div className="flex items-center gap-5">
                    <div className="bg-zinc-50 border border-zinc-100 p-3 rounded-full text-zinc-600">
                      <CreditCard size={22} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-zinc-900 tracking-wide">
                        {card.numeroTarjeta}
                      </span>
                      <span className="text-xs font-light text-zinc-500 uppercase mt-0.5">
                        {card.titular} - Vence: {card.fechaExpiracion}
                      </span>
                    </div>
                  </div>
                  <Button
                    isIconOnly
                    color="danger"
                    variant="light"
                    className="text-zinc-400 hover:text-danger hover:bg-red-50 transition-colors"
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <Trash2 size={18} strokeWidth={1.5} />
                  </Button>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* SECCIÓN: ZONA PELIGROSA */}
      <section className="mt-4">
        <div className="border border-red-200 bg-red-50/50 rounded-xl p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-red-700 flex items-center gap-2 tracking-tight">
              <AlertTriangle size={20} strokeWidth={1.5} /> Zona Peligrosa
            </h3>
            <p className="text-sm font-light text-red-700/80 max-w-lg leading-relaxed">
              Al eliminar tu cuenta perderás el acceso a tu historial de
              compras, tus preferencias y todas las reseñas que hayas realizado.
              Esta acción es irreversible.
            </p>
          </div>
          <Button
            onPress={() => setIsDeleteAccountOpen(true)}
            color="danger"
            variant="flat"
            className="font-medium bg-red-100 text-red-700 hover:bg-red-600 hover:text-white transition-all shadow-none flex-shrink-0"
          >
            Eliminar mi cuenta
          </Button>
        </div>
      </section>

      {/* MODAL: AGREGAR TARJETA */}
      <Modal
        isOpen={isAddCardOpen}
        onOpenChange={() => setIsAddCardOpen(false)}
        classNames={{
          base: "bg-white",
          header: "border-b border-zinc-100",
          footer: "border-t border-zinc-100",
        }}
      >
        <ModalContent>
          <ModalHeader className="font-semibold text-zinc-900">
            Agregar Nueva Tarjeta
          </ModalHeader>
          <ModalBody className="flex flex-col gap-5 py-6">
            <div className="flex justify-center mb-4">
              <CreditCardDisplay
                cardNumber={cardNumber}
                cardHolder={cardHolder}
                expiryDate={expiryDate}
                cvv={cvv}
                isFlipped={isFlipped}
              />
            </div>
            <Input
              label="Número de Tarjeta"
              placeholder="0000 0000 0000 0000"
              variant="bordered"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              classNames={{
                inputWrapper:
                  "border-zinc-200 shadow-none hover:border-zinc-300 focus-within:!border-zinc-900",
                label: "text-zinc-500 font-medium text-xs",
                input: "text-zinc-900",
              }}
            />
            <Input
              label="Titular de la Tarjeta"
              placeholder="Ej. Juan Pérez"
              variant="bordered"
              value={cardHolder}
              onChange={handleCardHolderChange}
              maxLength={30}
              classNames={{
                inputWrapper:
                  "border-zinc-200 shadow-none hover:border-zinc-300 focus-within:!border-zinc-900",
                label: "text-zinc-500 font-medium text-xs",
                input: "text-zinc-900",
              }}
            />
            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Fecha de Expiración"
                placeholder="MM/YY"
                variant="bordered"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                maxLength={5}
                classNames={{
                  inputWrapper:
                    "border-zinc-200 shadow-none hover:border-zinc-300 focus-within:!border-zinc-900",
                  label: "text-zinc-500 font-medium text-xs",
                  input: "text-zinc-900",
                }}
              />
              <Input
                label="CVC"
                placeholder="123"
                variant="bordered"
                type="password"
                value={cvv}
                onChange={handleCvvChange}
                maxLength={4}
                onFocus={() => setIsFlipped(true)}
                onBlur={() => setIsFlipped(false)}
                classNames={{
                  inputWrapper:
                    "border-zinc-200 shadow-none hover:border-zinc-300 focus-within:!border-zinc-900",
                  label: "text-zinc-500 font-medium text-xs",
                  input: "text-zinc-900",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              className="font-medium text-zinc-500 hover:text-zinc-900"
              onPress={() => setIsAddCardOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="default"
              className="font-medium bg-zinc-900 text-white shadow-none"
              onPress={() => setIsAddCardOpen(false)}
            >
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
        classNames={{
          base: "bg-white",
          header: "border-b border-zinc-100",
          footer: "border-t border-zinc-100",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-red-600 font-semibold flex items-center gap-2">
            <AlertTriangle size={20} strokeWidth={1.5} /> Eliminar Cuenta
          </ModalHeader>
          <ModalBody className="py-6">
            <p className="text-zinc-600 text-sm font-light leading-relaxed">
              ¿Estás completamente seguro de que deseas eliminar tu cuenta de
              forma permanente? No podremos recuperar tus datos una vez
              confirmes.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              className="font-medium text-zinc-500 hover:text-zinc-900"
              onPress={() => setIsDeleteAccountOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmDeleteAccount}
              className="font-medium shadow-none"
            >
              Sí, eliminar cuenta
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};
