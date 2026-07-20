// src/presentation/components/reviews/ReviewsModal.tsx
import { useState, useEffect } from "react";
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
import { useAuthStore } from "../../../application/store/useAuthStore";
import { reviewService } from "../../../infrastructure/services/reviewService";

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

export const ReviewsModal = ({
  isOpen,
  onClose,
  productId,
}: ReviewsModalProps) => {
  const { user } = useAuthStore();
  const userRole = user?.rol || "INVITADO";
  const currentUserId = user?.id;

  const [reviews, setReviews] = useState<Resena[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para el formulario de nueva reseña
  const [nuevaCalificacion, setNuevaCalificacion] = useState(5);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Cargar reseñas del producto
  const fetchReviews = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await reviewService.getByProduct(productId);
      setReviews(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Error al cargar reseñas");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen, productId]);

  // Publicar nueva reseña
  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await reviewService.create(productId, {
        calificacion: nuevaCalificacion,
        comentario: nuevoComentario,
      });
      setNuevoComentario("");
      setNuevaCalificacion(5);
      await fetchReviews(); // Refrescar lista
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al publicar reseña");
    } finally {
      setIsPublishing(false);
    }
  };

  // Eliminar reseña
  const handleDelete = async (id: string) => {
    try {
      await reviewService.delete(id);
      await fetchReviews();
    } catch (err: any) {
      alert(err.response?.data?.message || "Error al eliminar reseña");
    }
  };

  // Renderizador de Estrellas
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

  // Calcular promedio
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.calificacion, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

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
            {renderStars(Number(averageRating))}
            <span>
              {averageRating} de 5 ({reviews.length} reseñas)
            </span>
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
                  onPress={handlePublish}
                  isLoading={isPublishing}
                  className="font-medium bg-zinc-900 text-white shadow-none hover:bg-zinc-800 transition-colors px-8"
                >
                  Publicar Opinión
                </Button>
              </div>
            </div>
          ) : null}

          {/* Loading / Error */}
          {isLoading && (
            <p className="text-center text-default-500">Cargando reseñas...</p>
          )}
          {error && <p className="text-center text-danger">{error}</p>}

          {/* Lista de Reseñas */}
          <div className="flex flex-col">
            {reviews.map((resena) => (
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
                        {new Date(resena.fecha).toLocaleDateString("es-ES", {
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
                        onPress={() => handleDelete(resena.id)}
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
