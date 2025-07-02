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
    defaultValues: { full_name: '', phone: '', about: '' }
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
        
        const data = await profileService.getProfile(token);
        
        // Ensure reset runs with the fetched data
        reset({
          full_name: data.full_name || '',
          phone: data.phone || '',
          about: data.about || ''
        });
        
        if (data.photo) {
          try {
            const config = typeof data.photo === 'string' ? JSON.parse(data.photo) : data.photo;
            setAvatarConfig(config);
          } catch(e) {
            console.error('Error parsing photo config:', e);
          }
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
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
        phone: data.phone || null,
        about: data.about || null,
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
