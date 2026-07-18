// src/presentation/pages/Factura.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  ArrowLeft,
  ReceiptText,
  MapPin,
  User,
  CreditCard,
  CalendarCheck,
} from "lucide-react";

export const Factura = () => {
  // 1. Captura de Parámetros
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const transactionState = searchParams.get("transactionState");
  const referenceCode = searchParams.get("referenceCode");
  const polPaymentMethod = searchParams.get("polPaymentMethod");
  const txValue = searchParams.get("TX_VALUE");

  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("last_order_data");
      if (storedData) {
        setOrderData(JSON.parse(storedData));
      }
    } catch (e) {
      console.error("Error al recuperar datos de la orden", e);
    }
  }, []);

  // 2. Lógica de Estado de Transacción
  const getStatusInfo = () => {
    switch (transactionState) {
      case "4":
        return {
          title: "¡Pago Exitoso!",
          message: "Tu orden ha sido procesada correctamente.",
          colorClass: "text-success",
          bgClass: "bg-success/20 border-success/30",
          icon: (
            <CheckCircle2
              size={56}
              strokeWidth={1.5}
              className="text-success"
            />
          ),
        };
      case "6":
        return {
          title: "Pago Rechazado",
          message: "Hubo un problema con tu método de pago.",
          colorClass: "text-danger",
          bgClass: "bg-danger/20 border-danger/30",
          icon: <XCircle size={56} strokeWidth={1.5} className="text-danger" />,
        };
      case "7":
        return {
          title: "Pago Pendiente",
          message: "Tu pago está siendo verificado.",
          colorClass: "text-warning",
          bgClass: "bg-warning/20 border-warning/30",
          icon: <Clock size={56} strokeWidth={1.5} className="text-warning" />,
        };
      default:
        return {
          title: "Comprobante de Orden",
          message: "Aquí tienes los detalles de tu orden.",
          colorClass: "text-foreground",
          bgClass: "bg-default-100 border-divider",
          icon: (
            <ReceiptText
              size={56}
              strokeWidth={1.5}
              className="text-default-500"
            />
          ),
        };
    }
  };

  const statusInfo = getStatusInfo();
  const orderNumber = id || referenceCode || "ORD-00000000";

  // 4. Gestión de Datos Integrados (localStorage + URL params)
  const customerName = orderData?.formData?.nombre || "Cliente Anónimo";
  const customerAddress = orderData?.formData?.direccion || "Recojo en Tienda";
  const customerEmail = orderData?.formData?.nombre
    ? orderData.formData.nombre.toLowerCase().replace(/\s/g, "") + "@test.com"
    : "cliente@appcelulares.pe";

  const paymentMethodDisplay = polPaymentMethod
    ? polPaymentMethod === "yape"
      ? "Billetera Digital (Yape / Plin)"
      : polPaymentMethod === "efectivo"
        ? "Pago en Efectivo"
        : `PayU (Método ${polPaymentMethod})`
    : "Tarjeta de Crédito / Débito";

  const orderItems = orderData?.items || [];
  const baseSubtotal = orderItems.reduce(
    (acc: number, item: any) => acc + item.precio * item.quantity,
    0,
  );
  const discountAmt = orderData?.discountAmount || 0;
  const discountPct = orderData?.discountPercent || 0;
  const taxes = orderData?.taxes || 0;

  // Respetamos lo enviado por PayU (txValue) si existe, sino caemos al calculado localmente
  const finalTotal = txValue ? parseFloat(txValue) : orderData?.total || 0;
  const currentDate = new Date().toLocaleString("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const handleDownloadPDF = () => {
    alert("Descargando comprobante PDF...");
  };

  return (
    // 2. Estructura Visual: Contenedor principal
    <div className="min-h-screen bg-background flex flex-col items-center py-12 lg:py-20 px-4 sm:px-6 font-sans">
      {/* Encabezado Dinámico basado en estado */}
      <div className="text-center mb-10 animate-appearance-in">
        <div className="flex justify-center mb-5">
          <div
            className={`p-4 rounded-full border shadow-sm ${statusInfo.bgClass}`}
          >
            {statusInfo.icon}
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold text-foreground tracking-tight mb-3">
          {statusInfo.title}
        </h1>
        <p className="text-default-500 font-light tracking-wide max-w-md mx-auto text-sm lg:text-base leading-relaxed">
          {statusInfo.message}
        </p>
      </div>

      {/* Contenedor del Documento (max-w-3xl) */}
      <div className="w-full max-w-3xl">
        <Card className="bg-content1 shadow-none border border-divider rounded-2xl overflow-hidden">
          {/* HEADER DEL DOCUMENTO */}
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 bg-default-50 border-b border-divider">
            <div>
              <h2 className="text-2xl font-bold text-foreground tracking-tight">
                AppCelulares
              </h2>
              <p className="text-xs text-default-500 uppercase tracking-widest mt-1 font-medium">
                Comprobante de Pago
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-left sm:text-right">
              <p className="text-sm font-medium text-foreground">
                Orden #{orderNumber}
              </p>
              <p className="text-xs text-default-500 font-light mt-1">
                Ref: {referenceCode || "N/A"}
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-8 flex flex-col gap-8">
            {/* BLOQUE 1: Metadatos de la Orden */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-content1">
              <div className="flex items-start gap-3">
                <CalendarCheck size={18} className="text-default-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-1">
                    Fecha de Emisión
                  </p>
                  <p className="text-sm text-default-500 font-light">
                    {currentDate}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard size={18} className="text-default-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-1">
                    Método de Pago
                  </p>
                  <p className="text-sm text-default-500 font-light">
                    {paymentMethodDisplay}
                  </p>
                </div>
              </div>
            </div>

            <Divider className="bg-divider" />

            {/* BLOQUE 2: Datos del Cliente */}
            <div>
              <p className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Facturado y Enviado a
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-default-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {customerName}
                    </p>
                    <p className="text-sm text-default-500 font-light">
                      {customerEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-default-400 mt-0.5" />
                  <p className="text-sm text-default-500 font-light leading-relaxed pr-4">
                    {customerAddress}
                  </p>
                </div>
              </div>
            </div>

            <Divider className="bg-divider" />

            {/* BLOQUE 3: Detalle de Compra */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ReceiptText size={18} className="text-foreground" />
                <p className="text-xs font-semibold text-foreground uppercase tracking-widest">
                  Detalle de Artículos
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-divider">
                      <th className="py-3 text-xs font-semibold text-default-500 uppercase tracking-wider w-16">
                        Cant.
                      </th>
                      <th className="py-3 text-xs font-semibold text-default-500 uppercase tracking-wider">
                        Descripción del Equipo
                      </th>
                      <th className="py-3 text-xs font-semibold text-default-500 uppercase tracking-wider text-right">
                        P. Unitario
                      </th>
                      <th className="py-3 text-xs font-semibold text-default-500 uppercase tracking-wider text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems.map((item: any) => (
                      <tr
                        key={item.id}
                        className="border-b border-divider last:border-0 hover:bg-default-100 transition-colors"
                      >
                        <td className="py-4 text-sm text-foreground font-medium">
                          {item.quantity}
                        </td>
                        <td className="py-4 text-sm text-default-500 font-light">
                          {item.nombre}
                        </td>
                        <td className="py-4 text-sm text-default-500 font-light text-right">
                          $
                          {item.precio.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-4 text-sm text-foreground font-medium text-right">
                          $
                          {(item.precio * item.quantity).toLocaleString(
                            "en-US",
                            { minimumFractionDigits: 2 },
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* BLOQUE 4: Totales */}
            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-1/2 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-default-500 font-light">
                    Subtotal Base
                  </span>
                  <span className="font-medium text-foreground">
                    $
                    {baseSubtotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {discountPct > 0 && (
                  <div className="flex justify-between text-sm text-success">
                    <span className="font-medium">
                      Descuento ({discountPct}%)
                    </span>
                    <span className="font-bold">
                      -$
                      {discountAmt.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-default-500 font-light">
                    Impuestos (12%)
                  </span>
                  <span className="font-medium text-foreground">
                    $
                    {taxes.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <Divider className="my-2 bg-divider" />
                <div className="flex justify-between items-end">
                  <span className="text-base font-medium text-foreground">
                    Total a Pagar
                  </span>
                  <span
                    className={`text-3xl font-bold tracking-tight ${statusInfo.colorClass}`}
                  >
                    $
                    {finalTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>

          <CardFooter className="bg-default-50 p-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 border-t border-divider">
            <p className="text-xs text-default-400 font-light text-center sm:text-left leading-relaxed">
              Este documento electrónico es un comprobante de pago válido.{" "}
              <br className="hidden sm:block" />
              Por favor consérvalo para cualquier consulta o garantía futura.
            </p>
          </CardFooter>
        </Card>
      </div>

      {/* 3. Acciones (Navegación y UX) */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full max-w-xl justify-center">
        <Button
          color="default"
          variant="flat"
          size="lg"
          className="font-medium bg-content1 border border-divider text-foreground hover:bg-default-100 shadow-sm transition-colors"
          startContent={<Download size={18} strokeWidth={1.5} />}
          onPress={handleDownloadPDF}
        >
          Descargar PDF
        </Button>
        <Button
          color="default"
          variant="solid"
          size="lg"
          className="font-medium bg-foreground text-background hover:opacity-80 shadow-none transition-colors"
          startContent={<ArrowLeft size={18} strokeWidth={1.5} />}
          onPress={() => navigate("/")}
        >
          Volver a la Tienda
        </Button>
      </div>
    </div>
  );
};
