import { Link, useNavigate } from 'react-router-dom';
import { Card, InputField, SubmitButton, Toast } from '../../../components/ui';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';

const ForgotPasswordForm = () => {
  const navigate = useNavigate();
  
  const handleSuccess = () => {
    navigate('/reset-password');
  };

  const { 
    register, 
    handleSubmit, 
    errors, 
    onSubmit, 
    isLoading, 
    apiError, 
    setApiError,
    successMsg,
    setSuccessMsg
  } = useForgotPasswordForm(handleSuccess);

  return (
    <Card title="Recuperar Contraseña">
      <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-center text-sm font-bold text-gray-700">
          Ingresa tu correo para recibir un token de recuperación.
        </p>

        <InputField 
          type="email" 
          placeholder="Correo electrónico" 
          error={errors.email}
          disabled={isLoading}
          {...register('email')}
        />
        
        <div className="flex justify-end w-full">
          <Link 
            to="/login"
            className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Volver a Iniciar Sesión
          </Link>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Recuperar Contraseña'}
        </SubmitButton>
        
        <Link 
          to="/reset-password"
          className="mt-2 text-xs text-center text-gray-500 underline cursor-pointer inline-block w-full"
        >
          (Ir a resetear - Demo Flow)
        </Link>
      </form>

      <Toast 
        message={apiError} 
        type="error" 
        onClose={() => setApiError(null)} 
      />

      <Toast 
        message={successMsg} 
        type="success" 
        onClose={() => setSuccessMsg(null)} 
      />
    </Card>
  );
};

export default ForgotPasswordForm;
