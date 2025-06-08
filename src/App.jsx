import { useState } from 'react';
import { Card } from './components/ui';
import { LoginForm, RegisterForm, VerifyEmailForm } from './features/auth';

const App = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register' | 'verify-email'
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setCurrentView('verify-email');
  };

  let title = 'Iniciar Sesión';
  if (currentView === 'register') title = 'Registrarse';
  if (currentView === 'verify-email') title = 'Verificar Correo';

  return (
    <Card title={title}>
      {currentView === 'login' && (
        <LoginForm onNavigateToRegister={() => setCurrentView('register')} />
      )}
      
      {currentView === 'register' && (
        <RegisterForm 
          onNavigateToLogin={() => setCurrentView('login')} 
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {currentView === 'verify-email' && (
        <VerifyEmailForm 
          email={registeredEmail}
          onNavigateToLogin={() => setCurrentView('login')}
          onSuccess={() => setCurrentView('login')} // Or directly login if the backend does it
        />
      )}
    </Card>
  );
};

export default App;