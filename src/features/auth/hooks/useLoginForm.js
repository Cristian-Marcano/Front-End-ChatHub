import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../schemas/authSchema';
import { authService } from '../services/authService';

export const useLoginForm = () => {
  const navigate = useNavigate();
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
      const payload = { email: data.email, password: data.password };
      const response = await authService.login(payload);
      
      localStorage.setItem('token', response.token);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      console.log('Login exitoso:', response);

      // Verify if profile info exists
      try {
        const profileRes = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/users/info`, {
          headers: { 'Authorization': `Bearer ${response.token}` }
        });
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (!profileData.idInfo) {
            navigate('/profile');
            return;
          }
        }
      } catch (e) {
        console.error('Error fetching profile on login:', e);
      }
      
      navigate('/');
      
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
