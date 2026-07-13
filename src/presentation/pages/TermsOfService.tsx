// src/presentation/pages/TermsOfService.tsx
import { Link } from "react-router-dom";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { ArrowLeft } from "lucide-react";

export const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button
          as={Link}
          to="/"
          variant="light"
          color="default"
          startContent={<ArrowLeft size={18} />}
          className="font-medium"
        >
          Volver al inicio
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="shadow-sm border border-gray-100">
          <CardHeader className="flex-col items-start px-6 pt-6 pb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              Términos de Servicio
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Última actualización: 13/07/2026
            </p>
          </CardHeader>
        </Card>

        <Card className="shadow-sm border border-gray-100">
          <CardBody className="px-6 py-8">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p>
                Bienvenido a AppCelulares. Al navegar en nuestro sitio o
                realizar una compra, aceptas los términos que rigen nuestra
                relación comercial. Nos esforzamos por ofrecerte los mejores
                smartphones del mercado con la mayor transparencia posible.
              </p>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900">
                  1. Disponibilidad de Productos:
                </h2>
                <p>
                  En AppCelulares nos enorgullecemos de ofrecer equipos de gama
                  alta. Debido a la alta rotación del mercado tecnológico: Las
                  especificaciones pueden variar ligeramente según la versión
                  regional del fabricante. El stock está sujeto a
                  disponibilidad. Si un equipo se agota después de tu compra, te
                  notificaremos de inmediato para un cambio o reembolso.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900">
                  2. Procesos de Envío y Entrega:
                </h2>
                <p>
                  Queremos que la experiencia sea rápida y segura: Cobertura:
                  Realizamos envíos a todo el Perú. Tiempos: El tiempo estimado
                  de entrega se comunicará al finalizar la compra, dependiendo
                  de tu ubicación. Responsabilidad: Es responsabilidad del
                  cliente proporcionar una dirección exacta. AppCelulares no se
                  hace responsable por retrasos derivados de datos incorrectos.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900">
                  3. Garantía y Devoluciones:
                </h2>
                <p>
                  La calidad es nuestra prioridad. Si recibes un producto con
                  defectos de fábrica: Tienes un plazo de 48 horas tras recibir
                  el paquete para reportar cualquier inconveniente físico. La
                  garantía de software/hardware cubre 12 meses directamente con
                  la marca. El producto debe estar en su empaque original y sin
                  señales de mal uso. No se aceptan devoluciones por "cambio de
                  opinión" una vez abierto el empaque sellado.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="text-lg font-bold text-gray-900">
                  4. Pagos y Seguridad:
                </h2>
                <p>
                  Nuestra plataforma de pago es confiable y cifrada. El pedido
                  se procesará una vez confirmado el pago exitoso por nuestra
                  entidad bancaria o pasarela de pagos.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
