// src/presentation/pages/ProveedorForm.tsx
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
import { useProviderForm } from "../../application/hooks/useProviderForm";
import { useAuthStore } from "../../application/store/useAuthStore";

export const ProveedorForm = () => {
  // Consumo del Custom Hook (La vista queda 100% "tonta")
  const {
    providers,
    formData,
    isDeleteModalOpen,
    providerToDelete,
    isRegisterOpen,
    isEditModalOpen,
    providerToEdit,
    setIsDeleteModalOpen,
    setIsRegisterOpen,
    setIsEditModalOpen,
    handleRucChange,
    handlePhoneChange,
    handleRazonChange,
    handleCorreoChange,
    handleDireccionChange,
    enforceRucMask,
    enforcePhoneMask,
    enforceTextLimit50,
    enforceTextLimit30,
    enforceTextLimit100,
    onSubmitProvider,
    handleOpenDelete,
    handleConfirmDelete,
    handleRegisterSubmit,
    handleOpenEdit,
    handleEditSubmit,
  } = useProviderForm();

  // 1. Corrección de Autenticación
  const { user } = useAuthStore();
  const userRole = user?.rol || "INVITADO";

  // Clases compartidas para inputs minimalistas premium (3. Limpieza de Bordes y Estados)
  const inputMinimalistClasses = {
    inputWrapper:
      "border-default-200 bg-content1 shadow-none hover:border-default-300 focus-within:!border-foreground transition-colors",
    label: "text-default-500 font-medium text-xs",
    input: "text-foreground placeholder:text-default-400",
  };

  // ----------------------------------------------------
  // VISTA 1: MODO PROVEEDOR (Mi Perfil de Empresa)
  // ----------------------------------------------------
  if (userRole === "PROVEEDOR") {
    return (
      <div className="flex justify-center items-start w-full max-w-4xl mx-auto">
        <Card
          shadow="none"
          className="w-full bg-content1 border border-divider rounded-2xl mt-4"
        >
          <CardHeader className="px-8 pt-8 pb-4 border-b border-divider">
            <div>
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                Mis Datos de Empresa
              </h2>
              <p className="text-sm font-light text-default-500 mt-1">
                Actualiza la información visible de tu compañía.
              </p>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <form onSubmit={onSubmitProvider} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleRazonChange}
                  maxLength={50}
                  label="Razón Social"
                  variant="bordered"
                  classNames={inputMinimalistClasses}
                />
                <Input
                  name="ruc"
                  value={formData.ruc}
                  onChange={handleRucChange}
                  maxLength={11}
                  label="RUC"
                  variant="bordered"
                  // 1. Solución al TS Error (Hardcoded)
                  isDisabled={true}
                  description={
                    <span className="text-default-400 text-xs">
                      Solo el administrador puede modificar el RUC.
                    </span>
                  }
                  classNames={inputMinimalistClasses}
                />
                <Input
                  name="correo"
                  value={formData.correo}
                  onChange={handleCorreoChange}
                  maxLength={30}
                  label="Correo de Contacto"
                  type="email"
                  variant="bordered"
                  classNames={inputMinimalistClasses}
                />
                <Input
                  name="telefono"
                  value={formData.telefono}
                  onChange={handlePhoneChange}
                  maxLength={9}
                  label="Teléfono de Contacto"
                  variant="bordered"
                  classNames={inputMinimalistClasses}
                />
                <Input
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleDireccionChange}
                  maxLength={100}
                  label="Dirección Fiscal"
                  variant="bordered"
                  className="md:col-span-2"
                  classNames={inputMinimalistClasses}
                />
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  color="default"
                  size="lg"
                  className="font-medium bg-foreground text-background hover:opacity-80 shadow-none px-8 transition-colors"
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-content1 p-8 rounded-2xl border border-divider gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-semibold text-foreground tracking-tight">
            Gestión de Proveedores
          </h1>
          <p className="text-default-500 font-light mt-2 tracking-wide">
            Administra las empresas asociadas a la plataforma y sus estados.
          </p>
        </div>
        <Button
          color="default"
          size="lg"
          className="font-medium bg-foreground text-background hover:opacity-80 shadow-none transition-colors"
          onPress={() => setIsRegisterOpen(true)}
        >
          + Registrar Proveedor
        </Button>
      </div>

      <Card
        shadow="none"
        className="bg-content1 border border-divider rounded-2xl overflow-hidden"
      >
        <CardBody className="p-0">
          <Table
            aria-label="Gestión de proveedores"
            removeWrapper
            classNames={{
              th: "bg-default-100 text-default-500 font-semibold tracking-wider text-xs px-6 py-4 border-b border-divider uppercase",
              td: "px-6 py-4 border-b border-divider last:border-0",
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
                  className="hover:bg-default-100 transition-colors"
                >
                  <TableCell className="font-medium text-foreground tracking-tight">
                    {item.razonSocial}
                  </TableCell>
                  <TableCell className="text-default-500 font-light tracking-wide">
                    {item.ruc}
                  </TableCell>
                  <TableCell className="text-default-500 font-light">
                    {item.emailContacto}
                  </TableCell>
                  <TableCell>
                    <Chip
                      color={item.estado === "ACTIVO" ? "default" : "danger"}
                      variant="flat"
                      size="sm"
                      className={`font-medium tracking-wide ${
                        item.estado === "ACTIVO"
                          ? "bg-default-200 text-foreground"
                          : "bg-danger/20 text-danger"
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
                        className="text-default-500 hover:text-foreground hover:bg-default-200 transition-colors"
                        onPress={() => handleOpenEdit(item)}
                      >
                        <Pencil size={16} strokeWidth={1.5} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        className="text-default-400 hover:text-danger hover:bg-danger/20 transition-colors"
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
          base: "bg-content1 rounded-2xl shadow-sm border border-divider",
          header: "border-b border-divider py-4 px-6",
          body: "py-6 px-6",
          footer: "border-t border-divider py-4 px-6",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex gap-3 items-center text-foreground font-semibold text-lg tracking-tight">
            <div className="p-2 bg-danger/20 rounded-full text-danger">
              <AlertTriangle size={18} strokeWidth={2} />
            </div>
            Advertencia Crítica
          </ModalHeader>
          <ModalBody>
            <p className="text-default-500 font-light text-sm leading-relaxed">
              Estás a punto de eliminar al proveedor{" "}
              <strong className="font-semibold text-foreground">
                {providerToDelete?.razonSocial}
              </strong>
              .
            </p>
            <div className="bg-danger/10 border border-danger/30 text-danger p-4 rounded-xl text-sm mt-2 leading-relaxed">
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
              className="font-medium text-default-500 hover:text-foreground transition-colors"
              onPress={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              color="danger"
              onPress={handleConfirmDelete}
              className="font-medium bg-danger text-white hover:bg-danger/80 shadow-none px-6 transition-colors"
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
          base: "bg-content1 rounded-2xl shadow-sm border border-divider",
          header: "border-b border-divider py-5 px-8",
          body: "py-6 px-8",
          footer: "border-t border-divider py-5 px-8",
        }}
      >
        <ModalContent>
          <form onSubmit={handleRegisterSubmit}>
            <ModalHeader className="font-bold text-xl text-foreground tracking-tight">
              Registrar Nuevo Proveedor
            </ModalHeader>
            <ModalBody className="flex flex-col gap-5">
              <Input
                label="Razón Social"
                placeholder="Ej. TechCorp SAC"
                variant="bordered"
                isRequired
                maxLength={50}
                onChange={enforceTextLimit50}
                classNames={inputMinimalistClasses}
              />
              <Input
                label="RUC"
                placeholder="Ej. 20123456789"
                variant="bordered"
                isRequired
                maxLength={11}
                onChange={enforceRucMask}
                isDisabled={userRole !== "ADMIN"}
                classNames={inputMinimalistClasses}
              />
              <Input
                label="Correo de Contacto"
                type="email"
                placeholder="contacto@techcorp.com"
                variant="bordered"
                isRequired
                maxLength={30}
                onChange={enforceTextLimit30}
                classNames={inputMinimalistClasses}
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Teléfono"
                  placeholder="Ej. 999 888 777"
                  variant="bordered"
                  isRequired
                  maxLength={9}
                  onChange={enforcePhoneMask}
                  classNames={inputMinimalistClasses}
                />
                <Input
                  label="Dirección Fiscal"
                  placeholder="Ej. Av. Principal 123"
                  variant="bordered"
                  isRequired
                  maxLength={100}
                  onChange={enforceTextLimit100}
                  classNames={inputMinimalistClasses}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                className="font-medium text-default-500 hover:text-foreground transition-colors"
                onPress={() => setIsRegisterOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                color="default"
                type="submit"
                className="font-medium bg-foreground text-background shadow-none hover:opacity-80 transition-colors px-6"
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
          base: "bg-content1 rounded-2xl shadow-sm border border-divider",
          header: "border-b border-divider py-5 px-8",
          body: "py-6 px-8",
          footer: "border-t border-divider py-5 px-8",
        }}
      >
        <ModalContent>
          <form onSubmit={handleEditSubmit}>
            <ModalHeader className="font-bold text-xl text-foreground tracking-tight">
              Editar Proveedor
            </ModalHeader>
            <ModalBody className="flex flex-col gap-5">
              <Input
                label="Razón Social"
                defaultValue={providerToEdit?.razonSocial}
                variant="bordered"
                isRequired
                maxLength={50}
                onChange={enforceTextLimit50}
                classNames={inputMinimalistClasses}
              />
              <Input
                label="RUC"
                defaultValue={providerToEdit?.ruc}
                variant="bordered"
                isDisabled={userRole !== "ADMIN"}
                description={
                  userRole !== "ADMIN" ? (
                    <span className="text-default-400 text-xs">
                      Solo el administrador puede modificar el RUC.
                    </span>
                  ) : null
                }
                maxLength={11}
                onChange={enforceRucMask}
                classNames={inputMinimalistClasses}
              />
              <Input
                label="Correo de Contacto"
                defaultValue={providerToEdit?.emailContacto}
                type="email"
                variant="bordered"
                isRequired
                maxLength={30}
                onChange={enforceTextLimit30}
                classNames={inputMinimalistClasses}
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  label="Teléfono"
                  defaultValue={providerToEdit?.telefono || ""}
                  variant="bordered"
                  isRequired
                  maxLength={9}
                  onChange={enforcePhoneMask}
                  classNames={inputMinimalistClasses}
                />
                <Input
                  label="Dirección"
                  defaultValue={providerToEdit?.direccion || ""}
                  variant="bordered"
                  isRequired
                  maxLength={100}
                  onChange={enforceTextLimit100}
                  classNames={inputMinimalistClasses}
                />
              </div>

              <div className="pt-2 border-t border-divider mt-2">
                <Select
                  label="Estado de la Cuenta"
                  variant="bordered"
                  defaultSelectedKeys={
                    providerToEdit ? [providerToEdit.estado] : []
                  }
                  isRequired
                  classNames={{
                    trigger:
                      "border-default-200 bg-content1 shadow-none hover:border-default-300 focus-within:!border-foreground transition-colors",
                    label: "text-default-500 font-medium text-xs",
                    value: "text-foreground",
                  }}
                >
                  <SelectItem key="ACTIVO">Activo</SelectItem>
                  <SelectItem key="INACTIVO">Inactivo</SelectItem>
                </Select>
                <p className="text-xs text-default-400 font-light mt-2 ml-1">
                  Cambiar a inactivo ocultará los productos del catálogo.
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                className="font-medium text-default-500 hover:text-foreground transition-colors"
                onPress={() => setIsEditModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                color="default"
                type="submit"
                className="font-medium bg-foreground text-background shadow-none hover:opacity-80 transition-colors px-6"
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
