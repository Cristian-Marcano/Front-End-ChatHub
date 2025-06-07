import { Card } from './components/ui';
import { LoginForm } from './features/auth';

const App = () => {
  return (
    <Card title="Iniciar Sesión">
      <LoginForm />
    </Card>
  );
};

export default App;