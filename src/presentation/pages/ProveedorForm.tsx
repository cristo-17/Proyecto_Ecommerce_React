// src/presentation/pages/ProveedorForm.tsx
import { useState, useEffect, useCallback } from "react";
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
import { Alert } from "@heroui/alert"; // <-- Añadido para notificaciones
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { AlertTriangle, Trash2, Pencil } from "lucide-react";
import { useAuthStore } from "../../application/store/useAuthStore";
import {
  proveedorService,
  type Proveedor,
} from "../../infrastructure/services/proveedorService";

export const ProveedorForm = () => {
  const { user } = useAuthStore();
  const userRole = user?.rol || "INVITADO";

  // Estado global para notificaciones flotantes UI
  const [notification, setNotification] = useState<{
    message: string;
    type: "danger" | "success";
  } | null>(null);

  const showNotification = (
    message: string,
    type: "danger" | "success" = "success",
  ) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Estados para modo ADMIN
  const [providers, setProviders] = useState<Proveedor[]>([]);
  const [isLoadingProviders, setIsLoadingProviders] = useState(true);
  const [providersError, setProvidersError] = useState<string | null>(null);

  // Estados para modo PROVEEDOR (perfil)
  const [formData, setFormData] = useState({
    razonSocial: "",
    ruc: "",
    correo: "",
    telefono: "",
    direccion: "",
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Estados de modales (admin)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<Proveedor | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState<Proveedor | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Cargar proveedores (admin)
  const fetchProviders = useCallback(async () => {
    setIsLoadingProviders(true);
    setProvidersError(null);
    try {
      const data = await proveedorService.getAll();
      setProviders(data);
    } catch (err: any) {
      setProvidersError(
        err.response?.data?.message || "Error al cargar proveedores",
      );
    } finally {
      setIsLoadingProviders(false);
    }
  }, []);

  // Cargar perfil del proveedor (proveedor)
  const fetchProfile = useCallback(async () => {
    setIsLoadingProfile(true);
    setProfileError(null);
    try {
      const data = await proveedorService.getMyProfile();
      setFormData({
        razonSocial: data.razonSocial,
        ruc: data.ruc,
        correo: data.emailContacto,
        telefono: data.telefono,
        direccion: data.direccion || "",
      });
    } catch (err: any) {
      setProfileError(err.response?.data?.message || "Error al cargar perfil");
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    if (userRole === "ADMIN") {
      fetchProviders();
    } else if (userRole === "PROVEEDOR") {
      fetchProfile();
    }
  }, [userRole, fetchProviders, fetchProfile]);

  // Manejadores del formulario de perfil
  const handleRucChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, ruc: onlyNumbers }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const onlyNumbers = e.target.value.replace(/\D/g, "").slice(0, 9);
    setFormData((prev) => ({ ...prev, telefono: onlyNumbers }));
  };

  const handleRazonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limitedText = e.target.value.slice(0, 50);
    setFormData((prev) => ({ ...prev, razonSocial: limitedText }));
  };

  const handleCorreoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limitedText = e.target.value.slice(0, 30);
    setFormData((prev) => ({ ...prev, correo: limitedText }));
  };

  const handleDireccionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const limitedText = e.target.value.slice(0, 100);
    setFormData((prev) => ({ ...prev, direccion: limitedText }));
  };

  const onSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      await proveedorService.updateMyProfile({
        razonSocial: formData.razonSocial,
        emailContacto: formData.correo,
        telefono: formData.telefono,
        direccion: formData.direccion,
      });
      showNotification(
        "Perfil de empresa actualizado correctamente.",
        "success",
      );
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al actualizar perfil",
        "danger",
      );
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Manejadores para admin
  const handleOpenDelete = (provider: Proveedor) => {
    setProviderToDelete(provider);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!providerToDelete) return;
    setIsDeleting(true);
    try {
      await proveedorService.delete(providerToDelete.id);
      setProviders((prev) => prev.filter((p) => p.id !== providerToDelete.id));
      setIsDeleteModalOpen(false);
      setProviderToDelete(null);
      showNotification(
        "Proveedor eliminado correctamente del sistema.",
        "success",
      );
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al eliminar proveedor",
        "danger",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleOpenEdit = (provider: Proveedor) => {
    setProviderToEdit(provider);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!providerToEdit) return;
    setIsUpdating(true);
    try {
      const form = e.target as HTMLFormElement;
      const razonSocial = (
        form.elements.namedItem("razonSocial") as HTMLInputElement
      )?.value;
      const emailContacto = (
        form.elements.namedItem("emailContacto") as HTMLInputElement
      )?.value;
      const telefono = (form.elements.namedItem("telefono") as HTMLInputElement)
        ?.value;
      const direccion = (
        form.elements.namedItem("direccion") as HTMLInputElement
      )?.value;
      const estado = (form.elements.namedItem("estado") as HTMLSelectElement)
        ?.value as "ACTIVO" | "INACTIVO";

      await proveedorService.update(providerToEdit.id, {
        razonSocial,
        emailContacto,
        telefono,
        direccion,
        estado,
      });
      setIsEditModalOpen(false);
      showNotification("Datos del proveedor actualizados.", "success");
      fetchProviders();
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al actualizar proveedor",
        "danger",
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const form = e.target as HTMLFormElement;
      const razonSocial = (
        form.elements.namedItem("razonSocial") as HTMLInputElement
      )?.value;
      const ruc = (form.elements.namedItem("ruc") as HTMLInputElement)?.value;
      const emailContacto = (
        form.elements.namedItem("emailContacto") as HTMLInputElement
      )?.value;
      const telefono = (form.elements.namedItem("telefono") as HTMLInputElement)
        ?.value;
      const direccion = (
        form.elements.namedItem("direccion") as HTMLInputElement
      )?.value;

      await proveedorService.create({
        razonSocial,
        ruc,
        emailContacto,
        telefono,
        direccion,
      });
      setIsRegisterOpen(false);
      showNotification("Nuevo proveedor registrado con éxito.", "success");
      fetchProviders();
    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Error al registrar proveedor",
        "danger",
      );
    } finally {
      setIsCreating(false);
    }
  };

  // Clases compartidas para inputs
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
      <div className="relative flex justify-center items-start w-full max-w-4xl mx-auto px-4 sm:px-0 pb-12">
        {/* Alerta Flotante UI */}
        {notification && (
          <div className="fixed top-6 right-6 z-50 animate-appearance-in">
            <Alert
              color={notification.type}
              title={notification.type === "danger" ? "Error" : "Éxito"}
              description={notification.message}
            />
          </div>
        )}

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
          <CardBody className="p-8 relative min-h-[300px]">
            {/* Lógica de Carga y Error sin destruir el Card */}
            {isLoadingProfile && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1">
                <div className="w-8 h-8 border-3 border-default-200 border-t-foreground rounded-full animate-spin"></div>
              </div>
            )}

            {profileError && !isLoadingProfile && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1 gap-4">
                <p className="text-danger font-medium">{profileError}</p>
                <Button color="default" variant="flat" onPress={fetchProfile}>
                  Reintentar
                </Button>
              </div>
            )}

            {!isLoadingProfile && !profileError && (
              <form
                onSubmit={onSubmitProfile}
                className="flex flex-col gap-6 animate-appearance-in"
              >
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
                    isLoading={isSavingProfile}
                    className="font-medium bg-foreground text-background hover:opacity-80 shadow-none px-8 transition-colors"
                  >
                    Guardar Cambios
                  </Button>
                </div>
              </form>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }

  // ----------------------------------------------------
  // VISTA 2: MODO ADMIN (Gestión de Proveedores)
  // ----------------------------------------------------
  return (
    <div className="relative flex flex-col gap-8 w-full max-w-5xl mx-auto pb-12 px-4 sm:px-0">
      {/* Alerta Flotante UI */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 animate-appearance-in">
          <Alert
            color={notification.type}
            title={notification.type === "danger" ? "Error" : "Éxito"}
            description={notification.message}
          />
        </div>
      )}

      {/* CABECERA (Siempre Visible) */}
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

      {/* CONTENEDOR DE LA TABLA */}
      <Card
        shadow="none"
        className="bg-content1 border border-divider rounded-2xl overflow-hidden"
      >
        <CardBody className="p-0 relative min-h-[300px]">
          {/* Lógica de Carga y Error integradas */}
          {isLoadingProviders && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1/70 backdrop-blur-sm">
              <div className="w-8 h-8 border-3 border-default-200 border-t-foreground rounded-full animate-spin"></div>
            </div>
          )}

          {providersError && !isLoadingProviders && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-content1">
              <p className="text-danger font-medium mb-3">{providersError}</p>
              <Button
                color="default"
                variant="flat"
                onPress={fetchProviders}
                size="sm"
              >
                Reintentar
              </Button>
            </div>
          )}

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
            <TableBody
              items={providers}
              emptyContent={
                !isLoadingProviders && !providersError
                  ? "No hay proveedores registrados en el sistema."
                  : " "
              }
            >
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
              isLoading={isDeleting}
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
                name="razonSocial"
                label="Razón Social"
                placeholder="Ej. TechCorp SAC"
                variant="bordered"
                isRequired
                maxLength={50}
                classNames={inputMinimalistClasses}
              />
              <Input
                name="ruc"
                label="RUC"
                placeholder="Ej. 20123456789"
                variant="bordered"
                isRequired
                maxLength={11}
                classNames={inputMinimalistClasses}
              />
              <Input
                name="emailContacto"
                label="Correo de Contacto"
                type="email"
                placeholder="contacto@techcorp.com"
                variant="bordered"
                isRequired
                maxLength={30}
                classNames={inputMinimalistClasses}
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  name="telefono"
                  label="Teléfono"
                  placeholder="Ej. 999 888 777"
                  variant="bordered"
                  isRequired
                  maxLength={9}
                  classNames={inputMinimalistClasses}
                />
                <Input
                  name="direccion"
                  label="Dirección Fiscal"
                  placeholder="Ej. Av. Principal 123"
                  variant="bordered"
                  isRequired
                  maxLength={100}
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
                isLoading={isCreating}
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
                name="razonSocial"
                label="Razón Social"
                defaultValue={providerToEdit?.razonSocial}
                variant="bordered"
                isRequired
                maxLength={50}
                classNames={inputMinimalistClasses}
              />
              <Input
                name="ruc"
                label="RUC"
                defaultValue={providerToEdit?.ruc}
                variant="bordered"
                isDisabled={true}
                description={
                  <span className="text-default-400 text-xs">
                    Solo el administrador puede modificar el RUC.
                  </span>
                }
                maxLength={11}
                classNames={inputMinimalistClasses}
              />
              <Input
                name="emailContacto"
                label="Correo de Contacto"
                defaultValue={providerToEdit?.emailContacto}
                type="email"
                variant="bordered"
                isRequired
                maxLength={30}
                classNames={inputMinimalistClasses}
              />
              <div className="grid grid-cols-2 gap-5">
                <Input
                  name="telefono"
                  label="Teléfono"
                  defaultValue={providerToEdit?.telefono || ""}
                  variant="bordered"
                  isRequired
                  maxLength={9}
                  classNames={inputMinimalistClasses}
                />
                <Input
                  name="direccion"
                  label="Dirección"
                  defaultValue={providerToEdit?.direccion || ""}
                  variant="bordered"
                  isRequired
                  maxLength={100}
                  classNames={inputMinimalistClasses}
                />
              </div>

              <div className="pt-2 border-t border-divider mt-2">
                <Select
                  name="estado"
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
                isLoading={isUpdating}
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
