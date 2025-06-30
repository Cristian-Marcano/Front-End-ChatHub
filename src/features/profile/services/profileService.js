import { ENV } from '../../../config/env';

export const profileService = {
  async getProfile(token) {
    const response = await fetch(`${ENV.API_URL}/api/users/info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Error al obtener el perfil');
    }
    return result;
  },

  async updateProfile(token, profileData) {
    const response = await fetch(`${ENV.API_URL}/api/users/info`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Error al actualizar el perfil');
    }
    return result;
  }
};
