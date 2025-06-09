import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
  username: z.string()
    .min(4, 'El usuario debe tener al menos 4 caracteres')
    .max(30, 'El usuario no debe exceder 30 caracteres'),
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const verifyEmailSchema = z.object({
  code: z.string().min(6, 'El código debe tener al menos 6 dígitos').max(6, 'El código debe tener exactamente 6 dígitos'),
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'El correo es requerido').email('Correo electrónico inválido'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'El token es requerido').trim(),
  newPassword: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});
