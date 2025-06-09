import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, InputField, SubmitButton, Toast } from '../../../components/ui';
import { useVerifyEmailForm } from '../hooks/useVerifyEmailForm';

const VerifyEmailForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleSuccess = () => {
    navigate('/login');
  };

  const { 
    register, 
    handleSubmit, 
    errors, 
    onSubmit, 
    isLoading, 
    apiError, 
    setApiError
  } = useVerifyEmailForm(email, handleSuccess);

  return (
    <Card title="Verificar Correo">
      <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-center text-sm font-bold text-gray-700">
          Se ha enviado un código de verificación a <br/>
          <span className="text-black">{email}</span>
        </p>

        <InputField 
          type="hidden" 
          {...register('email')}
        />

        <InputField 
          type="text" 
          placeholder="Código de 6 dígitos" 
          error={errors.code}
          disabled={isLoading}
          maxLength="6"
          {...register('code')}
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
          {isLoading ? 'Verificando...' : 'Verificar Código'}
        </SubmitButton>
      </form>

      <Toast 
        message={apiError} 
        type="error" 
        onClose={() => setApiError(null)} 
      />
    </Card>
  );
};

export default VerifyEmailForm;
