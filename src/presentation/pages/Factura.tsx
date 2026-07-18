// src/presentation/pages/Factura.tsx
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader, CardFooter } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import {
  CheckCircle2,
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

  // 4. Gestión de Datos (Mock temporal)
  // Simulamos la data que el backend devolvería al consultar el ID de la orden
  const orderNumber = id || "ORD-00000000";

  const MOCK_ORDER_DATA = {
    payuReference: "PAYU-9988776655",
    date: "17 de Julio, 2026 - 21:47",
    paymentMethod: "Tarjeta de Crédito (Visa **** 1234)",
    customer: {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      address: "Av. Tecnológica 123, Distrito Central, Lima",
    },
    items: [
      {
        id: "cel-001",
        name: "Samsung Galaxy S24 Ultra - Edición M",
        quantity: 1,
        unitPrice: 1450.0,
      },
      {
        id: "cel-002",
        name: "iPhone 15 Pro Max",
        quantity: 2,
        unitPrice: 1200.0,
      },
    ],
  };

  // Cálculos de la factura
  const subtotal = MOCK_ORDER_DATA.items.reduce(
    (acc, item) => acc + item.unitPrice * item.quantity,
    0,
  );
  const igv = subtotal * 0.18; // IGV 18%
  const total = subtotal + igv;

  const handleDownloadPDF = () => {
    // Lógica futura para generar y descargar PDF
    alert("Descargando comprobante PDF...");
  };

  return (
    // 2. Estructura Visual: Contenedor principal
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-12 lg:py-20 px-4 sm:px-6 font-sans">
      {/* Encabezado de Éxito */}
      <div className="text-center mb-10 animate-appearance-in">
        <div className="flex justify-center mb-5">
          <div className="bg-emerald-100/50 p-4 rounded-full border border-emerald-200 shadow-sm">
            <CheckCircle2
              size={56}
              strokeWidth={1.5}
              className="text-emerald-600"
            />
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-semibold text-zinc-900 tracking-tight mb-3">
          ¡Pago Exitoso!
        </h1>
        <p className="text-zinc-500 font-light tracking-wide max-w-md mx-auto text-sm lg:text-base leading-relaxed">
          Hemos recibido tu pago correctamente. Tu orden está confirmada y
          pronto estará en camino hacia su destino.
        </p>
      </div>

      {/* Contenedor del Documento (max-w-3xl) */}
      <div className="w-full max-w-3xl">
        <Card className="bg-white shadow-sm border border-zinc-200/60 rounded-2xl overflow-hidden">
          {/* HEADER DEL DOCUMENTO */}
          <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 bg-zinc-50/50 border-b border-zinc-100">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
                AppCelulares
              </h2>
              <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1 font-medium">
                Comprobante de Pago
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-left sm:text-right">
              {/* Uso del parámetro capturado de la URL */}
              <p className="text-sm font-medium text-zinc-900">
                Orden #{orderNumber}
              </p>
              <p className="text-xs text-zinc-500 font-light mt-1">
                Ref: {MOCK_ORDER_DATA.payuReference}
              </p>
            </div>
          </CardHeader>

          <CardBody className="p-8 flex flex-col gap-8">
            {/* BLOQUE 1: Metadatos de la Orden */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white">
              <div className="flex items-start gap-3">
                <CalendarCheck size={18} className="text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900 uppercase tracking-widest mb-1">
                    Fecha de Emisión
                  </p>
                  <p className="text-sm text-zinc-600 font-light">
                    {MOCK_ORDER_DATA.date}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CreditCard size={18} className="text-zinc-400 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-zinc-900 uppercase tracking-widest mb-1">
                    Método de Pago
                  </p>
                  <p className="text-sm text-zinc-600 font-light">
                    {MOCK_ORDER_DATA.paymentMethod}
                  </p>
                </div>
              </div>
            </div>

            <Divider className="bg-zinc-100" />

            {/* BLOQUE 2: Datos del Cliente */}
            <div>
              <p className="text-xs font-semibold text-zinc-900 uppercase tracking-widest mb-4">
                Facturado y Enviado a
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User size={18} className="text-zinc-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {MOCK_ORDER_DATA.customer.name}
                    </p>
                    <p className="text-sm text-zinc-500 font-light">
                      {MOCK_ORDER_DATA.customer.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="text-zinc-400 mt-0.5" />
                  <p className="text-sm text-zinc-600 font-light leading-relaxed pr-4">
                    {MOCK_ORDER_DATA.customer.address}
                  </p>
                </div>
              </div>
            </div>

            <Divider className="bg-zinc-100" />

            {/* BLOQUE 3: Detalle de Compra */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <ReceiptText size={18} className="text-zinc-900" />
                <p className="text-xs font-semibold text-zinc-900 uppercase tracking-widest">
                  Detalle de Artículos
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200">
                      <th className="py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider w-16">
                        Cant.
                      </th>
                      <th className="py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        Descripción del Equipo
                      </th>
                      <th className="py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">
                        P. Unitario
                      </th>
                      <th className="py-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_ORDER_DATA.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/50 transition-colors"
                      >
                        <td className="py-4 text-sm text-zinc-900 font-medium">
                          {item.quantity}
                        </td>
                        <td className="py-4 text-sm text-zinc-600 font-light">
                          {item.name}
                        </td>
                        <td className="py-4 text-sm text-zinc-600 font-light text-right">
                          $
                          {item.unitPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-4 text-sm text-zinc-900 font-medium text-right">
                          $
                          {(item.unitPrice * item.quantity).toLocaleString(
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
                  <span className="text-zinc-500 font-light">
                    Subtotal Base
                  </span>
                  <span className="font-medium text-zinc-900">
                    $
                    {subtotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 font-light">IGV (18%)</span>
                  <span className="font-medium text-zinc-900">
                    ${igv.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <Divider className="my-2 bg-zinc-200/60" />
                <div className="flex justify-between items-end">
                  <span className="text-base font-medium text-zinc-900">
                    Total a Pagar
                  </span>
                  <span className="text-3xl font-bold text-zinc-900 tracking-tight">
                    $
                    {total.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </CardBody>

          <CardFooter className="bg-zinc-50/50 p-6 flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-4 border-t border-zinc-100">
            <p className="text-xs text-zinc-400 font-light text-center sm:text-left leading-relaxed">
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
          className="font-medium bg-white border border-zinc-200 text-zinc-900 hover:bg-zinc-50 shadow-sm"
          startContent={<Download size={18} strokeWidth={1.5} />}
          onPress={handleDownloadPDF}
        >
          Descargar PDF
        </Button>
        <Button
          color="default"
          variant="solid"
          size="lg"
          className="font-medium bg-zinc-900 text-white hover:bg-zinc-800 shadow-none"
          startContent={<ArrowLeft size={18} strokeWidth={1.5} />}
          onPress={() => navigate("/")}
        >
          Volver al Catálogo
        </Button>
      </div>
    </div>
  );
};
