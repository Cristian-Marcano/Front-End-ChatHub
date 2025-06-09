import { Link } from 'react-router-dom';
import { Card, InputField, SubmitButton, Toast } from '../../../components/ui';
import { useLoginForm } from '../hooks/useLoginForm';

const LoginForm = () => {
  const { register, handleSubmit, errors, onSubmit, isLoading, apiError, setApiError } = useLoginForm();

  return (
    <Card title="Iniciar Sesión">
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
          <div className="flex justify-between w-full">
            <Link 
              to="/register"
              className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
            >
              ¿No tienes cuenta?
            </Link>
            
            <Link 
              to="/forgot-password"
              className="text-sm font-bold text-black underline decoration-2 underline-offset-2 hover:text-blue-600 transition-colors cursor-pointer"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
        </div>

        <SubmitButton disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Entrar'}
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

export default LoginForm;
