// src/presentation/pages/Checkout.tsx
import { useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { RadioGroup, Radio } from "@heroui/radio";
import { Divider } from "@heroui/divider";
import { Home, Store } from "lucide-react";

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
    <div className="min-h-screen bg-white py-12 lg:py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-zinc-900 mb-10 tracking-tight">
        Finalizar Pedido
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* IZQUIERDA: Detalles de Envío y Pago (70%) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          {/* Tarjeta: Método de Entrega y Contacto */}
          <Card className="bg-white shadow-none border border-zinc-200/60 rounded-2xl">
            <CardHeader className="px-7 pt-7 pb-2">
              <h2 className="text-lg font-medium text-zinc-900 tracking-tight">
                Método de entrega
              </h2>
            </CardHeader>
            <CardBody className="px-7 pb-7">
              <Tabs
                aria-label="Opciones de entrega"
                variant="underlined"
                color="default"
                className="mb-6"
                classNames={{
                  cursor: "bg-zinc-900",
                  tabContent:
                    "group-data-[selected=true]:text-zinc-900 text-zinc-500 font-medium tracking-wide",
                  tabList: "border-b border-zinc-200/60 pb-0",
                }}
              >
                <Tab
                  key="domicilio"
                  title={
                    <div className="flex items-center gap-2 py-1">
                      <Home size={18} strokeWidth={1.5} />
                      <span>A Domicilio</span>
                    </div>
                  }
                >
                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nombre de quien recibe"
                        placeholder="Ej. Juan Pérez"
                        variant="underlined"
                        classNames={{
                          label: "text-zinc-500 text-xs font-medium",
                          input: "text-zinc-900",
                        }}
                      />
                      <Input
                        label="Teléfono de contacto"
                        placeholder="Ej. 999 888 777"
                        variant="underlined"
                        classNames={{
                          label: "text-zinc-500 text-xs font-medium",
                          input: "text-zinc-900",
                        }}
                      />
                    </div>
                    <Input
                      label="Dirección de envío completa"
                      placeholder="Calle, número, distrito..."
                      variant="underlined"
                      classNames={{
                        label: "text-zinc-500 text-xs font-medium",
                        input: "text-zinc-900",
                      }}
                    />
                    <Input
                      label="Referencia (Opcional)"
                      placeholder="Frente al parque..."
                      variant="underlined"
                      classNames={{
                        label: "text-zinc-500 text-xs font-medium",
                        input: "text-zinc-900",
                      }}
                    />
                  </div>
                </Tab>
                <Tab
                  key="recoger"
                  title={
                    <div className="flex items-center gap-2 py-1">
                      <Store size={18} strokeWidth={1.5} />
                      <span>Recoger en Tienda</span>
                    </div>
                  }
                >
                  <div className="mt-6 p-6 bg-zinc-50 border border-zinc-200/60 rounded-xl text-sm text-zinc-600 font-light tracking-wide leading-relaxed">
                    <p className="font-medium text-zinc-900 mb-1">
                      Sucursal Principal AppCelulares
                    </p>
                    <p>Av. Tecnológica 123, Distrito Central.</p>
                    <p className="mt-3 text-zinc-500 text-xs uppercase tracking-widest font-medium">
                      Recuerda llevar tu DNI para validar la entrega.
                    </p>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>

          {/* Tarjeta: Método de Pago */}
          <Card className="bg-white shadow-none border border-zinc-200/60 rounded-2xl">
            <CardHeader className="px-7 pt-7 pb-2">
              <h2 className="text-lg font-medium text-zinc-900 tracking-tight">
                Método de pago
              </h2>
            </CardHeader>
            <CardBody className="px-7 pb-7">
              <RadioGroup defaultValue="tarjeta" color="default">
                <div className="flex flex-col gap-4 mt-2">
                  <div className="border border-zinc-200/60 rounded-xl p-5 hover:border-zinc-300 transition-colors bg-white">
                    <Radio value="tarjeta">
                      <span className="font-medium text-zinc-900 ml-2">
                        Tarjeta de Crédito / Débito
                      </span>
                    </Radio>
                  </div>
                  <div className="border border-zinc-200/60 rounded-xl p-5 hover:border-zinc-300 transition-colors bg-white">
                    <Radio value="yape">
                      <span className="font-medium text-zinc-900 ml-2">
                        Billetera Digital (Yape / Plin)
                      </span>
                    </Radio>
                  </div>
                  <div className="border border-zinc-200/60 rounded-xl p-5 hover:border-zinc-300 transition-colors bg-white">
                    <Radio value="efectivo">
                      <span className="font-medium text-zinc-900 ml-2">
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
          <Card className="bg-zinc-50 shadow-none border border-zinc-200/60 rounded-2xl sticky top-28">
            <CardBody className="p-7">
              <h3 className="text-lg font-semibold text-zinc-900 mb-6 tracking-tight">
                Resumen del pedido
              </h3>

              {/* Mini-resumen de items */}
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between text-sm text-zinc-600 font-light">
                  <span className="truncate w-48">1x Samsung S24 Ultra...</span>
                  <span className="font-medium text-zinc-900">$1,450</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-600 font-light">
                  <span className="truncate w-48">2x iPhone 15 Pro Max</span>
                  <span className="font-medium text-zinc-900">$2,400</span>
                </div>
              </div>

              <Divider className="my-5 bg-zinc-200/60" />

              {/* Costos */}
              <div className="space-y-4 text-sm text-zinc-500 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos (12%)</span>
                  <span className="font-medium text-zinc-900">
                    ${taxes.toLocaleString()}
                  </span>
                </div>
              </div>

              <Divider className="my-5 bg-zinc-200/60" />

              {/* Cupón */}
              <div className="flex gap-2 mb-8">
                <Input
                  placeholder="Código de cupón"
                  size="sm"
                  variant="bordered"
                  className="flex-1"
                  classNames={{
                    inputWrapper: "border-zinc-200/60 bg-white shadow-none",
                    input: "text-sm text-zinc-900",
                  }}
                />
                <Button
                  color="default"
                  size="sm"
                  variant="flat"
                  className="font-medium bg-zinc-200/50 text-zinc-900 hover:bg-zinc-200"
                >
                  Aplicar
                </Button>
              </div>

              {/* Total Final */}
              <div className="flex justify-between items-end mb-8 pt-2">
                <span className="text-base font-medium text-zinc-900">
                  Total a Pagar
                </span>
                <span className="text-2xl font-semibold text-zinc-900 tracking-tight">
                  ${total.toLocaleString()}
                </span>
              </div>

              <Button
                color="default"
                size="lg"
                className="w-full font-medium bg-zinc-900 text-white hover:bg-zinc-800 shadow-none transition-colors"
                onPress={handleSubmitOrder}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Procesando pago..." : "Confirmar Compra"}
              </Button>
              <p className="text-xs text-center text-zinc-400 font-light mt-5 leading-relaxed">
                Al confirmar la compra aceptas nuestros Términos y Condiciones
                de venta.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
