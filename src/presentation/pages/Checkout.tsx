// src/presentation/pages/Checkout.tsx
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { RadioGroup, Radio } from "@heroui/radio";
import { Divider } from "@heroui/divider";

export const Checkout = () => {
  // Simulamos el subtotal que vendría del contexto/estado global
  const subtotal = 3850;
  const taxes = subtotal * 0.12;
  const total = subtotal + taxes;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = () => {
    setIsSubmitting(true);
    // Simulación de envío al backend
    setTimeout(() => {
      alert("¡Pedido enviado con éxito a nuestro sistema!");
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Finalizar Pedido
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* IZQUIERDA: Detalles de Envío y Pago (70%) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Tarjeta: Método de Entrega y Contacto */}
          <Card className="bg-white shadow-sm border border-gray-100 p-2">
            <CardHeader className="px-4 pt-4">
              <h2 className="text-xl font-bold text-gray-800">
                Método de entrega
              </h2>
            </CardHeader>
            <CardBody className="px-4">
              <Tabs
                aria-label="Opciones de entrega"
                color="primary"
                variant="solid"
                className="mb-6"
              >
                <Tab key="domicilio" title="🏠 A Domicilio">
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nombre de quien recibe"
                        placeholder="Ej. Juan Pérez"
                        variant="bordered"
                      />
                      <Input
                        label="Teléfono de contacto"
                        placeholder="Ej. 999 888 777"
                        variant="bordered"
                      />
                    </div>
                    <Input
                      label="Dirección de envío completa"
                      placeholder="Calle, número, distrito..."
                      variant="bordered"
                    />
                    <Input
                      label="Referencia (Opcional)"
                      placeholder="Frente al parque..."
                      variant="bordered"
                    />
                  </div>
                </Tab>
                <Tab key="recoger" title="🏪 Recoger en Tienda">
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg text-sm text-gray-700">
                    <p className="font-semibold">
                      Sucursal Principal AppCelulares
                    </p>
                    <p>Av. Tecnológica 123, Distrito Central.</p>
                    <p className="mt-2 text-gray-500">
                      Recuerda llevar tu DNI para validar la entrega.
                    </p>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>

          {/* Tarjeta: Método de Pago */}
          <Card className="bg-white shadow-sm border border-gray-100 p-2">
            <CardHeader className="px-4 pt-4">
              <h2 className="text-xl font-bold text-gray-800">
                Método de pago
              </h2>
            </CardHeader>
            <CardBody className="px-4">
              <RadioGroup defaultValue="tarjeta" color="primary">
                <div className="flex flex-col gap-3">
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                    <Radio value="tarjeta">
                      <span className="font-semibold text-gray-800 ml-2">
                        Tarjeta de Crédito / Débito
                      </span>
                    </Radio>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                    <Radio value="yape">
                      <span className="font-semibold text-gray-800 ml-2">
                        Billetera Digital (Yape / Plin)
                      </span>
                    </Radio>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 hover:border-primary transition-colors">
                    <Radio value="efectivo">
                      <span className="font-semibold text-gray-800 ml-2">
                        Pago en Efectivo contra entrega
                      </span>
                    </Radio>
                  </div>
                </div>
              </RadioGroup>
            </CardBody>
          </Card>
        </div>

        {/* DERECHA: Resumen Pegajoso (30%) */}
        <div className="lg:col-span-4">
          <Card className="bg-white shadow-sm border border-gray-100 sticky top-24">
            <CardBody className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Resumen del pedido
              </h3>

              {/* Mini-resumen de items */}
              <div className="flex flex-col gap-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="truncate w-48">1x Samsung S24 Ultra...</span>
                  <span className="font-semibold text-gray-900">$1,450</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="truncate w-48">2x iPhone 15 Pro Max</span>
                  <span className="font-semibold text-gray-900">$2,400</span>
                </div>
              </div>

              <Divider className="my-4" />

              {/* Costos */}
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (12%)</span>
                  <span className="font-semibold text-gray-900">
                    ${taxes.toLocaleString()}
                  </span>
                </div>
              </div>

              <Divider className="my-4" />

              {/* Cupón */}
              <div className="flex gap-2 mb-6">
                <Input
                  placeholder="Código de cupón"
                  size="sm"
                  variant="bordered"
                  className="flex-1"
                />
                <Button color="default" size="sm" className="font-semibold">
                  Aplicar
                </Button>
              </div>

              {/* Total Final */}
              <div className="flex justify-between items-end mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <span className="text-lg font-bold text-gray-900">
                  Total a Pagar
                </span>
                <span className="text-2xl font-black text-primary">
                  ${total.toLocaleString()}
                </span>
              </div>

              <Button
                color="primary"
                size="lg"
                className="w-full font-bold shadow-md"
                onPress={handleSubmitOrder}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Procesando pago..." : "Enviar Pedido"}
              </Button>
              <p className="text-xs text-center text-gray-400 mt-4">
                Al enviar el pedido aceptas nuestros Términos y Condiciones.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
