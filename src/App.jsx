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
import { ProfileForm, SettingsForm } from './features/profile';
import { NotFound } from './components/ui';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Privadas (Requieren estar logueado) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<ChatLayout />} />
          <Route path="/setup" element={
            <div className="min-h-screen bg-bg-light flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                 <ProfileForm onSuccess={() => window.location.href = '/'} />
              </div>
            </div>
          } />
          <Route path="/settings" element={<SettingsForm />} />
        </Route>

        {/* Rutas Públicas (Solo accesibles si NO estás logueado) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/verify-email" element={<VerifyEmailForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />
        </Route>

        {/* Catch-all Not Found Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;