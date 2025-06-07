import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchema';

export const useLoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    // Aquí iría la lógica de autenticación real
    console.log('Login data:', data);
    alert(`Intentando iniciar sesión con: ${data.email}`);
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
  };
};
