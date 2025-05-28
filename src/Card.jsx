import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const LoginCard = ({ formType, children }) => (
  <div className="wrapper">
    <div className="login-card">
      <div className="title">{ children }</div>
      {formType === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  </div>
);

export default LoginCard;