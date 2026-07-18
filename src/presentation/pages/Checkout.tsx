// src/presentation/pages/Checkout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Tabs, Tab } from "@heroui/tabs";
import { RadioGroup, Radio } from "@heroui/radio";
import { Divider } from "@heroui/divider";
import { Home, Store } from "lucide-react";
import { useCartStore } from "../../application/store/useCartStore";
import { processPayUCheckout } from "../../infrastructure/payments/payuService";

export const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartStore();

  const [couponInput, setCouponInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponStatus, setCouponStatus] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const [deliveryMethod, setDeliveryMethod] = useState("domicilio");
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    direccion: "",
    referencia: "",
  });
  const [metodoPago, setMetodoPago] = useState("tarjeta");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = items.reduce(
    (acc, item) => acc + item.precio * item.quantity,
    0,
  );
  const discountAmount = subtotal * (discountPercent / 100);
  const taxes = (subtotal - discountAmount) * 0.12;
  const total = subtotal - discountAmount + taxes;

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (code === "VERANO20") {
      setDiscountPercent(20);
      setCouponStatus({
        message: "¡Cupón aplicado correctamente!",
        type: "success",
      });
    } else if (code === "BLACKFRIDAY") {
      setDiscountPercent(50);
      setCouponStatus({
        message: "¡Descuento de Black Friday aplicado!",
        type: "success",
      });
    } else if (code === "CADUCADO") {
      setDiscountPercent(0);
      setCouponStatus({
        message: "Este código ha expirado.",
        type: "error",
      });
    } else if (code === "") {
      setDiscountPercent(0);
      setCouponStatus({ message: "", type: null });
    } else {
      setDiscountPercent(0);
      setCouponStatus({ message: "Cupón inválido.", type: "error" });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "telefono" || name === "dni") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    if (deliveryMethod === "domicilio") {
      if (
        !formData.nombre.trim() ||
        !formData.dni.trim() ||
        !formData.telefono.trim() ||
        !formData.direccion.trim()
      ) {
        alert("Por favor completa los datos obligatorios.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const referenceCode = "ORD-" + Date.now();
      const amountStr = Number(total.toFixed(2)).toString();

      // INYECCIÓN ANTIFRAUDE: Añade números aleatorios al correo para burlar el caché de Sandbox
      const randomSuffix = Math.floor(Math.random() * 100000);
      const buyerEmail = formData.nombre
        ? formData.nombre.toLowerCase().replace(/\s/g, "") +
          randomSuffix +
          "@test.com"
        : "cliente" + randomSuffix + "@appcelulares.pe";

      localStorage.setItem(
        "last_order_data",
        JSON.stringify({
          formData,
          items,
          total,
          discountPercent,
          discountAmount,
          taxes,
        }),
      );

      if (metodoPago === "tarjeta") {
        clearCart();
        await processPayUCheckout({
          amount: amountStr,
          buyerEmail,
          referenceCode,
          buyerFullName: formData.nombre,
          payerPhone: formData.telefono,
          payerDNI: formData.dni,
        });
      } else {
        clearCart();
        navigate(
          `/factura/${referenceCode}?transactionState=4&polPaymentMethod=${metodoPago}`,
        );
      }
    } catch (error) {
      console.error("Error al procesar el pedido:", error);
      alert(
        "Hubo un error al inicializar el pago. Verifica la consola para más detalles.",
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 lg:py-16 px-4 lg:px-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-foreground mb-10 tracking-tight">
        Finalizar Pedido
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 flex flex-col gap-8">
          <Card className="bg-content1 shadow-none border border-divider rounded-2xl">
            <CardHeader className="px-7 pt-7 pb-2">
              <h2 className="text-lg font-medium text-foreground tracking-tight">
                Método de entrega
              </h2>
            </CardHeader>
            <CardBody className="px-7 pb-7">
              <Tabs
                aria-label="Opciones de entrega"
                variant="underlined"
                color="default"
                selectedKey={deliveryMethod}
                onSelectionChange={(k) => setDeliveryMethod(k as string)}
                className="mb-6"
                classNames={{
                  cursor: "bg-foreground",
                  tabContent:
                    "group-data-[selected=true]:text-foreground text-default-500 font-medium tracking-wide",
                  tabList: "border-b border-divider pb-0",
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
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        label="Nombre de quien recibe"
                        placeholder="Ej. Juan Pérez"
                        variant="underlined"
                        isRequired
                        maxLength={100}
                        autoComplete="off"
                        classNames={{
                          label: "text-default-500 text-xs font-medium",
                          input: "text-foreground",
                        }}
                      />
                      <Input
                        name="dni"
                        value={formData.dni}
                        onChange={handleInputChange}
                        label="DNI"
                        placeholder="Ej. 12345678"
                        variant="underlined"
                        type="text"
                        isRequired
                        maxLength={8}
                        autoComplete="off"
                        classNames={{
                          label: "text-default-500 text-xs font-medium",
                          input: "text-foreground",
                        }}
                      />
                      <Input
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        label="Teléfono de contacto"
                        placeholder="Ej. 999 888 777"
                        variant="underlined"
                        type="tel"
                        isRequired
                        maxLength={9}
                        autoComplete="off"
                        classNames={{
                          label: "text-default-500 text-xs font-medium",
                          input: "text-foreground",
                        }}
                      />
                    </div>
                    <Input
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      label="Dirección de envío completa"
                      placeholder="Calle, número, distrito..."
                      variant="underlined"
                      isRequired
                      maxLength={100}
                      autoComplete="off"
                      classNames={{
                        label: "text-default-500 text-xs font-medium",
                        input: "text-foreground",
                      }}
                    />
                    <Input
                      name="referencia"
                      value={formData.referencia}
                      onChange={handleInputChange}
                      label="Referencia (Opcional)"
                      placeholder="Frente al parque..."
                      variant="underlined"
                      maxLength={100}
                      autoComplete="off"
                      classNames={{
                        label: "text-default-500 text-xs font-medium",
                        input: "text-foreground",
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
                  <div className="mt-6 p-6 bg-default-50 border border-divider rounded-xl text-sm text-default-500 font-light tracking-wide leading-relaxed">
                    <p className="font-medium text-foreground mb-1">
                      Sucursal Principal AppCelulares
                    </p>
                    <p>Av. Tecnológica 123, Distrito Central.</p>
                    <p className="mt-3 text-default-500 text-xs uppercase tracking-widest font-medium">
                      Recuerda llevar tu DNI para validar la entrega.
                    </p>
                  </div>
                </Tab>
              </Tabs>
            </CardBody>
          </Card>

          <Card className="bg-content1 shadow-none border border-divider rounded-2xl">
            <CardHeader className="px-7 pt-7 pb-2">
              <h2 className="text-lg font-medium text-foreground tracking-tight">
                Método de pago
              </h2>
            </CardHeader>
            <CardBody className="px-7 pb-7">
              <RadioGroup
                value={metodoPago}
                onValueChange={setMetodoPago}
                color="default"
              >
                <div className="flex flex-col gap-4 mt-2">
                  <div className="border border-divider rounded-xl p-5 hover:border-default-400 transition-colors bg-content1">
                    <Radio value="tarjeta">
                      <span className="font-medium text-foreground ml-2">
                        Tarjeta de Crédito / Débito (Vía PayU)
                      </span>
                    </Radio>
                  </div>
                  <div className="border border-divider rounded-xl p-5 hover:border-default-400 transition-colors bg-content1">
                    <Radio value="efectivo">
                      <span className="font-medium text-foreground ml-2">
                        {deliveryMethod === "domicilio"
                          ? "Pago en Efectivo contra entrega"
                          : "Pago en Efectivo en Tienda"}
                      </span>
                    </Radio>
                  </div>
                </div>
              </RadioGroup>
            </CardBody>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="bg-default-50 shadow-none border border-divider rounded-2xl sticky top-28">
            <CardBody className="p-7">
              <h3 className="text-lg font-semibold text-foreground mb-6 tracking-tight">
                Resumen del pedido
              </h3>

              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between text-sm text-default-500 font-light"
                  >
                    <span className="truncate w-48">
                      {item.quantity}x {item.nombre}
                    </span>
                    <span className="font-medium text-foreground">
                      ${(item.precio * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <Divider className="my-5 bg-divider" />

              <div className="space-y-4 text-sm text-default-500 font-light">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-foreground">
                    ${subtotal.toLocaleString()}
                  </span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-success">
                    <span className="font-medium">
                      Descuento ({discountPercent}%)
                    </span>
                    <span className="font-bold">
                      -${discountAmount.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Impuestos (12%)</span>
                  <span className="font-medium text-foreground">
                    $
                    {taxes.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <Divider className="my-5 bg-divider" />

              <div className="flex flex-col gap-2 mb-8">
                <div className="flex gap-2">
                  <Input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Código de cupón"
                    size="sm"
                    variant="bordered"
                    autoComplete="off"
                    className="flex-1"
                    classNames={{
                      inputWrapper: "border-divider bg-content1 shadow-none",
                      input: "text-sm text-foreground",
                    }}
                  />
                  <Button
                    onPress={handleApplyCoupon}
                    color="default"
                    size="sm"
                    variant="flat"
                    className="font-medium bg-default-100 text-foreground hover:bg-default-200"
                  >
                    Aplicar
                  </Button>
                </div>
                {couponStatus.message && (
                  <span
                    className={`text-xs px-1 font-medium ${
                      couponStatus.type === "success"
                        ? "text-success"
                        : "text-danger"
                    }`}
                  >
                    {couponStatus.message}
                  </span>
                )}
              </div>

              <div className="flex justify-between items-end mb-8 pt-2">
                <span className="text-base font-medium text-foreground">
                  Total a Pagar
                </span>
                <span className="text-2xl font-semibold text-foreground tracking-tight">
                  $
                  {total.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <Button
                color="default"
                size="lg"
                className="w-full font-medium bg-foreground text-background hover:opacity-80 shadow-none transition-colors"
                onPress={handleSubmitOrder}
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Procesando pago..." : "Confirmar Compra"}
              </Button>
              <p className="text-xs text-center text-default-400 font-light mt-5 leading-relaxed">
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
