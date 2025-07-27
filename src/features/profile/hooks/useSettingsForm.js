import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { profileService } from '../services/profileService';

const settingsSchema = z.object({
  username: z.string().min(4, 'Mínimo 4 caracteres').max(30, 'Máximo 30 caracteres'),
  email: z.string().email('Email inválido'),
  full_name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  phone: z.string().optional(),
  about: z.string().max(100, 'Máximo 100 caracteres').optional(),
});

export const useSettingsForm = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [avatarConfig, setAvatarConfig] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(settingsSchema)
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await profileService.getProfile(token);
        
        setValue('username', data.username || '');
        setValue('email', data.email || '');
        setValue('full_name', data.full_name || '');
        setValue('phone', data.phone || '');
        setValue('about', data.about || '');

        if (data.photo) {
          try {
            setAvatarConfig(JSON.parse(data.photo));
          } catch (e) {
            console.error('Error parsing avatar config', e);
          }
        }
      } catch (error) {
        setApiError(error.message);
      } finally {
        setIsFetching(false);
      }
    };

    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setApiError(null);
      setSuccessMsg(null);
      const token = localStorage.getItem('token');

      const payload = {
        ...data,
        photo: JSON.stringify(avatarConfig)
      };

      await profileService.updateSettings(token, payload);
      setSuccessMsg('Ajustes guardados correctamente');
      
      if (onSuccess) {
        onSuccess(payload);
      }
    } catch (error) {
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
    isFetching,
    apiError,
    setApiError,
    successMsg,
    setSuccessMsg,
    avatarConfig,
    setAvatarConfig
  };
};
