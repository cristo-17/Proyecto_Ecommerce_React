// src/presentation/pages/ProveedorForm.tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { httpClient } from '../../infrastructure/api/httpClient';

// 1. Esquema de Validación Estricto (Zod)
const proveedorSchema = z.object({
  razonSocial: z.string().min(3, 'Mínimo 3 caracteres'),
  ruc: z.string().length(11, 'El RUC debe tener 11 dígitos').regex(/^\d+$/, 'Solo números permitidos'),
  emailContacto: z.string().email('Formato de correo inválido'),
  telefono: z.string().min(9, 'Mínimo 9 dígitos'),
});

// Inferir el tipo de Zod para alinearlo con nuestro Dominio
type ProveedorFormData = z.infer<typeof proveedorSchema>;

export const ProveedorForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProveedorFormData>({
    resolver: zodResolver(proveedorSchema)
  });

  const onSubmit = async (data: ProveedorFormData) => {
    try {
      // Llamada simulada a JSON Server
      await httpClient.post('/proveedores', { ...data, id: crypto.randomUUID() });
      alert('Proveedor registrado con éxito');
      reset();
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error al registrar el proveedor');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Registrar Nuevo Proveedor</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Razón Social</label>
          <input {...register('razonSocial')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border" />
          {errors.razonSocial && <p className="text-red-500 text-xs mt-1">{errors.razonSocial.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">RUC</label>
            <input {...register('ruc')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            {errors.ruc && <p className="text-red-500 text-xs mt-1">{errors.ruc.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
            <input {...register('telefono')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            {errors.telefono && <p className="text-red-500 text-xs mt-1">{errors.telefono.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email de Contacto</label>
          <input {...register('emailContacto')} type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
          {errors.emailContacto && <p className="text-red-500 text-xs mt-1">{errors.emailContacto.message}</p>}
        </div>

        <button disabled={isSubmitting} type="submit" className="w-full bg-slate-900 text-white p-3 rounded-md hover:bg-slate-800 transition disabled:opacity-50">
          {isSubmitting ? 'Guardando...' : 'Guardar Proveedor'}
        </button>
      </form>
    </div>
  );
};