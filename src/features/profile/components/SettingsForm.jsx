import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, InputField, SubmitButton, Toast } from '../../../components/ui';
import { useSettingsForm } from '../hooks/useSettingsForm';
import AvatarEditor from './AvatarEditor';
import { AvatarPreview } from './AvatarPreview';
import { Edit2, ArrowLeft } from 'lucide-react';

const SettingsForm = () => {
  const navigate = useNavigate();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    errors,
    onSubmit,
    isLoading,
    isFetching,
    apiError,
    setApiError,
    successMsg,
    setSuccessMsg,
    avatarConfig,
    setAvatarConfig
  } = useSettingsForm();

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-light">
        <div className="text-xl font-bold">Cargando...</div>
      </div>
    );
  }

  const currentUsername = watch('username');

  return (
    <Card title="Ajustes de Perfil" className="max-w-4xl relative">
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 font-bold hover:underline"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <form className="flex flex-col md:flex-row gap-8 w-full mt-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Columna Izquierda: Avatar y Cuenta */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex flex-col items-center gap-3">
                <div className="relative group cursor-pointer" onClick={() => setIsEditorOpen(true)}>
                  <AvatarPreview 
                    config={avatarConfig} 
                    name={currentUsername}
                    className="w-40 h-40 rounded-sm group-hover:-translate-y-1 group-hover:-translate-x-1 transition-transform" 
                  />
                  <div className="absolute -bottom-2 -right-2 bg-yellow-300 border-2 border-black p-2 rounded-sm shadow-[2px_2px_0px_0px_#000] group-hover:bg-yellow-400 transition-colors">
                    <Edit2 size={20} className="text-black" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="font-black border-b-2 border-black pb-1">Cuenta</h3>
                <InputField 
                  type="text" 
                  placeholder="Nombre de Usuario" 
                  error={errors.username}
                  disabled={isLoading}
                  {...register('username')}
                />
                <InputField 
                  type="email" 
                  placeholder="Correo Electrónico" 
                  error={errors.email}
                  disabled={isLoading}
                  {...register('email')}
                />
              </div>
            </div>

            {/* Columna Derecha: Información Personal */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="font-black border-b-2 border-black pb-1">Información Personal</h3>
              <InputField 
                type="text" 
                placeholder="Nombre Completo" 
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
                  className={`w-full p-4 rounded-sm border-2 shadow-[4px_4px_0px_0px_#000] text-black font-semibold placeholder:text-gray-600 focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-colors resize-none h-32 ${
                    errors.about ? 'border-red-500 focus:border-red-600' : 'border-black focus:border-primary'
                  }`}
                  {...register('about')}
                />
                {errors.about && <span className="text-sm font-bold text-red-600">{errors.about.message}</span>}
              </div>

              <div className="mt-4">
                <SubmitButton disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                </SubmitButton>
              </div>
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

export default SettingsForm;
