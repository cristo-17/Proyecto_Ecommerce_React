// src/presentation/components/reviews/ReviewsModal.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Star, Pencil, Trash2, AlertCircle } from "lucide-react";
import type { Resena } from "../../../domain/models/appCelulares.model";

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

// Mock Data de Reseñas
const MOCK_REVIEWS: Resena[] = [
  {
    id: "rev-1",
    celularId: "cel-001",
    autorId: "mock-user-1", // Simulación de usuario activo
    autorNombre: "Usuario Activo",
    calificacion: 5,
    comentario:
      "Excelente rendimiento. Lo uso para jugar simuladores de camiones durante horas y los gráficos van súper fluidos sin calentarse. El diseño M Edition es brutal.",
    fecha: new Date("2026-07-01"),
  },
  {
    id: "rev-2",
    celularId: "cel-001",
    autorId: "mock-user-2",
    autorNombre: "Luis M.",
    calificacion: 5,
    comentario:
      "La cámara es increíble y el diseño hermoso. Lo compré para regalárselo a mi novia y quedó totalmente fascinada.",
    fecha: new Date("2026-07-05"),
  },
  {
    id: "rev-3",
    celularId: "cel-001",
    autorId: "mock-user-3",
    autorNombre: "Carlos G.",
    calificacion: 4,
    comentario:
      "Muy buen equipo, aunque el precio es un poco elevado. La batería dura todo el día sin problemas.",
    fecha: new Date("2026-07-09"),
  },
];

export const ReviewsModal = ({
  isOpen,
  onClose,
  productId,
}: ReviewsModalProps) => {
  // Simulación de sesión
  const userRole = localStorage.getItem("user_role") || "INVITADO";
  const currentUserId = localStorage.getItem("user_id") || "mock-user-1";

  // Estado para el formulario de nueva reseña
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5);
  const [nuevoComentario, setNuevoComentario] = useState("");

  // Filtrar reseñas del producto actual (simulado)
  const productReviews = MOCK_REVIEWS.filter(
    (r) => r.celularId === productId || productId === "cel-001",
  );

  // Renderizador de Estrellas
  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 16}
            className={`${
              star <= rating
                ? "fill-warning text-warning"
                : "fill-transparent text-gray-300"
            } ${interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}`}
            onClick={() => interactive && setNuevaCalificacion(star)}
          />
        ))}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Opiniones de los Clientes
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {renderStars(4.8)}
            <span>4.8 de 5 ({productReviews.length} reseñas)</span>
          </div>
        </ModalHeader>

        <ModalBody className="py-6 flex flex-col gap-8">
          {/* Formulario o Alerta según el rol del usuario */}
          {userRole === "INVITADO" ? (
            <div className="bg-warning-50 border border-warning-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-warning-700">
                <AlertCircle className="w-6 h-6 flex-shrink-0" />
                <p className="font-medium text-sm">
                  Debes iniciar sesión como cliente para dejar una opinión sobre
                  este equipo.
                </p>
              </div>
              <Button
                as={Link}
                to="/login"
                color="warning"
                variant="flat"
                size="sm"
                className="font-bold flex-shrink-0"
              >
                Iniciar Sesión
              </Button>
            </div>
          ) : userRole === "CLIENTE" ? (
            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100 flex flex-col gap-4">
              <h3 className="font-bold text-gray-800">Escribe tu opinión</h3>
              <div>
                <p className="text-sm text-gray-600 mb-2">Calificación:</p>
                {renderStars(nuevaCalificacion, true)}
              </div>
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="¿Qué te pareció este celular?..."
                className="w-full p-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24 text-sm"
              />
              <div className="flex justify-end">
                <Button color="primary" className="font-bold px-8">
                  Publicar Opinión
                </Button>
              </div>
            </div>
          ) : null}{" "}
          {/* Admin y Proveedor no pueden dejar reseñas como clientes */}
          {/* Lista de Reseñas */}
          <div className="flex flex-col gap-6">
            {productReviews.map((resena) => (
              <div
                key={resena.id}
                className="flex flex-col gap-2 pb-6 border-b border-gray-100 last:border-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-gray-900">
                      {resena.autorNombre}
                    </span>
                    <div className="flex items-center gap-2">
                      {renderStars(resena.calificacion)}
                      <span className="text-xs text-gray-400">
                        {resena.fecha.toLocaleDateString("es-ES", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  {/* LÓGICA DE AUTORIZACIÓN: Editar / Eliminar */}
                  {resena.autorId === currentUserId && (
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="default"
                        aria-label="Editar"
                      >
                        <Pencil size={14} className="text-gray-500" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="Eliminar"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                  {resena.comentario}
                </p>
              </div>
            ))}
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-gray-100">
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            className="font-medium"
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
