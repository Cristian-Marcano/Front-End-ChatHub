import { useState } from 'react';
import { Card } from './components/ui';
import { LoginForm, RegisterForm, VerifyEmailForm, ForgotPasswordForm, ResetPasswordForm } from './features/auth';

const App = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login' | 'register' | 'verify-email' | 'forgot-password' | 'reset-password'
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setCurrentView('verify-email');
  };

  let title = 'Iniciar Sesión';
  if (currentView === 'register') title = 'Registrarse';
  if (currentView === 'verify-email') title = 'Verificar Correo';
  if (currentView === 'forgot-password') title = 'Recuperar Contraseña';
  if (currentView === 'reset-password') title = 'Restablecer Contraseña';

  return (
    <Card title={title}>
      {currentView === 'login' && (
        <LoginForm 
          onNavigateToRegister={() => setCurrentView('register')} 
          onNavigateToForgotPassword={() => setCurrentView('forgot-password')}
        />
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
          onSuccess={() => setCurrentView('login')} 
        />
      )}

      {currentView === 'forgot-password' && (
        <ForgotPasswordForm
          onNavigateToLogin={() => setCurrentView('login')}
          onNavigateToReset={() => setCurrentView('reset-password')}
        />
      )}

      {currentView === 'reset-password' && (
        <ResetPasswordForm
          onNavigateToLogin={() => setCurrentView('login')}
        />
      )}
    </Card>
  );
};

export default App;