import { InputField, SubmitButton } from '../../../components/ui';

export const PasswordChangeModal = ({ 
  isOpen, 
  token, 
  setToken, 
  newPassword, 
  setNewPassword, 
  isLoading, 
  error, 
  onVerify, 
  onCancel 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div className="bg-white p-6 md:p-8 rounded-sm border-4 border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-md">
        <h3 className="text-2xl font-black mb-4 uppercase">Cambiar Contraseña</h3>
        
        <p className="text-sm font-semibold mb-6">
          Te hemos enviado un correo con un token de seguridad. Ingrésalo a continuación junto con tu nueva contraseña.
        </p>

        {error && (
          <div className="bg-red-100 border-2 border-red-500 p-2 mb-4 rounded-sm text-red-700 font-bold text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 mb-6">
          <div>
            <label className="block font-bold text-sm mb-1">Token de Seguridad</label>
            <InputField 
              type="text" 
              placeholder="Token enviado al correo" 
              value={token}
              onChange={(e) => setToken(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="block font-bold text-sm mb-1">Nueva Contraseña</label>
            <InputField 
              type="password" 
              placeholder="Min. 8 caracteres" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 py-2 font-bold text-black border-2 border-black rounded-sm hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <div className="flex-1">
            <SubmitButton 
              onClick={onVerify}
              disabled={isLoading || token.length < 5 || newPassword.length < 8}
            >
              {isLoading ? 'Guardando...' : 'Cambiar'}
            </SubmitButton>
          </div>
        </div>
      </div>
    </div>
  );
};
