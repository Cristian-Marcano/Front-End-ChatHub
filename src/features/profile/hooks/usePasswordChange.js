import { useState } from 'react';
import { z } from 'zod';

const API_URL = import.meta.env.VITE_API_URL;

export const usePasswordChange = (email) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: initial, 2: wait for token
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const initChange = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccessMsg(null);

      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al solicitar cambio de contraseña');
      }

      setStep(2);
      setIsOpen(true);
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyChange = async (onSuccess) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token,
          password: newPassword
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar la contraseña');
      }

      setIsOpen(false);
      setStep(1);
      setToken('');
      setNewPassword('');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const cancel = () => {
    setIsOpen(false);
    setStep(1);
    setToken('');
    setNewPassword('');
    setError(null);
  };

  return {
    isOpen,
    step,
    token,
    setToken,
    newPassword,
    setNewPassword,
    isLoading,
    error,
    setError,
    successMsg,
    setSuccessMsg,
    initChange,
    verifyChange,
    cancel
  };
};
