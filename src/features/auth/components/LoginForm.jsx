import { InputField, SubmitButton } from '../../../components/ui';

const LoginForm = () => (
  <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
    <InputField name="email" type="email" placeholder="Correo electrónico" />
    <InputField name="password" type="password" placeholder="Contraseña" />
    <SubmitButton>Entrar</SubmitButton>
  </form>
);

export default LoginForm;
