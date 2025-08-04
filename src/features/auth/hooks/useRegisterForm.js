import { toast } from "../../../utils/toast";
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '../schemas/authSchema';
import { authService } from '../services/authService';

export const useRegisterForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const payload = { 
        username: data.username,
        email: data.email, 
        password: data.password 
      };
      
      const response = await authService.register(payload);
      toast.success(response.message || 'Código enviado al correo');
      
      return payload.email; // Devolver el email para que el componente lo use
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error(error.message);
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
  };
};
