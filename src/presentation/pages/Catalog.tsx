// src/presentation/pages/Catalog.tsx
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Image } from "@heroui/image";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Checkbox } from "@heroui/checkbox";
import { Slider, Label } from "@heroui/react";
import { SearchX, Search } from "lucide-react";

// Importación exclusiva de nuestra lógica separada (Clean Architecture)
import { useCatalogFilters } from "../../application/hooks/useCatalogFilters";

const AVAILABLE_BRANDS = ["Apple", "Samsung", "Xiaomi", "Google", "Motorola"];

export const Catalog = () => {
  const navigate = useNavigate();

  // Consumimos el estado y la lógica de filtrado desde nuestro Hook
  const {
    searchTerm,
    setSearchTerm,
    selectedBrands,
    toggleBrand,
    priceRange,
    setPriceRange,
    filteredProducts,
  } = useCatalogFilters();

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl font-sans">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* =========================================
            BARRA LATERAL (FILTROS)
            ========================================= */}
        <aside className="w-full lg:w-1/4 flex flex-col gap-10">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-2">
              Catálogo
            </h1>
            <p className="text-sm font-light text-default-500 tracking-wide">
              Descubre nuestra selección de equipos de gama alta.
            </p>
          </div>

          <div className="flex flex-col gap-8">
            {/* Buscador */}
            <div>
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Buscar Equipo
              </h3>
              <Input
                variant="bordered"
                placeholder="Ej. Galaxy, iPhone..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                startContent={
                  <Search
                    size={16}
                    strokeWidth={1.5}
                    className="text-default-400"
                  />
                }
                classNames={{
                  inputWrapper:
                    "border-divider bg-content1 shadow-none hover:border-divider focus-within:!border-foreground transition-colors",
                  input: "text-foreground text-sm placeholder:text-default-400",
                }}
              />
            </div>

            {/* Filtro por Marca */}
            <div className="border-t border-divider pt-8">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Marcas
              </h3>
              <div className="flex flex-col gap-4">
                {AVAILABLE_BRANDS.map((brand) => (
                  <Checkbox
                    key={brand}
                    isSelected={selectedBrands.includes(brand)}
                    onValueChange={() => toggleBrand(brand)}
                    classNames={{
                      label: "text-sm text-default-500 font-light",
                      wrapper:
                        "group-data-[selected=true]:bg-foreground group-data-[selected=true]:border-foreground text-background",
                    }}
                  >
                    {brand}
                  </Checkbox>
                ))}
              </div>
            </div>

            {/* Filtro por Precio */}
            <div className="border-t border-divider pt-8">
              <h3 className="text-xs font-semibold text-foreground uppercase tracking-widest mb-4">
                Rango de Precio
              </h3>

              <Label className="text-sm text-default-500 font-light mb-4">
                Selecciona el rango de precios que deseas ver.
              </Label>

              {/* El componente raíz Slider ahora junta tus antiguas clases 'base' y 'className' */}
              <Slider
                step={50}
                minValue={0}
                maxValue={2000}
                value={priceRange}
                onChange={setPriceRange}
                formatOptions={{ style: "currency", currency: "USD" }}
                className="max-w-md w-full"
              >
                {/* Muestra el precio formateado con los estilos que tenías en 'value' */}
                <Slider.Output className="text-default-500 font-medium text-sm" />

                {/* Contenedor de la barra (reemplaza a 'track') */}
                <Slider.Track className="bg-default-200/60 border-s-foreground">
                  {/* Barra de progreso/relleno (reemplaza a 'filler') */}
                  <Slider.Fill className="bg-foreground" />

                  {/* El botón deslizante (reemplaza a 'thumb') */}
                  {/* Nota: Al usar un rango (array de dos números), v3 renderiza automáticamente dos selectores si pasas un array en 'value' */}
                  <Slider.Thumb className="bg-foreground border-foreground after:bg-foreground" />
                </Slider.Track>
              </Slider>
            </div>
          </div>
        </aside>

        {/* =========================================
            ZONA PRINCIPAL (PRODUCTOS)
            ========================================= */}
        <main className="w-full lg:w-3/4">
          <div className="mb-6 flex justify-between items-end border-b border-divider pb-4">
            <h2 className="text-lg font-medium text-foreground tracking-tight">
              {searchTerm || selectedBrands.length > 0
                ? "Resultados de búsqueda"
                : "Todos los equipos"}
            </h2>
            <span className="text-sm font-light text-default-500">
              {filteredProducts.length}{" "}
              {filteredProducts.length === 1 ? "producto" : "productos"}
            </span>
          </div>

          {/* Estado Vacío */}
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-4 text-center border border-dashed border-divider rounded-2xl bg-content1">
              <div className="bg-content1 p-5 rounded-full text-default-400 mb-6 shadow-sm border border-divider">
                <SearchX size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-lg font-medium text-foreground mb-2 tracking-tight">
                No encontramos coincidencias
              </h2>
              <p className="text-default-500 font-light max-w-sm mx-auto mb-8 text-sm">
                No hay resultados para los filtros seleccionados. Intenta
                ampliar el rango de precio o eliminar algunas marcas.
              </p>
              <Button
                color="default"
                variant="bordered"
                className="bg-content1 border-divider text-foreground font-medium hover:bg-default-100 transition-colors"
                onPress={() => {
                  setSearchTerm("");
                  setPriceRange([0, 2000]);
                }}
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            /* Grilla de Productos */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product.id}
                  shadow="none"
                  radius="sm"
                  className="w-full flex flex-col bg-content1 transition-all duration-300 border border-divider hover:shadow-md hover:border-divider rounded-xl"
                >
                  <CardHeader className="p-6 flex-col items-center bg-content1 overflow-hidden rounded-t-xl h-56 border-b border-divider">
                    <Image
                      alt={product.modelo}
                      className="object-contain w-full h-full hover:scale-105 transition-transform duration-500 ease-out"
                      src={product.imagenUrl}
                      radius="none"
                      loading="lazy"
                    />
                  </CardHeader>

                  <CardBody className="pb-4 pt-6 px-6 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-default-400 tracking-widest mb-2 uppercase">
                      {product.marca}
                    </p>
                    <h4 className="font-medium text-foreground leading-snug mb-4 line-clamp-2 tracking-tight">
                      {product.modelo}
                    </h4>

                    <div className="mt-auto">
                      <p className="text-xl font-medium text-foreground tracking-tight">
                        $
                        {product.precio.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </CardBody>

                  <CardFooter className="px-6 pb-6 pt-2">
                    <Button
                      onPress={() => navigate("/producto/" + product.id)}
                      color="default"
                      variant="bordered"
                      className="font-medium w-full border-divider text-foreground hover:bg-default-100 transition-colors"
                    >
                      Ver detalles
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
