import { Link, useNavigate } from 'react-router-dom';
import { Card, InputField, SubmitButton } from '../../../components/ui';
import { useRegisterForm } from '../hooks/useRegisterForm';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    errors, 
    onSubmit, 
    isLoading
  } = useRegisterForm();

  const handleFormSubmit = async (data) => {
    const email = await onSubmit(data);
    if (email) {
      setTimeout(() => {
        navigate('/verify-email', { state: { email } });
      }, 1500);
    }
  };

  return (
    <Card title="Registrarse">
      <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(handleFormSubmit)}>
        <InputField 
          type="text" 
          placeholder="Nombre de Usuario" 
          error={errors.username}
          disabled={isLoading}
          {...register('username')}
        />
        
        <InputField 
          type="email" 
          placeholder="Correo electrónico" 
          error={errors.email}
          disabled={isLoading}
          {...register('email')}
        />
        
        <InputField 
          type="password" 
          placeholder="Contraseña" 
          error={errors.password}
          disabled={isLoading}
          {...register('password')}
        />

        <div className="flex justify-end">
          <Link 
            to="/login"
            className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
          >
            ¿Ya tienes cuenta? Inicia Sesión
          </Link>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </SubmitButton>
      </form>

      </Card>
  );
};

export default RegisterForm;
