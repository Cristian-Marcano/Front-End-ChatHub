import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { 
  LoginForm, 
  RegisterForm, 
  VerifyEmailForm, 
  ForgotPasswordForm, 
  ResetPasswordForm,
  ProtectedRoute,
  PublicRoute
} from './features/auth';
import { ChatLayout } from './features/chat';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Privadas (Requieren estar logueado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ChatLayout />} />
        </Route>

        {/* Rutas Públicas (Solo accesibles si NO estás logueado) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-email" element={<VerifyEmailForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;