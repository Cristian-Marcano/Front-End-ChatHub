import { z } from 'zod';

export const profileSchema = z.object({
  full_name: z.string().max(120, 'El nombre no puede exceder 120 caracteres').optional(),
  phone: z.string().max(30, 'El teléfono no puede exceder 30 caracteres').optional(),
  about: z.string().max(255, 'La descripción no puede exceder 255 caracteres').optional(),
});
