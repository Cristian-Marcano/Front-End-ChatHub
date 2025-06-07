import { InputField, SubmitButton } from '../../../components/ui';
import { useLoginForm } from '../hooks/useLoginForm';

const LoginForm = () => {
  const { register, handleSubmit, errors, onSubmit, isLoading, apiError } = useLoginForm();

  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
      <InputField 
        type="email" 
        placeholder="Correo electrónico" 
        error={errors.email}
        disabled={isLoading}
        {...register('email')}
      />
      
      <div className="flex flex-col gap-2">
        <InputField 
          type="password" 
          placeholder="Contraseña" 
          error={errors.password}
          disabled={isLoading}
          {...register('password')}
        />
        <div className="flex justify-end">
          <a href="#forgot-password" className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      {apiError && (
        <div className="p-3 border-2 border-black bg-red-200 text-black font-bold shadow-[4px_4px_0px_0px_#000]">
          {apiError}
        </div>
      )}

      <SubmitButton disabled={isLoading}>
        {isLoading ? 'Cargando...' : 'Entrar'}
      </SubmitButton>
    </form>
  );
};

export default LoginForm;
