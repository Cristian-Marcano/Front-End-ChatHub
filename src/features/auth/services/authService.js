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
  },

  async forgotPassword(data) {
    const response = await fetch(`${ENV.API_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error?.message || 'Error al solicitar recuperación');
    }

    return result;
  },

  async resetPassword(data) {
    const response = await fetch(`${ENV.API_URL}/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || result.error?.message || 'Error al restablecer la contraseña');
    }

    return result;
  },

  async logout(refreshToken) {
    if (!refreshToken) return;
    
    const response = await fetch(`${ENV.API_URL}/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    // In a real app we might not throw if logout fails, 
    // we just want to remove the token locally anyway.
    if (!response.ok) {
      console.warn('Backend logout failed, but local session will be destroyed.');
    }
  }
};
