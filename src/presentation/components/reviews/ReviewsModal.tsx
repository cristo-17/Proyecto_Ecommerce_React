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

  // Renderizador de Estrellas (Estilo Minimalista Premium)
  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={interactive ? 24 : 14}
            strokeWidth={interactive ? 1.5 : 2}
            className={`${
              star <= rating
                ? "fill-zinc-800 text-zinc-800"
                : "fill-zinc-100 text-zinc-200"
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
      backdrop="blur"
      classNames={{
        base: "bg-white rounded-2xl shadow-sm border border-zinc-200/60",
        header: "border-b border-zinc-100 py-6 px-8",
        body: "py-6 px-8",
        footer: "border-t border-zinc-100 py-4 px-8",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1.5">
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            Opiniones de los Clientes
          </h2>
          <div className="flex items-center gap-3 text-sm text-zinc-500 font-light">
            {renderStars(4.8)}
            <span>4.8 de 5 ({productReviews.length} reseñas)</span>
          </div>
        </ModalHeader>

        <ModalBody className="flex flex-col gap-8">
          {/* Formulario o Alerta según el rol del usuario */}
          {userRole === "INVITADO" ? (
            <div className="bg-zinc-50 border border-zinc-200/60 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="flex items-center gap-3 text-zinc-600">
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0 text-zinc-400"
                  strokeWidth={1.5}
                />
                <p className="font-light text-sm tracking-wide">
                  Debes iniciar sesión como cliente para dejar una opinión sobre
                  este equipo.
                </p>
              </div>
              <Button
                as={Link}
                to="/login"
                color="default"
                variant="bordered"
                size="sm"
                className="font-medium border-zinc-200 hover:bg-white text-zinc-700 flex-shrink-0 transition-colors"
              >
                Iniciar Sesión
              </Button>
            </div>
          ) : userRole === "CLIENTE" ? (
            <div className="bg-zinc-50/50 p-6 rounded-2xl border border-zinc-100 flex flex-col gap-5">
              <h3 className="font-semibold text-zinc-900 tracking-tight">
                Escribe tu opinión
              </h3>
              <div>
                <p className="text-xs text-zinc-500 font-medium uppercase tracking-widest mb-3">
                  Calificación:
                </p>
                {renderStars(nuevaCalificacion, true)}
              </div>
              <textarea
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                placeholder="¿Qué te pareció este celular?..."
                className="w-full p-4 rounded-xl border border-zinc-200/60 focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 outline-none transition-all resize-none h-28 text-sm text-zinc-900 placeholder:text-zinc-400 bg-white shadow-sm"
              />
              <div className="flex justify-end mt-1">
                <Button
                  color="default"
                  className="font-medium bg-zinc-900 text-white shadow-none hover:bg-zinc-800 transition-colors px-8"
                >
                  Publicar Opinión
                </Button>
              </div>
            </div>
          ) : null}

          {/* Admin y Proveedor no pueden dejar reseñas como clientes */}
          {/* Lista de Reseñas */}
          <div className="flex flex-col">
            {productReviews.map((resena) => (
              <div
                key={resena.id}
                className="flex flex-col gap-3 py-6 border-b border-zinc-100 last:border-0 first:pt-0"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-medium text-zinc-900 tracking-tight">
                      {resena.autorNombre}
                    </span>
                    <div className="flex items-center gap-3">
                      {renderStars(resena.calificacion)}
                      <span className="text-xs font-light text-zinc-400">
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
                    <div className="flex gap-1">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="default"
                        aria-label="Editar"
                        className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                      >
                        <Pencil size={14} strokeWidth={1.5} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                        color="danger"
                        aria-label="Eliminar"
                        className="text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} strokeWidth={1.5} />
                      </Button>
                    </div>
                  )}
                </div>
                <p className="text-zinc-700 text-sm mt-2 font-light leading-relaxed tracking-wide">
                  {resena.comentario}
                </p>
              </div>
            ))}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors px-6"
          >
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
