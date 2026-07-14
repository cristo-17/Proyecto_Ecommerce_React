// src/presentation/components/CreditCardDisplay.tsx
import { useMemo } from "react";
import { motion } from "framer-motion";

interface CreditCardDisplayProps {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  isFlipped: boolean;
}

// 1. Diccionario de BINs Locales (Perú)
const BANK_BINS = {
  bcp: ["455783", "455784", "421425", "421426", "123456"],
  interbank: ["406323", "406324", "410543", "450995", "234567"],
  bbva: ["404288", "455322", "455323", "491419", "345678"],
};

type BankType = "default" | "bcp" | "interbank" | "bbva";

export const CreditCardDisplay = ({
  cardNumber,
  cardHolder,
  expiryDate,
  cvv,
  isFlipped,
}: CreditCardDisplayProps) => {
  // 2. Lógica de Detección en Tiempo Real
  const currentBank = useMemo<BankType>(() => {
    const cleanNumber = cardNumber.replace(/\D/g, "");
    if (cleanNumber.length >= 6) {
      const bin = cleanNumber.substring(0, 6);
      if (BANK_BINS.bcp.includes(bin)) return "bcp";
      if (BANK_BINS.interbank.includes(bin)) return "interbank";
      if (BANK_BINS.bbva.includes(bin)) return "bbva";
    }
    return "default";
  }, [cardNumber]);

  // 3. Estilos Dinámicos (Tailwind v4) adaptados para buen contraste
  const bankStyles = {
    default: {
      bg: "bg-gradient-to-tr from-zinc-900 to-zinc-800 border-zinc-800",
      text: "text-zinc-100",
      label: "text-zinc-400",
      icon: "text-zinc-400",
      lines: "bg-zinc-600",
    },
    bcp: {
      bg: "bg-gradient-to-br from-slate-700 to-slate-900 border-orange-500/30",
      text: "text-white",
      label: "text-orange-200/70",
      icon: "text-orange-400/60",
      lines: "bg-slate-600",
    },
    interbank: {
      bg: "bg-white border-zinc-200",
      text: "text-zinc-900",
      label: "text-zinc-500", // Letras descriptivas grises para contraste en fondo blanco
      icon: "text-emerald-600/60",
      lines: "bg-zinc-200",
    },
    bbva: {
      bg: "bg-gradient-to-tr from-blue-900 to-blue-800 border-blue-700/50",
      text: "text-white",
      label: "text-blue-300/80",
      icon: "text-blue-300/60",
      lines: "bg-blue-700",
    },
  };

  const style = bankStyles[currentBank];

  // Formateo visual seguro para campos vacíos (Placeholders)
  const displayCardNumber = cardNumber || "•••• •••• •••• ••••";
  const displayCardHolder = cardHolder || "NOMBRE DEL TITULAR";
  const displayExpiryDate = expiryDate || "MM/YY";
  const displayCvv = cvv || "•••";

  return (
    <div
      className="w-full max-w-[340px] sm:max-w-[380px] aspect-[1.586/1] mx-auto"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className="relative w-full h-full shadow-xl shadow-black/10 rounded-2xl"
        style={{ transformStyle: "preserve-3d" }}
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: "spring",
          stiffness: 260,
          damping: 20,
        }}
      >
        {/* ==========================================
            CARA FRONTAL
            ========================================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl border transition-all duration-500 p-6 flex flex-col justify-between ${style.bg}`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-start">
            {/* Chip EMV Simulado */}
            <div className="w-12 h-9 bg-gradient-to-br from-zinc-300 to-zinc-400 rounded-md flex items-center justify-center opacity-90 overflow-hidden relative shadow-sm">
              <div className="w-full h-[1px] bg-zinc-500/40 absolute" />
              <div className="h-full w-[1px] bg-zinc-500/40 absolute" />
              <div className="w-7 h-5 border border-zinc-500/40 rounded-sm" />
            </div>

            {/* Renderizado Condicional del Logo del Banco y Contactless */}
            <div className="flex items-center gap-3">
              {currentBank === "bcp" && (
                <span className="text-xl font-black italic tracking-tighter text-white drop-shadow-sm">
                  &gt;BCP&gt;
                </span>
              )}
              {currentBank === "interbank" && (
                <span className="text-lg font-bold tracking-tight text-emerald-600">
                  Interbank
                </span>
              )}
              {currentBank === "bbva" && (
                <span className="text-xl font-bold tracking-widest text-white drop-shadow-sm">
                  BBVA
                </span>
              )}

              {/* Ícono Contactless Minimalista */}
              <svg
                className={`w-6 h-6 transition-colors duration-500 ${style.icon}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          <div className="mt-6 flex-grow flex items-center">
            <p
              className={`font-mono text-xl sm:text-2xl tracking-[0.15em] drop-shadow-sm transition-colors duration-500 ${style.text}`}
            >
              {displayCardNumber}
            </p>
          </div>

          <div className="flex justify-between items-end mt-4">
            <div className="flex flex-col">
              <span
                className={`text-[10px] uppercase tracking-widest mb-1 font-semibold transition-colors duration-500 ${style.label}`}
              >
                Titular
              </span>
              <span
                className={`font-medium text-sm sm:text-base tracking-widest uppercase truncate max-w-[200px] transition-colors duration-500 ${style.text}`}
              >
                {displayCardHolder}
              </span>
            </div>
            <div className="flex flex-col items-end">
              <span
                className={`text-[10px] uppercase tracking-widest mb-1 font-semibold transition-colors duration-500 ${style.label}`}
              >
                Vence
              </span>
              <span
                className={`font-mono text-sm sm:text-base tracking-widest transition-colors duration-500 ${style.text}`}
              >
                {displayExpiryDate}
              </span>
            </div>
          </div>
        </div>

        {/* ==========================================
            CARA TRASERA
            ========================================== */}
        <div
          className={`absolute inset-0 w-full h-full rounded-2xl border transition-all duration-500 overflow-hidden ${style.bg}`}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Banda Magnética */}
          <div className="w-full h-12 sm:h-14 bg-black/80 mt-6" />

          {/* Panel de Firma y CVV */}
          <div className="w-full px-6 mt-6">
            <div className="flex items-center justify-end w-full h-10 sm:h-12 bg-zinc-100 rounded-sm px-4 border border-zinc-200">
              <span className="font-mono text-zinc-900 text-sm sm:text-base tracking-widest italic font-bold">
                {displayCvv}
              </span>
            </div>
          </div>

          {/* Líneas Decorativas (Simulación de texto legal) */}
          <div className="px-6 mt-6 flex flex-col gap-2">
            <div
              className={`w-3/4 h-1 rounded-full transition-colors duration-500 ${style.lines}`}
            />
            <div
              className={`w-1/2 h-1 rounded-full transition-colors duration-500 ${style.lines}`}
            />
            <div
              className={`w-5/6 h-1 rounded-full transition-colors duration-500 ${style.lines}`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
