// src/presentation/pages/PrivacyPolicy.tsx
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";

export const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          as={Link}
          to="/"
          variant="light"
          color="default"
          startContent={<ArrowLeft size={18} />}
          className="font-medium text-default-500 hover:text-foreground transition-colors"
        >
          Volver al inicio
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="bg-content1 shadow-sm border border-divider">
          <CardHeader className="flex-col items-start px-6 pt-6 pb-4">
            <h1 className="text-3xl font-bold text-foreground">
              Políticas de Privacidad
            </h1>
            <p className="text-sm text-default-500 mt-2">
              Última actualización: 13/07/2026
            </p>
          </CardHeader>
        </Card>

        <Card className="bg-content1 shadow-sm border border-divider">
          <CardBody className="px-6 py-8">
            <div className="space-y-6 text-default-500 leading-relaxed">
              <p>
                En AppCelulares, valoramos la confianza que depositas en
                nosotros al adquirir tus equipos tecnológicos. Por ello,
                proteger tu información personal no es solo una obligación
                legal, sino parte de nuestro compromiso con una experiencia de
                compra segura y confiable.
              </p>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">
                  1. Información que recolectamos:
                </h2>
                <p>
                  Para procesar tus pedidos y brindarte la calidad que buscas,
                  solicitamos datos básicos como: Identificación (Nombre y
                  apellido), Contacto (Correo electrónico y número de teléfono),
                  Logística (Dirección exacta de entrega para que tus equipos
                  lleguen directo a tus manos), Pago (Información procesada de
                  forma cifrada a través de nuestras pasarelas de pago seguras;
                  nosotros no almacenamos los datos de tu tarjeta).
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">
                  2. ¿Cómo usamos tu información?:
                </h2>
                <p>
                  Utilizamos tus datos exclusivamente para: Gestionar y enviar
                  tus compras de manera rápida. Darte seguimiento, soporte
                  técnico y validación de garantías. Enviarte promociones
                  exclusivas (solo si tú decides suscribirte).
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">
                  3. Seguridad y Confidencialidad:
                </h2>
                <p>
                  Tu información es sagrada. AppCelulares no vende, alquila ni
                  comparte tus datos con terceros con fines comerciales. Solo
                  compartimos la información necesaria con nuestros operadores
                  logísticos para asegurar que tu paquete llegue a su destino.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-foreground">
                  4. Tus Derechos:
                </h2>
                <p>
                  Tú tienes el control. En cualquier momento puedes solicitar:
                  El acceso a tus datos personales. La corrección de información
                  desactualizada. La eliminación de tu cuenta de nuestra base de
                  datos.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
