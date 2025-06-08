import { useState } from 'react';
import { Card } from './components/ui';
import { LoginForm, RegisterForm } from './features/auth';

const App = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'register'

  return (
    <Card title={currentView === 'login' ? 'Iniciar Sesión' : 'Registrarse'}>
      {currentView === 'login' ? (
        <LoginForm onNavigateToRegister={() => setCurrentView('register')} />
      ) : (
        <RegisterForm onNavigateToLogin={() => setCurrentView('login')} />
      )}
    </Card>
  );
};

export default App;