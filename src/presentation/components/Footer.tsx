// src/presentation/components/Footer.tsx
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-content1 border-t border-divider py-12 md:py-16 mt-auto font-sans">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12">
          {/* Columna 1: Marca */}
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="text-2xl font-bold text-foreground tracking-tight hover:opacity-70 transition-opacity"
            >
              AppCelulares
            </Link>
            <p className="text-sm font-light text-default-500 leading-relaxed pr-4">
              Llevamos la mejor tecnología y equipos de gama alta directo a tus
              manos con una experiencia de compra rápida y segura.
            </p>
          </div>

          {/* Columna 2: Productos */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">
              Productos
            </h3>
            <ul className="flex flex-col gap-3 text-sm font-light text-default-500">
              <li>
                <Link
                  to="/?q=apple"
                  className="text-default-500 hover:text-foreground hover:opacity-80 transition-colors"
                >
                  Apple
                </Link>
              </li>
              <li>
                <Link
                  to="/?q=samsung"
                  className="text-default-500 hover:text-foreground hover:opacity-80 transition-colors"
                >
                  Samsung
                </Link>
              </li>
              <li>
                <Link
                  to="/?q=xiaomi"
                  className="text-default-500 hover:text-foreground hover:opacity-80 transition-colors"
                >
                  Xiaomi
                </Link>
              </li>
              <li>
                <Link
                  to="/?q=google"
                  className="text-default-500 hover:text-foreground hover:opacity-80 transition-colors"
                >
                  Google
                </Link>
              </li>
              <li>
                <Link
                  to="/?q=motorola"
                  className="text-default-500 hover:text-foreground hover:opacity-80 transition-colors"
                >
                  Motorola
                </Link>
              </li>
              <li className="mt-2">
                <Link
                  to="/"
                  className="font-medium text-foreground hover:opacity-80 hover:underline transition-all"
                >
                  Ver todo el catálogo →
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">
              Legal
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-light text-default-500">
              <li>
                <Link
                  to="/privacidad"
                  className="flex items-center gap-2 text-default-500 hover:text-foreground hover:opacity-80 transition-colors group"
                >
                  <ShieldCheck
                    size={16}
                    strokeWidth={1.5}
                    className="text-default-500 group-hover:text-foreground transition-colors"
                  />
                  Políticas de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/terminos"
                  className="flex items-center gap-2 text-default-500 hover:text-foreground hover:opacity-80 transition-colors group"
                >
                  <FileText
                    size={16}
                    strokeWidth={1.5}
                    className="text-default-500 group-hover:text-foreground transition-colors"
                  />
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider mb-5">
              Contacto
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-light text-default-500">
              <li className="flex items-center gap-3">
                <Phone
                  size={16}
                  strokeWidth={1.5}
                  className="text-default-500"
                />
                <span>+51 999 888 777</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail
                  size={16}
                  strokeWidth={1.5}
                  className="text-default-500"
                />
                <span>info@appcelulares.pe</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador de Copyright */}
        <div className="border-t border-divider mt-12 pt-8 text-center text-xs font-light text-default-500">
          © {new Date().getFullYear()} AppCelulares. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
};
