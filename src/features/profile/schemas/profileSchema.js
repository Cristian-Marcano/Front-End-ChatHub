import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().min(1, 'El nombre es obligatorio').max(120, 'El nombre no puede exceder 120 caracteres'),
  phone: z.string().max(30, 'El teléfono no puede exceder 30 caracteres').optional().or(z.literal('')),
  about: z.string().max(255, 'La descripción no puede exceder 255 caracteres').optional().or(z.literal('')),
});
