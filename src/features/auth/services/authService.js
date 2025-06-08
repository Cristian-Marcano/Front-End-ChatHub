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
  },

  async register(userData) {
    const response = await fetch(`${ENV.API_URL}/signup`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error?.message || 'Error al registrarse');
    }

    return data;
  },

  async verifyEmail(data) {
    const payload = { ...data, code: Number(data.code) }; // Backend espera que 'code' sea un número
    const response = await fetch(`${ENV.API_URL}/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error?.message || 'Error al verificar el correo');
    }

    return result;
  }
};
