import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schemas/profileSchema';
import { profileService } from '../services/profileService';

export const useProfileForm = (onSuccess) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  
  // Default values
  const [avatarConfig, setAvatarConfig] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    // Aquí cargaríamos el perfil inicial
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const data = await profileService.getProfile(token);
        reset({ full_name: data.full_name || '', phone: data.phone || '', about: data.about || '' });
        
        // El backend ahora guarda photo como JSON (o string JSON). 
        // Si es string JSON hay que parsearlo, si es objeto lo usamos directo.
        if (data.photo) {
          const config = typeof data.photo === 'string' ? JSON.parse(data.photo) : data.photo;
          setAvatarConfig(config);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadProfile();
  }, [reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setApiError(null);
    setSuccessMsg(null);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...data,
        photo: avatarConfig || null
      };

      await profileService.updateProfile(token, payload);
      
      setSuccessMsg('Perfil guardado correctamente');
      if (onSuccess) setTimeout(() => onSuccess(), 1500);
      
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
    apiError,
    setApiError,
    successMsg,
    setSuccessMsg,
    avatarConfig,
    setAvatarConfig
  };
};
