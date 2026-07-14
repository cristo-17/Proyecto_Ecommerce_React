// src/presentation/pages/ProveedorForm.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/table";
import { Chip } from "@heroui/chip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { AlertTriangle, Trash2, Pencil } from "lucide-react";

// Mock Data alineado con la interfaz de dominio (emailContacto)
const INITIAL_PROVIDERS = [
  {
    id: "prov-1",
    razonSocial: "Samsung Global",
    ruc: "20123456789",
    emailContacto: "samsung@corp.com",
    telefono: "999-888-777",
    direccion: "Av. Tecnológica 123",
    estado: "ACTIVO",
  },
  {
    id: "prov-2",
    razonSocial: "AppleCorp Peru",
    ruc: "20987654321",
    emailContacto: "ventas@apple.pe",
    telefono: "987-654-321",
    direccion: "Av. Las Manzanas 456",
    estado: "ACTIVO",
  },
];

export const ProveedorForm = () => {
  const userRole = localStorage.getItem("user_role") || "INVITADO";

  // --- ESTADOS PARA MODO ADMIN ---
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<any>(null);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState<any>(null);

  // --- HOOK FORM PARA MODO PROVEEDOR ---
  const { register, handleSubmit } = useForm({
    defaultValues: {
      razonSocial: "Samsung Global",
      ruc: "20123456789",
      telefono: "999-888-777",
      direccion: "Av. Tecnológica 123",
    },
  });

  // --- HANDLERS ---
  const onSubmitProvider = (data: any) => {
    alert("Datos actualizados: " + JSON.stringify(data));
  };

  const handleOpenDelete = (provider: any) => {
    setProviderToDelete(provider);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    setProviders(providers.filter((p) => p.id !== providerToDelete?.id));
    setIsDeleteModalOpen(false);
    setProviderToDelete(null);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegisterOpen(false);
    alert("Proveedor registrado exitosamente con estado ACTIVO.");
  };

  const handleOpenEdit = (provider: any) => {
    setProviderToEdit(provider);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    alert("Proveedor editado exitosamente.");
  };

  // Clases compartidas para inputs minimalistas
  const inputMinimalistClasses = {
    inputWrapper:
      "border-zinc-200 bg-white shadow-none hover:border-zinc-300 focus-within:!border-zinc-900 transition-colors",
    label: "text-zinc-500 font-medium text-xs",
    input: "text-zinc-900 placeholder:text-zinc-400",
  };

  // ----------------------------------------------------
  // VISTA 1: MODO PROVEEDOR (Mi Perfil de Empresa)
  // ----------------------------------------------------
  if (userRole === "PROVEEDOR") {
    return (
      <div className="flex justify-center items-start w-full max-w-4xl mx-auto">
        <Card
          shadow="none"
          className="w-full bg-white border border-zinc-200/60 rounded-2xl mt-4"
        >
          <CardHeader className="px-8 pt-8 pb-4 border-b border-zinc-100">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                Mis Datos de Empresa
              </h2>
              <p className="text-sm font-light text-zinc-500 mt-1">
                Actualiza la información visible de tu compañía.
              </p>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <form
              onSubmit={handleSubmit(onSubmitProvider)}
              className="flex flex-col gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  {...register("razonSocial")}
                  label="Razón Social"
                  variant="bordered"
                  classNames={inputMinimalistClasses}
                />
                <Input
                  {...register("ruc")}
                  label="RUC"
                  variant="bordered"
                  isDisabled
                  description={
                    <span className="text-zinc-400 text-xs">
                      El RUC no puede ser modificado
                    </span>
                  }
                  classNames={inputMinimalistClasses}
                />
                <Input
                  {...register("telefono")}
                  label="Teléfono de Contacto"
                  variant="bordered"
                  classNames={inputMinimalistClasses}
                />
                <Input
                  {...register("direccion")}
                  label="Dirección Fiscal"
                  variant="bordered"
                  classNames={inputMinimalistClasses}
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  color="default"
                  size="lg"
                  className="font-medium bg-zinc-900 text-white hover:bg-zinc-800 shadow-none px-8 transition-colors"
                >
                  Guardar Cambios
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------
  // VISTA 2: MODO ADMIN (Gestión de Proveedores)
  // ----------------------------------------------------
  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-8 rounded-2xl border border-zinc-200/60 gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-zinc-900 tracking-tight">
            Gestión de Proveedores
          </h1>
          <p className="text-zinc-500 font-light mt-2 tracking-wide">
            Administra las empresas asociadas a la plataforma y sus estados.
          </p>
        </div>
        <Button
          color="default"
          size="lg"
          className="font-medium bg-zinc-900 text-white hover:bg-zinc-800 shadow-none transition-colors"
          onPress={() => setIsRegisterOpen(true)}
        >
          + Registrar Proveedor
        </Button>
      </div>

      <Card
        shadow="none"
        className="bg-white border border-zinc-200/60 rounded-2xl overflow-hidden"
      >
        <CardBody className="p-0">
          <Table
            aria-label="Gestión de proveedores"
            removeWrapper
            classNames={{
              th: "bg-zinc-50/50 text-zinc-500 font-semibold tracking-wider text-xs px-6 py-4 border-b border-zinc-100 uppercase",
              td: "px-6 py-4 border-b border-zinc-50/80 last:border-0",
            }}
          >
            <TableHeader>
              <TableColumn>RAZÓN SOCIAL</TableColumn>
              <TableColumn>RUC</TableColumn>
              <TableColumn>CONTACTO</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn align="center">ACCIONES</TableColumn>
            </TableHeader>
            <TableBody items={providers}>
              {(item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-zinc-50/50 transition-colors"
                >
                  <TableCell className="font-medium text-zinc-900 tracking-tight">
                    {item.razonSocial}
                  </TableCell>
                  <TableCell className="text-zinc-500 font-light tracking-wide">
                    {item.ruc}
                  </TableCell>
                  <TableCell className="text-zinc-500 font-light">
                    {item.emailContacto}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={item.estado === "ACTIVO" ? "default" : "danger"}
                      variant="flat"
                      size="sm"
                      className={`font-medium tracking-wide ${
                        item.estado === "ACTIVO"
                          ? "bg-zinc-100 text-zinc-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {item.estado}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        color="default"
                        variant="light"
                        className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                        onPress={() => handleOpenEdit(item)}
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        className="text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        onPress={() => handleOpenDelete(item)}
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* MODAL: ELIMINACIÓN EN CASCADA (ADMIN) */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={() => setIsDeleteModalOpen(false)}
        size="md"
        backdrop="blur"
        classNames={{
          base: "bg-white rounded-2xl shadow-sm border border-zinc-200/60",
          header: "border-b border-zinc-100 py-4 px-6",
          body: "py-6 px-6",
          footer: "border-t border-zinc-100 py-4 px-6",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex gap-3 items-center text-zinc-900 font-semibold text-lg tracking-tight">
            <div className="p-2 bg-red-50 rounded-full text-red-600">
              <AlertTriangle size={18} strokeWidth={2} />
            </div>
            Advertencia Crítica
          </ModalHeader>
          <ModalBody>
            <p className="text-zinc-600 font-light text-sm leading-relaxed">
              Estás a punto de eliminar al proveedor{" "}
              <strong className="font-semibold text-zinc-900">
                {providerToDelete?.razonSocial}
              </strong>
              .
            </p>
            <div className="bg-red-50/50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mt-2 leading-relaxed">
              <strong className="font-semibold">Borrado en Cascada:</strong>{" "}
              Esta acción eliminará permanentemente todos los celulares,
              inventario y reseñas asociados a este proveedor del catálogo
              público.
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
              onPress={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmDelete}
              className="font-medium bg-red-600 text-white hover:bg-red-700 shadow-none px-6 transition-colors"
            >
              Eliminar Definitivamente
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* MODAL: REGISTRAR PROVEEDOR (ADMIN) */}
      <Modal
        isOpen={isRegisterOpen}
        onOpenChange={() => setIsRegisterOpen(false)}
        size="lg"
        backdrop="blur"
        classNames={{
          base: "bg-white rounded-2xl shadow-sm border border-zinc-200/60",
          header: "border-b border-zinc-100 py-5 px-8",
          body: "py-6 px-8",
          footer: "border-t border-zinc-100 py-5 px-8",
        }}
      >
        <ModalContent>
          <form onSubmit={handleRegisterSubmit}>
            <ModalHeader className="font-bold text-xl text-zinc-900 tracking-tight">
              Registrar Nuevo Proveedor
            </ModalHeader>
            <ModalBody className="flex flex-col gap-5">
              <Input
                label="Razón Social"
                placeholder="Ej. TechCorp SAC"
                variant="bordered"
                isRequired
                classNames={inputMinimalistClasses}
              />
              <Input
                label="RUC"
                placeholder="Ej. 20123456789"
                variant="bordered"
                isRequired
                classNames={inputMinimalistClasses}
              />
              <Input
                label="Correo de Contacto"
                type="email"
                placeholder="contacto@techcorp.com"
                variant="bordered"
                isRequired
                classNames={inputMinimalistClasses}
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Teléfono"
                  placeholder="Ej. 999 888 777"
                  variant="bordered"
                  isRequired
                  classNames={inputMinimalistClasses}
                />
                <Input
                  label="Dirección Fiscal"
                  placeholder="Ej. Av. Principal 123"
                  variant="bordered"
                  isRequired
                  classNames={inputMinimalistClasses}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                onPress={() => setIsRegisterOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                color="default"
                type="submit"
                className="font-medium bg-zinc-900 text-white shadow-none hover:bg-zinc-800 transition-colors px-6"
              >
                Guardar Proveedor
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* MODAL: EDITAR PROVEEDOR (ADMIN) */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(false)}
        size="lg"
        backdrop="blur"
        classNames={{
          base: "bg-white rounded-2xl shadow-sm border border-zinc-200/60",
          header: "border-b border-zinc-100 py-5 px-8",
          body: "py-6 px-8",
          footer: "border-t border-zinc-100 py-5 px-8",
        }}
      >
        <ModalContent>
          <form onSubmit={handleEditSubmit}>
            <ModalHeader className="font-bold text-xl text-zinc-900 tracking-tight">
              Editar Proveedor
            </ModalHeader>
            <ModalBody className="flex flex-col gap-5">
              <Input
                label="Razón Social"
                defaultValue={providerToEdit?.razonSocial}
                variant="bordered"
                isRequired
                classNames={inputMinimalistClasses}
              />
              <Input
                label="RUC"
                defaultValue={providerToEdit?.ruc}
                variant="bordered"
                isDisabled
                description={
                  <span className="text-zinc-400 text-xs">
                    El RUC no puede ser modificado
                  </span>
                }
                classNames={inputMinimalistClasses}
              />
              <Input
                label="Correo de Contacto"
                defaultValue={providerToEdit?.emailContacto}
                type="email"
                variant="bordered"
                isRequired
                classNames={inputMinimalistClasses}
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Teléfono"
                  defaultValue={providerToEdit?.telefono || ""}
                  variant="bordered"
                  isRequired
                  classNames={inputMinimalistClasses}
                />
                <Input
                  label="Dirección"
                  defaultValue={providerToEdit?.direccion || ""}
                  variant="bordered"
                  isRequired
                  classNames={inputMinimalistClasses}
                />
              </div>

              <div className="pt-2 border-t border-zinc-100 mt-2">
                <Select
                  label="Estado de la Cuenta"
                  variant="bordered"
                  defaultSelectedKeys={
                    providerToEdit ? [providerToEdit.estado] : []
                  }
                  isRequired
                  classNames={{
                    trigger:
                      "border-zinc-200 bg-white shadow-none hover:border-zinc-300 focus-within:!border-zinc-900 transition-colors",
                    label: "text-zinc-500 font-medium text-xs",
                    value: "text-zinc-900",
                  }}
                >
                  <SelectItem key="ACTIVO">Activo</SelectItem>
                  <SelectItem key="INACTIVO">Inactivo</SelectItem>
                </Select>
                <p className="text-xs text-zinc-400 font-light mt-2 ml-1">
                  Cambiar a inactivo ocultará los productos del catálogo.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                className="font-medium text-zinc-500 hover:text-zinc-900 transition-colors"
                onPress={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                color="default"
                type="submit"
                className="font-medium bg-zinc-900 text-white shadow-none hover:bg-zinc-800 transition-colors px-6"
              >
                Guardar Cambios
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </div>
  );
};
