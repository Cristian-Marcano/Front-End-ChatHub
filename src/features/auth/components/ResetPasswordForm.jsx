import { Link, useNavigate } from 'react-router-dom';
import { Card, InputField, SubmitButton } from '../../../components/ui';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';

const ResetPasswordForm = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/login');
  };

  const { 
    register, 
    handleSubmit, 
    errors, 
    onSubmit, 
    isLoading
  } = useResetPasswordForm(handleSuccess);

  return (
    <Card title="Restablecer Contraseña">
      <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-center text-sm font-bold text-gray-700">
          Ingresa el token que recibiste y tu nueva contraseña.
        </p>

        <InputField 
          type="text" 
          placeholder="Token de recuperación" 
          error={errors.token}
          disabled={isLoading}
          {...register('token')}
        />

        <InputField 
          type="password" 
          placeholder="Nueva Contraseña (min 8 carácteres)" 
          error={errors.newPassword}
          disabled={isLoading}
          {...register('newPassword')}
        />
        
        <div className="flex justify-end w-full">
          <Link 
            to="/login"
            className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Cancelar y volver al Login
          </Link>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Restablecer Contraseña'}
        </SubmitButton>
      </form>

      </Card>
  );
};

export default ResetPasswordForm;
