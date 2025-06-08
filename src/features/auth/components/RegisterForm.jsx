import { InputField, SubmitButton, Toast } from '../../../components/ui';
import { useRegisterForm } from '../hooks/useRegisterForm';

const RegisterForm = ({ onNavigateToLogin }) => {
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
  } = useRegisterForm();

  return (
    <>
      <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
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
          <button 
            type="button" 
            onClick={onNavigateToLogin}
            className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
          >
            ¿Ya tienes cuenta? Inicia Sesión
          </button>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Registrando...' : 'Registrarse'}
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

export default RegisterForm;
