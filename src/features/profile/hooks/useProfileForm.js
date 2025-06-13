import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileSchema } from '../schemas/profileSchema';
// import { profileService } from '../services/profileService';

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
        
        // Mocked or real fetch
        // const data = await profileService.getProfile(token);
        // reset({ full_name: data.full_name, phone: data.phone, about: data.about });
        // if (data.photo) setAvatarConfig(JSON.parse(data.photo));
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
      // const token = localStorage.getItem('token');
      const payload = {
        ...data,
        photo: avatarConfig ? JSON.stringify(avatarConfig) : null
      };

      // Si el endpoint no existe aún, comentamos la llamada y simulamos éxito
      // await profileService.updateProfile(token, payload);
      console.log('Guardando Perfil:', payload);
      
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
