import { useState } from 'react';
import { Card, InputField, SubmitButton, Toast } from '../../../components/ui';
import { useProfileForm } from '../hooks/useProfileForm';
import AvatarEditor from './AvatarEditor';
import { AvatarPreview } from './AvatarPreview';
import { Edit2 } from 'lucide-react';

const ProfileForm = ({ onSuccess, onCancel }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    apiError,
    setApiError,
    successMsg,
    setSuccessMsg,
    avatarConfig,
    setAvatarConfig
  } = useProfileForm(onSuccess);

  return (
    <Card title="Tu Perfil">
      <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
        
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => setIsEditorOpen(true)}>
            <AvatarPreview 
              config={avatarConfig} 
              className="w-32 h-32 rounded-sm group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform" 
            />
            <div className="absolute -bottom-2 -right-2 bg-yellow-300 border-2 border-black p-2 rounded-sm shadow-[2px_2px_0px_0px_#000] group-hover:bg-yellow-400 transition-colors">
              <Edit2 size={16} className="text-black" />
            </div>
          </div>
          <p className="text-sm font-bold text-gray-600">Haz clic para cambiar tu Avatar</p>
        </div>

        {/* Info Section */}
        <div className="flex flex-col gap-4">
          <InputField 
            type="text" 
            placeholder="Nombre Completo (opcional)" 
            error={errors.full_name}
            disabled={isLoading}
            {...register('full_name')}
          />
          
          <InputField 
            type="tel" 
            placeholder="Teléfono (opcional)" 
            error={errors.phone}
            disabled={isLoading}
            {...register('phone')}
          />
          
          <div className="flex flex-col gap-1 w-full">
            <textarea
              placeholder="Acerca de ti (opcional)..."
              disabled={isLoading}
              className={`w-full p-4 rounded-sm border-2 shadow-[4px_4px_0px_0px_#000] text-black font-semibold placeholder:text-gray-600 focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-colors resize-none h-24 ${
                errors.about ? 'border-red-500 focus:border-red-600' : 'border-black focus:border-primary'
              }`}
              {...register('about')}
            />
            {errors.about && <span className="text-sm font-bold text-red-600">{errors.about.message}</span>}
          </div>
        </div>

        <div className="flex gap-4 mt-2">
          {onCancel && (
            <button 
              type="button"
              onClick={onCancel}
              className="flex-1 bg-white border-2 border-black py-3 font-black text-black rounded-sm shadow-[4px_4px_0px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
            >
              Cancelar
            </button>
          )}
          <SubmitButton disabled={isLoading}>
            {isLoading ? 'Guardando...' : 'Guardar Perfil'}
          </SubmitButton>
        </div>
      </form>

      {isEditorOpen && (
        <AvatarEditor 
          initialConfig={avatarConfig}
          onSave={(config) => {
            setAvatarConfig(config);
            setIsEditorOpen(false);
          }}
          onCancel={() => setIsEditorOpen(false)}
        />
      )}

      <Toast message={apiError} type="error" onClose={() => setApiError(null)} />
      <Toast message={successMsg} type="success" onClose={() => setSuccessMsg(null)} />
    </Card>
  );
};

export default ProfileForm;
