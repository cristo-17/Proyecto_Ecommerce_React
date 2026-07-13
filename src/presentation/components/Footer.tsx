// src/presentation/components/Footer.tsx
import { Link } from "react-router-dom";
import { ShieldCheck, FileText, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200 pt-12 pb-8 mt-auto">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Columna 1: Marca */}
          <div className="flex flex-col gap-4">
            <Link
              to="/"
              className="font-bold text-2xl text-primary hover:opacity-80 transition-opacity"
            >
              AppCelulares
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed">
              Llevamos la mejor tecnología y equipos de gama alta directo a tus
              manos con una experiencia de compra rápida y segura.
            </p>
          </div>

          {/* Columna 2: Productos */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">
              Productos
            </h3>
            <ul className="flex flex-col gap-2 text-sm text-gray-600">
              <li>
                <Link
                  to="/?q=apple"
                  className="hover:text-primary transition-colors"
                >
                  Apple
                </Link>
              </li>
              <li>
                <Link
                  to="/?q=samsung"
                  className="hover:text-primary transition-colors"
                >
                  Samsung
                </Link>
              </li>
              <li>
                <Link
                  to="/?q=xiaomi"
                  className="hover:text-primary transition-colors"
                >
                  Xiaomi
                </Link>
              </li>
              <li>
                <Link
                  to="/?q=google"
                  className="hover:text-primary transition-colors"
                >
                  Google
                </Link>
              </li>
              <li>
                <Link
                  to="/?q=motorola"
                  className="hover:text-primary transition-colors"
                >
                  Motorola
                </Link>
              </li>
              <li className="mt-2">
                <Link
                  to="/"
                  className="text-primary font-semibold hover:underline"
                >
                  Ver todo el catálogo →
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Legal */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">
              Legal
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              <li>
                <Link
                  to="/privacidad"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <ShieldCheck size={16} />
                  Políticas de Privacidad
                </Link>
              </li>
              <li>
                <Link
                  to="/terminos"
                  className="flex items-center gap-2 hover:text-primary transition-colors"
                >
                  <FileText size={16} />
                  Términos de Servicio
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto */}
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm">
              Contacto
            </h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-primary" />
                <span>+51 999 888 777</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <span>info@appcelulares.pe</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} AppCelulares. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
};
