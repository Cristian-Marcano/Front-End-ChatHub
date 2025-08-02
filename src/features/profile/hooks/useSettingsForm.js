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
  const [originalData, setOriginalData] = useState(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, dirtyFields }
  } = useForm({
    resolver: zodResolver(settingsSchema)
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await profileService.getProfile(token);
        
        setOriginalData(data);
        setValue('username', data.username || '');
        setValue('email', data.email || '');
        setValue('full_name', data.full_name || '');
        setValue('phone', data.phone || '');
        setValue('about', data.about || '');

        if (data.photo) {
          try {
            const config = typeof data.photo === 'string' ? JSON.parse(data.photo) : data.photo;
            setAvatarConfig(config);
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

      const payload = {};
      Object.keys(dirtyFields).forEach(key => {
        if (key !== 'email') {
          payload[key] = data[key];
        }
      });

      // Track if avatar changed
      let originalAvatar = null;
      if (originalData?.photo) {
        try {
          originalAvatar = typeof originalData.photo === 'string' ? JSON.parse(originalData.photo) : originalData.photo;
        } catch(e) {}
      }
      if (JSON.stringify(originalAvatar) !== JSON.stringify(avatarConfig)) {
        payload.photo = avatarConfig || null;
      }

      const hasOtherChanges = Object.keys(payload).length > 0;

      if (hasOtherChanges) {
        await profileService.updateSettings(token, payload);
        setOriginalData(prev => ({ ...prev, ...payload }));
      }

      // Check if email was changed
      if (dirtyFields.email && data.email !== originalData?.email) {
        if (onSuccess) {
          onSuccess({ ...payload, email: data.email }, true); // true = email changed
        }
      } else {
        if (hasOtherChanges) {
          setSuccessMsg('Ajustes guardados correctamente');
        } else {
          setSuccessMsg('No hay cambios para guardar');
        }
        if (onSuccess && hasOtherChanges) {
          onSuccess(payload, false);
        }
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
    watch,
    errors,
    onSubmit,
    isLoading,
    isFetching,
    apiError,
    setApiError,
    successMsg,
    setSuccessMsg,
    avatarConfig,
    setAvatarConfig,
    originalData
  };
};
