import { InputField, SubmitButton, Toast } from '../../../components/ui';
import { useForgotPasswordForm } from '../hooks/useForgotPasswordForm';

const ForgotPasswordForm = ({ onNavigateToLogin, onNavigateToReset }) => {
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
  } = useForgotPasswordForm(onNavigateToReset);

  return (
    <>
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
          <button 
            type="button" 
            onClick={onNavigateToLogin}
            className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Volver a Iniciar Sesión
          </button>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Enviando...' : 'Recuperar Contraseña'}
        </SubmitButton>
        
        {/* Helper temporary button for demo flow without actual email delivery */}
        <button 
          type="button"
          onClick={onNavigateToReset}
          className="mt-2 text-xs text-center text-gray-500 underline cursor-pointer"
        >
          (Ir a resetear - Demo Flow)
        </button>
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
    </>
  );
};

export default ForgotPasswordForm;
