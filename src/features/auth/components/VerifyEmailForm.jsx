import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, InputField, SubmitButton, OTPInput } from '../../../components/ui';
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
    setValue,
    watch,
    errors, 
    onSubmit, 
    isLoading
  } = useVerifyEmailForm(email, handleSuccess);

  const codeValue = watch('code') || '';

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

        <div className="flex flex-col items-center gap-1">
          <OTPInput 
            length={6}
            value={codeValue}
            onChange={(val) => setValue('code', val, { shouldValidate: true })}
            disabled={isLoading}
          />
          {errors.code && (
            <span className="text-red-500 font-bold text-xs self-start mt-1">
              {errors.code.message}
            </span>
          )}
        </div>
        
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

      </Card>
  );
};

export default VerifyEmailForm;
