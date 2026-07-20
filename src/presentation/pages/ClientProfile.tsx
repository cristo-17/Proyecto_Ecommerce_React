// src/presentation/pages/ClientProfile.tsx
import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Alert } from "@heroui/alert"; // <-- Añadido
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
  MapPin,
  Truck,
  CheckCircle,
  ClipboardList,
} from "lucide-react";
import type { FormaPago } from "../../domain/models/appCelulares.model";
import { CreditCardDisplay } from "../components/CreditCardDisplay";
import { useAuthStore } from "../../application/store/useAuthStore";
import {
  orderService,
  type OrderResponse,
} from "../../infrastructure/services/orderService";
import {
  paymentMethodService,
  type PaymentMethod,
} from "../../infrastructure/services/paymentMethodService";
import { httpClient } from "../../infrastructure/api/httpClient";

// Ajustado a los estados reales del backend
const TRACKING_STEPS = [
  { label: "Pendiente", icon: ClipboardList, key: "PENDIENTE" },
  { label: "Procesando", icon: Package, key: "PROCESANDO" },
  { label: "Enviado", icon: Truck, key: "ENVIADO" },
  { label: "Entregado", icon: CheckCircle, key: "ENTREGADO" },
];

export const ClientProfile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Estado global para notificaciones UI (Reemplaza los alert nativos)
  const [notification, setNotification] = useState<{
    message: string;
    type: "danger" | "success";
  } | null>(null);

  const showNotification = (
    message: string,
    type: "danger" | "success" = "danger",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Estados para órdenes
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Estados para tarjetas
  const [cards, setCards] = useState<PaymentMethod[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [cardsError, setCardsError] = useState<string | null>(null);

  // Modal agregar tarjeta
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);

  // Modal eliminar cuenta
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  // Modal rastreo
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(
    null,
  );

  // Cargar órdenes
  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    setOrdersError(null);
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (err: any) {
      setOrdersError(err.response?.data?.message || "Error al cargar pedidos");
    } finally {
      setIsLoadingOrders(false);
    }
  }, []);

  // Cargar tarjetas
  const fetchCards = useCallback(async () => {
    setIsLoadingCards(true);
    setCardsError(null);
    try {
      const data = await paymentMethodService.getMyMethods();
      setCards(data);
    } catch (err: any) {
      setCardsError(
        err.response?.data?.message || "Error al cargar métodos de pago",
      );
    } finally {
      setIsLoadingCards(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCards();
  }, [fetchOrders, fetchCards]);

  // Manejar eliminación de tarjeta
  const handleDeleteCard = async (id: string) => {
    try {
      await paymentMethodService.delete(id);
      showNotification("Tarjeta eliminada correctamente", "success");
      await fetchCards();
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al eliminar tarjeta",
        "danger",
      );
    }
  };

  // Manejar agregar tarjeta
  const handleAddCard = async () => {
    if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
      showNotification(
        "Por favor completa todos los datos de la tarjeta.",
        "danger",
      );
      return;
    }

    setIsAddingCard(true);
    try {
      await paymentMethodService.add({
        numeroTarjeta: cardNumber,
        titular: cardHolder,
        fechaExpiracion: expiryDate,
      });
      setIsAddCardOpen(false);
      setCardNumber("");
      setCardHolder("");
      setExpiryDate("");
      setCvv("");
      showNotification("Tarjeta agregada exitosamente", "success");
      await fetchCards();
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al agregar tarjeta",
        "danger",
      );
    } finally {
      setIsAddingCard(false);
    }
  };

  // Eliminar cuenta
  const handleConfirmDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      await httpClient.delete("/usuarios/me");
      logout();
      navigate("/", { replace: true });
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al eliminar cuenta",
        "danger",
      );
      setIsDeletingAccount(false);
      setIsDeleteAccountOpen(false);
    }
  };

  // Rastreo
  const handleOpenTracking = (order: OrderResponse) => {
    setSelectedOrder(order);
    setIsTrackingOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ENTREGADO":
        return "success";
      case "ENVIADO":
        return "warning";
      case "PROCESANDO":
        return "secondary";
      default:
        return "default";
    }
  };

  const getOrderStepIndex = (status: string) => {
    switch (status) {
      case "PENDIENTE":
        return 0;
      case "PROCESANDO":
        return 1;
      case "ENVIADO":
        return 2;
      case "ENTREGADO":
        return 3;
      default:
        return 0;
    }
  };

  // Manejadores de inputs para tarjeta (Máscaras nativas)
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

  return (
    <div className="relative container mx-auto px-4 max-w-5xl py-12 flex flex-col gap-10 min-h-screen">
      {/* Alerta Flotante Global UI */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-appearance-in">
          <Alert
            color={notification.type}
            title={notification.type === "danger" ? "Error" : "Éxito"}
            description={notification.message}
          />
        </div>
      )}

      {/* CABECERA */}
      <div>
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">
          Perfil de {user?.nombre || "Usuario"}
        </h1>
        <p className="text-default-500 font-light mt-2 tracking-wide text-lg">
          Gestiona tu historial de compras, formas de pago y seguridad.
        </p>
      </div>

      {/* PESTAÑAS */}
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
            <Card className="bg-content1 shadow-none border border-divider rounded-2xl overflow-hidden min-h-[300px] relative">
              <CardBody className="p-0 overflow-x-auto">
                {/* Capa de Carga / Error sin destruir la estructura */}
                {isLoadingOrders && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1/70 backdrop-blur-sm">
                    <div className="w-8 h-8 border-3 border-default-200 border-t-foreground rounded-full animate-spin"></div>
                    <p className="text-default-500 font-light mt-3 text-sm">
                      Cargando pedidos...
                    </p>
                  </div>
                )}

                {ordersError && !isLoadingOrders && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1">
                    <p className="text-danger font-medium mb-3">
                      {ordersError}
                    </p>
                    <Button
                      color="default"
                      variant="flat"
                      onPress={fetchOrders}
                      size="sm"
                    >
                      Reintentar
                    </Button>
                  </div>
                )}

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
                  <TableBody
                    items={orders}
                    emptyContent={
                      !isLoadingOrders && !ordersError
                        ? "Aún no has realizado ningún pedido."
                        : " "
                    }
                  >
                    {(order) => (
                      <TableRow
                        key={order.id}
                        className="hover:bg-default-50 transition-colors"
                      >
                        <TableCell className="font-medium text-foreground tracking-tight">
                          {order.codigoOrden || order.id}
                        </TableCell>
                        <TableCell className="text-default-500 font-light">
                          {new Date(order.fechaCreacion).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="font-medium text-foreground">
                          $
                          {(order.total || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </TableCell>
                        <TableCell>
                          <Chip
                            color={getStatusColor(order.estado)}
                            variant="flat"
                            size="sm"
                            className="font-medium tracking-wide"
                          >
                            {order.estado}
                          </Chip>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="light"
                              color="default"
                              size="sm"
                              className="font-medium text-default-500 hover:text-foreground hover:bg-default-100 transition-colors"
                              startContent={
                                <MapPin size={16} strokeWidth={1.5} />
                              }
                              onPress={() => handleOpenTracking(order)}
                            >
                              Rastrear
                            </Button>
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

              {/* Contenedor de Tarjetas con estados de carga/error incorporados */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2 relative min-h-[120px]">
                {isLoadingCards ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <div className="w-8 h-8 border-3 border-default-200 border-t-foreground rounded-full animate-spin"></div>
                  </div>
                ) : cardsError ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <p className="text-danger font-medium mb-3">{cardsError}</p>
                    <Button
                      color="default"
                      variant="flat"
                      onPress={fetchCards}
                      size="sm"
                    >
                      Reintentar
                    </Button>
                  </div>
                ) : cards.length === 0 ? (
                  <p className="col-span-full text-default-400 font-light text-sm p-4 bg-default-50 rounded-lg border border-divider">
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

      {/* MODAL: RASTREO LOGÍSTICO */}
      <Modal
        isOpen={isTrackingOpen}
        onOpenChange={setIsTrackingOpen}
        classNames={{
          base: "bg-content1",
          header: "border-b border-divider",
          footer: "border-t border-divider",
        }}
      >
        <ModalContent>
          <ModalHeader className="font-semibold text-foreground flex items-center gap-2 tracking-tight">
            <MapPin size={20} strokeWidth={1.5} /> Rastreo de Pedido{" "}
            {selectedOrder?.id}
          </ModalHeader>
          <ModalBody className="py-8 px-6">
            <div className="relative flex flex-col gap-8 ml-4">
              <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-default-200 z-0" />
              {TRACKING_STEPS.map((step, idx) => {
                const currentStepIndex = selectedOrder
                  ? getOrderStepIndex(selectedOrder.estado)
                  : 0;
                const isActive = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                const Icon = step.icon;

                return (
                  <div
                    key={step.label}
                    className="relative z-10 flex items-center gap-5"
                  >
                    <div
                      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-success border-success text-white shadow-sm"
                          : "bg-content1 border-default-300 text-default-300"
                      }`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2 : 1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span
                        className={`text-base font-medium ${isActive ? "text-foreground" : "text-default-400"}`}
                      >
                        {step.label}
                      </span>
                      {isCurrent && (
                        <span className="text-xs text-success font-medium tracking-wide mt-0.5">
                          Estado actual
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              className="font-medium bg-foreground text-background shadow-none w-full sm:w-auto"
              onPress={() => setIsTrackingOpen(false)}
            >
              Cerrar Rastreador
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
              onPress={handleAddCard}
              isLoading={isAddingCard}
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
              isLoading={isDeletingAccount}
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
