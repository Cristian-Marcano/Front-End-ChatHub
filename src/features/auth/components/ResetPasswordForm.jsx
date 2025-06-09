import { InputField, SubmitButton, Toast } from '../../../components/ui';
import { useResetPasswordForm } from '../hooks/useResetPasswordForm';

const ResetPasswordForm = ({ onNavigateToLogin }) => {
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
  } = useResetPasswordForm(onNavigateToLogin);

  return (
    <>
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
          <button 
            type="button" 
            onClick={onNavigateToLogin}
            className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
          >
            Cancelar y volver al Login
          </button>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Guardando...' : 'Restablecer Contraseña'}
        </SubmitButton>
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

export default ResetPasswordForm;
