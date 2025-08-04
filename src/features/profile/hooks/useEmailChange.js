import { toast } from "../../../utils/toast";
import { useState } from 'react';
import { z } from 'zod';

const API_URL = import.meta.env.VITE_API_URL;

export const useEmailChange = (originalEmail) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: init, 2: verify
  const [newEmail, setNewEmail] = useState('');
  const [oldCode, setOldCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const initChange = async (email) => {
    try {
      setIsLoading(true);
      setError(null);
      setNewEmail(email);

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/change-email/init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ new_email: email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar el cambio de correo');
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

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/users/change-email/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          old_code: parseInt(oldCode, 10),
          new_code: parseInt(newCode, 10)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al verificar los códigos');
      }

      setIsOpen(false);
      setStep(1);
      setOldCode('');
      setNewCode('');
      
      if (onSuccess) {
        onSuccess(data.new_email);
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
    setOldCode('');
    setNewCode('');
    setError(null);
  };

  return {
    isOpen,
    step,
    newEmail,
    oldCode,
    setOldCode,
    newCode,
    setNewCode,
    isLoading,
    error,
    setError,
    initChange,
    verifyChange,
    cancel
  };
};
