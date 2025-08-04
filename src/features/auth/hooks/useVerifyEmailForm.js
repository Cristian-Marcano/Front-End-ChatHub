import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { verifyEmailSchema } from '../schemas/authSchema';
import { authService } from '../services/authService';

export const useVerifyEmailForm = (email, onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { email }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    try {
      await authService.verifyEmail(data);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    setValue,
    watch,
    errors,
    onSubmit,
    isLoading,
    apiError,
    setApiError
  };
};
