import { InputField, SubmitButton } from '../../../components/ui';
import { useLoginForm } from '../hooks/useLoginForm';

const LoginForm = () => {
  const { register, handleSubmit, errors, onSubmit } = useLoginForm();

  return (
    <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
      <InputField 
        type="email" 
        placeholder="Correo electrónico" 
        error={errors.email}
        {...register('email')}
      />
      
      <div className="flex flex-col gap-2">
        <InputField 
          type="password" 
          placeholder="Contraseña" 
          error={errors.password}
          {...register('password')}
        />
        <div className="flex justify-end">
          <a href="#forgot-password" className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors">
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>

      <SubmitButton>Entrar</SubmitButton>
    </form>
  );
};

export default LoginForm;
