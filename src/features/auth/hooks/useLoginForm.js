import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchema';
import { authService } from '../services/authService';

export const useLoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      // Usamos el email como identificador (puede funcionar como email o username según el backend)
      const payload = { email: data.email, password: data.password };
      const response = await authService.login(payload);
      
      // Aquí se debería guardar el token (localStorage, Zustand, etc)
      console.log('Login exitoso:', response);
      alert('¡Sesión iniciada correctamente!');
      
    } catch (error) {
      console.error('Error en login:', error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    apiError,
    setApiError
  };
};
