import InputField from './InputField';
import SubmitButton from './SubmitButton';

const LoginForm = () => (
  <form className="login-form">
    <InputField name="email" type="email" placeholder="Correo" />
    <InputField name="password" type="password" placeholder="Contraseña" />
    <SubmitButton>Iniciar</SubmitButton>
  </form>
);

export default LoginForm;