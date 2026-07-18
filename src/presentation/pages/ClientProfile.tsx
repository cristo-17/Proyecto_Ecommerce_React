// src/presentation/pages/ClientProfile.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tabs, Tab } from "@heroui/tabs";
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
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import {
  CreditCard,
  Trash2,
  AlertTriangle,
  Plus,
  Eye,
  Package,
  Shield,
} from "lucide-react";
import type { FormaPago } from "../../domain/models/appCelulares.model";
import { CreditCardDisplay } from "../components/CreditCardDisplay";
import { useAuthStore } from "../../application/store/useAuthStore";

// ==========================================
// MOCK DATA: Tarjetas
// ==========================================
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

// ==========================================
// MOCK DATA: Historial de Pedidos
// ==========================================
type OrderStatus = "Entregado" | "En Camino" | "Procesando";

interface Order {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2026-8923",
    date: "17 Jul 2026",
    total: 1711.0,
    status: "Entregado",
  },
  {
    id: "ORD-2026-9041",
    date: "22 Jul 2026",
    total: 1200.0,
    status: "En Camino",
  },
  {
    id: "ORD-2026-9102",
    date: "25 Jul 2026",
    total: 850.5,
    status: "Procesando",
  },
];

export const ClientProfile = () => {
  // 1. Consumo del Store de Autenticación
  const { user } = useAuthStore();

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
    const value = e.target.value.replace(/\D/g, "");
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formattedValue);
  };

  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "");
    setCardHolder(value.toUpperCase());
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    setExpiryDate(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCvv(value);
  };

  // Helper para asignar colores a los estados de la orden
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Entregado":
        return "success";
      case "En Camino":
        return "warning";
      case "Procesando":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <div className="container mx-auto px-4 max-w-5xl py-12 flex flex-col gap-10 min-h-screen">
      {/* CABECERA */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Perfil de {user?.nombre || "Usuario"}
        </h1>
        <p className="text-default-500 font-light mt-2 tracking-wide text-lg">
          Gestiona tu historial de compras, formas de pago y seguridad.
        </p>
      </div>

      {/* CONTENEDOR DE PESTAÑAS */}
      <Tabs
        aria-label="Opciones de perfil"
        variant="underlined"
        color="default"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-foreground",
          tab: "max-w-fit px-0 h-12",
          tabContent:
            "group-data-[selected=true]:text-foreground text-default-500 font-medium tracking-wide pb-2",
        }}
      >
        {/* PESTAÑA 1: HISTORIAL DE PEDIDOS */}
        <Tab
          key="historial"
          title={
            <div className="flex items-center gap-2">
              <Package size={18} strokeWidth={2} />
              <span>Historial de Pedidos</span>
            </div>
          }
        >
          <div className="pt-6">
            <Card className="bg-content1 shadow-none border border-divider rounded-2xl overflow-hidden">
              <CardBody className="p-0">
                <Table
                  aria-label="Historial de pedidos del cliente"
                  removeWrapper
                  classNames={{
                    th: "bg-default-100 text-default-500 font-semibold tracking-wider text-xs px-8 py-4 border-b border-divider uppercase",
                    td: "px-8 py-5 border-b border-divider last:border-0",
                  }}
                >
                  <TableHeader>
                    <TableColumn>Nº Orden</TableColumn>
                    <TableColumn>Fecha</TableColumn>
                    <TableColumn>Total</TableColumn>
                    <TableColumn>Estado</TableColumn>
                    <TableColumn align="center">Acciones</TableColumn>
                  </TableHeader>
                  <TableBody items={MOCK_ORDERS}>
                    {(order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-default-50 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground tracking-tight">
                          {order.id}
                        </TableCell>
                        <TableCell className="text-default-500 font-light">
                          {order.date}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          $
                          {order.total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={getStatusColor(order.status)}
                            variant="flat"
                            size="sm"
                            className="font-medium tracking-wide"
                          >
                            {order.status}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <Button
                              as={Link}
                              to={`/factura/${order.id}`}
                              variant="light"
                              color="default"
                              size="sm"
                              className="font-medium text-default-500 hover:text-foreground hover:bg-default-100 transition-colors"
                              startContent={<Eye size={16} strokeWidth={1.5} />}
                            >
                              Ver Factura
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          </div>
        </Tab>

        {/* PESTAÑA 2: BILLETERA Y SEGURIDAD */}
        <Tab
          key="billetera"
          title={
            <div className="flex items-center gap-2">
              <Shield size={18} strokeWidth={2} />
              <span>Billetera y Seguridad</span>
            </div>
          }
        >
          <div className="flex flex-col gap-12 pt-8">
            {/* SECCIÓN: MIS FORMAS DE PAGO */}
            <section className="flex flex-col gap-6">
              <div className="flex justify-between items-center border-b border-divider pb-3">
                <h2 className="text-xl font-semibold text-foreground tracking-tight">
                  Mis Formas de Pago
                </h2>
                <Button
                  onPress={() => setIsAddCardOpen(true)}
                  color="default"
                  variant="bordered"
                  size="sm"
                  className="border-divider text-foreground hover:bg-default-50 font-medium transition-colors"
                  startContent={<Plus size={16} strokeWidth={1.5} />}
                >
                  Agregar Tarjeta
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                {cards.length === 0 ? (
                  <p className="text-default-400 font-light text-sm p-4 bg-default-50 rounded-lg border border-divider">
                    No tienes tarjetas registradas.
                  </p>
                ) : (
                  cards.map((card) => (
                    <Card
                      key={card.id}
                      shadow="none"
                      className="bg-content1 border border-divider rounded-xl hover:border-default-400 transition-colors"
                    >
                      <CardBody className="p-6 flex flex-row justify-between items-center">
                        <div className="flex items-center gap-5">
                          <div className="bg-default-50 border border-divider p-3 rounded-full text-default-500">
                            <CreditCard size={22} strokeWidth={1.5} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-foreground tracking-wide">
                              {card.numeroTarjeta}
                            </span>
                            <span className="text-xs font-light text-default-500 uppercase mt-0.5">
                              {card.titular} - Vence: {card.fechaExpiracion}
                            </span>
                          </div>
                        </div>
                        <Button
                          isIconOnly
                          color="danger"
                          variant="light"
                          className="text-default-400 hover:text-danger hover:bg-danger/10 transition-colors"
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
              <div className="border border-danger-200 bg-danger/10 rounded-xl p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-danger flex items-center gap-2 tracking-tight">
                    <AlertTriangle size={20} strokeWidth={1.5} /> Zona Peligrosa
                  </h3>
                  <p className="text-sm font-light text-danger max-w-lg leading-relaxed">
                    Al eliminar tu cuenta perderás el acceso a tu historial de
                    compras, tus preferencias y todas las reseñas que hayas
                    realizado. Esta acción es irreversible.
                  </p>
                </div>
                <Button
                  onPress={() => setIsDeleteAccountOpen(true)}
                  color="danger"
                  variant="flat"
                  className="font-medium bg-danger/20 text-danger hover:bg-danger hover:text-danger-foreground transition-all shadow-none flex-shrink-0"
                >
                  Eliminar mi cuenta
                </Button>
              </div>
            </section>
          </div>
        </Tab>
      </Tabs>

      {/* MODAL: AGREGAR TARJETA */}
      <Modal
        isOpen={isAddCardOpen}
        onOpenChange={() => setIsAddCardOpen(false)}
        classNames={{
          base: "bg-content1",
          header: "border-b border-divider",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          <ModalHeader className="font-semibold text-foreground">
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
                  "border-divider shadow-none hover:border-default-400 focus-within:!border-foreground",
                label: "text-default-500 font-medium text-xs",
                input: "text-foreground",
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
                  "border-divider shadow-none hover:border-default-400 focus-within:!border-foreground",
                label: "text-default-500 font-medium text-xs",
                input: "text-foreground",
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
                    "border-divider shadow-none hover:border-default-400 focus-within:!border-foreground",
                  label: "text-default-500 font-medium text-xs",
                  input: "text-foreground",
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
                    "border-divider shadow-none hover:border-default-400 focus-within:!border-foreground",
                  label: "text-default-500 font-medium text-xs",
                  input: "text-foreground",
                }}
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              className="font-medium text-default-500 hover:text-foreground"
              onPress={() => setIsAddCardOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="default"
              className="font-medium bg-foreground text-background shadow-none"
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
          base: "bg-content1",
          header: "border-b border-divider",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          <ModalHeader className="text-danger font-semibold flex items-center gap-2">
            <AlertTriangle size={20} strokeWidth={1.5} /> Eliminar Cuenta
          </ModalHeader>
          <ModalBody className="py-6">
            <p className="text-default-500 text-sm font-light leading-relaxed">
              ¿Estás completamente seguro de que deseas eliminar tu cuenta de
              forma permanente? No podremos recuperar tus datos una vez
              confirmes.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              className="font-medium text-default-500 hover:text-foreground"
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
