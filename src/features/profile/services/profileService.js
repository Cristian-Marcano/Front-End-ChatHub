import { ENV } from '../../../config/env';

const handleResponse = async (response) => {
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw new Error('Sesión expirada. Por favor inicie sesión nuevamente.');
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(result.message || 'Error en la petición');
    error.status = response.status;
    throw error;
  }
  return result;
};

export const profileService = {
  async getProfile(token) {
    const response = await fetch(`${ENV.API_URL}/api/users/info`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return handleResponse(response);
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

    return handleResponse(response);
  },

  async updateSettings(token, settingsData) {
    const response = await fetch(`${ENV.API_URL}/api/users/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(settingsData)
    });

    return handleResponse(response);
  }
};
