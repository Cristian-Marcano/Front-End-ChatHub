import { ENV } from '../../../config/env';

export const authService = {
  async login(credentials) {
    const response = await fetch(`${ENV.API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error?.message || 'Error al iniciar sesión');
    }

    return data;
  }
};
