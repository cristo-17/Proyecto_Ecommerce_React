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
import { AlertTriangle, Trash2 } from "lucide-react";

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

  // ----------------------------------------------------
  // VISTA 1: MODO PROVEEDOR (Mi Perfil de Empresa)
  // ----------------------------------------------------
  if (userRole === "PROVEEDOR") {
    return (
      <div className="flex justify-center items-start w-full mt-4">
        <Card className="w-full max-w-2xl bg-white shadow-sm border border-gray-100">
          <CardHeader className="px-6 pt-6 pb-2 border-b border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800">
              Mis Datos de Empresa
            </h2>
          </CardHeader>
          <CardBody className="p-6">
            <form
              onSubmit={handleSubmit(onSubmitProvider)}
              className="flex flex-col gap-4"
            >
              <Input
                {...register("razonSocial")}
                label="Razón Social"
                variant="bordered"
              />
              <Input
                {...register("ruc")}
                label="RUC"
                variant="bordered"
                isDisabled
                description="El RUC no puede ser modificado"
              />
              <Input
                {...register("telefono")}
                label="Teléfono de Contacto"
                variant="bordered"
              />
              <Input
                {...register("direccion")}
                label="Dirección Fiscal"
                variant="bordered"
              />
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="mt-4 font-bold"
              >
                Guardar Cambios
              </Button>
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
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Gestión de Proveedores
          </h1>
          <p className="text-gray-500 mt-1">
            Administra las empresas asociadas a la plataforma.
          </p>
        </div>
        <Button
          color="primary"
          size="lg"
          className="font-bold shadow-md"
          onPress={() => setIsRegisterOpen(true)}
        >
          + Registrar Proveedor
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-100">
        <CardBody className="p-0">
          <Table aria-label="Gestión de proveedores" removeWrapper>
            <TableHeader>
              <TableColumn>RAZÓN SOCIAL</TableColumn>
              <TableColumn>RUC</TableColumn>
              <TableColumn>CONTACTO</TableColumn>
              <TableColumn>ESTADO</TableColumn>
              <TableColumn align="center">ACCIONES</TableColumn>
            </TableHeader>
            <TableBody items={providers}>
              {(item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell className="font-bold text-gray-800">
                    {item.razonSocial}
                  </TableCell>
                  <TableCell className="text-gray-600">{item.ruc}</TableCell>
                  <TableCell className="text-gray-600">
                    {item.emailContacto}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={item.estado === "ACTIVO" ? "success" : "danger"}
                      variant="flat"
                      size="sm"
                    >
                      {item.estado}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        color="default"
                        variant="flat"
                        onPress={() => handleOpenEdit(item)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        color="danger"
                        variant="flat"
                        isIconOnly
                        onPress={() => handleOpenDelete(item)}
                      >
                        <Trash2 size={16} />
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
      >
        <ModalContent>
          <ModalHeader className="text-danger font-bold flex items-center gap-2">
            <AlertTriangle size={20} /> Advertencia Crítica
          </ModalHeader>
          <ModalBody>
            <p className="text-gray-700 leading-relaxed">
              Estás a punto de eliminar al proveedor{" "}
              <strong>{providerToDelete?.razonSocial}</strong>.
            </p>
            <div className="bg-danger-50 text-danger-700 p-3 rounded-lg text-sm mt-2 border border-danger-200">
              <strong>Borrado en Cascada:</strong> Esta acción eliminará
              permanentemente todos los celulares, inventario y reseñas
              asociados a este proveedor del catálogo público.
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              color="default"
              variant="light"
              onPress={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmDelete}
              className="font-bold shadow-md shadow-danger/20"
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
        size="md"
      >
        <ModalContent>
          <form onSubmit={handleRegisterSubmit}>
            <ModalHeader className="font-bold text-xl">
              Registrar Nuevo Proveedor
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Input
                label="Razón Social"
                placeholder="Ej. TechCorp SAC"
                variant="bordered"
                isRequired
              />
              <Input
                label="RUC"
                placeholder="Ej. 20123456789"
                variant="bordered"
                isRequired
              />
              <Input
                label="Correo de Contacto"
                type="email"
                placeholder="contacto@techcorp.com"
                variant="bordered"
                isRequired
              />
              <Input
                label="Teléfono de Contacto"
                placeholder="Ej. 999 888 777"
                variant="bordered"
                isRequired
              />
              <Input
                label="Dirección Fiscal"
                placeholder="Ej. Av. Principal 123"
                variant="bordered"
                isRequired
              />
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => setIsRegisterOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                className="font-bold shadow-md"
              >
                Guardar Proveedor
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      {/* MODAL: EDITAR PROVEEDOR (ADMIN) - TIPADO DE SELECT CORREGIDO */}
      <Modal
        isOpen={isEditModalOpen}
        onOpenChange={() => setIsEditModalOpen(false)}
        size="md"
      >
        <ModalContent>
          <form onSubmit={handleEditSubmit}>
            <ModalHeader className="font-bold text-xl">
              Editar Proveedor
            </ModalHeader>
            <ModalBody className="flex flex-col gap-4">
              <Input
                label="Razón Social"
                defaultValue={providerToEdit?.razonSocial}
                variant="bordered"
                isRequired
              />
              <Input
                label="RUC"
                defaultValue={providerToEdit?.ruc}
                variant="bordered"
                isDisabled
                description="El RUC no puede ser modificado"
              />
              <Input
                label="Correo de Contacto"
                defaultValue={providerToEdit?.emailContacto}
                type="email"
                variant="bordered"
                isRequired
              />
              <Input
                label="Teléfono de Contacto"
                defaultValue={providerToEdit?.telefono || ""}
                variant="bordered"
                isRequired
              />
              <Input
                label="Dirección Fiscal"
                defaultValue={providerToEdit?.direccion || ""}
                variant="bordered"
                isRequired
              />

              <Select
                label="Estado de la Cuenta"
                variant="bordered"
                defaultSelectedKeys={
                  providerToEdit ? [providerToEdit.estado] : []
                }
                isRequired
              >
                <SelectItem key="ACTIVO">Activo</SelectItem>
                <SelectItem key="INACTIVO">Inactivo</SelectItem>
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                color="primary"
                type="submit"
                className="font-bold shadow-md"
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
