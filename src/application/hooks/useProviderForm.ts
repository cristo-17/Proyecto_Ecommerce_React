// src/application/hooks/useProviderForm.ts
import { useState } from "react";

// Mock Data alineado con la interfaz de dominio
const INITIAL_PROVIDERS = [
  {
    id: "prov-1",
    razonSocial: "Samsung Global",
    ruc: "20123456789",
    emailContacto: "samsung@corp.com",
    telefono: "999888777",
    direccion: "Av. Tecnológica 123",
    estado: "ACTIVO",
  },
  {
    id: "prov-2",
    razonSocial: "AppleCorp Peru",
    ruc: "20987654321",
    emailContacto: "ventas@apple.pe",
    telefono: "987654321",
    direccion: "Av. Las Manzanas 456",
    estado: "ACTIVO",
  },
];

export const useProviderForm = () => {
  // LECTURA DE ROL
  const userRole = localStorage.getItem("user_role") || "INVITADO";

  // ==========================================
  // ESTADOS MODO ADMIN
  // ==========================================
  const [providers, setProviders] = useState(INITIAL_PROVIDERS);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [providerToDelete, setProviderToDelete] = useState<any>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [providerToEdit, setProviderToEdit] = useState<any>(null);

  // ==========================================
  // ESTADOS MODO PROVEEDOR (Mi Perfil)
  // ==========================================
  const [formData, setFormData] = useState({
    razonSocial: "Samsung Global",
    ruc: "20123456789",
    correo: "samsung@corp.com",
    telefono: "999888777",
    direccion: "Av. Tecnológica 123",
  });

  // ==========================================
  // MANEJADORES CONTROLADOS (MODO PROVEEDOR)
  // ==========================================
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

  // ==========================================
  // MANEJADORES NO CONTROLADOS (MODO ADMIN)
  // ==========================================
  const enforceRucMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
  };

  const enforcePhoneMask = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.replace(/\D/g, "").slice(0, 9);
  };

  const enforceTextLimit50 = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.slice(0, 50);
  };

  const enforceTextLimit30 = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.slice(0, 30);
  };

  const enforceTextLimit100 = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value = e.target.value.slice(0, 100);
  };

  // ==========================================
  // ACCIONES Y SUBMITS
  // ==========================================
  const onSubmitProvider = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Datos actualizados: " + JSON.stringify(formData));
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

  return {
    userRole,
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
  };
};