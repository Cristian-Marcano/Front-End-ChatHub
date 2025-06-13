import { ENV } from '../../../config/env';

export const profileService = {
  async getProfile(token) {
    const response = await fetch(`${ENV.API_URL}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // We assume the backend responds with { data: UserInfo } or similar
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || 'Error al obtener el perfil');
    }
    return result;
  },

  async updateProfile(token, profileData) {
    // If the endpoint is PUT or POST to /profile or /user-info
    // According to backend IUserInfoModel, it's createUserInfo / updateUserInfo
    const response = await fetch(`${ENV.API_URL}/profile`, {
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
