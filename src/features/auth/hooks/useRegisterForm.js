import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/authSchema';
import { authService } from '../services/authService';

export const useRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);
    try {
      const payload = { 
        username: data.username,
        email: data.email, 
        password: data.password 
      };
      
      const response = await authService.register(payload);
      setSuccessMsg(response.message || 'Código enviado al correo');
      
      // Aquí puedes redirigir o preparar la interfaz para verificar el código
    } catch (error) {
      console.error('Error en registro:', error);
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
    setApiError,
    successMsg,
    setSuccessMsg
  };
};
