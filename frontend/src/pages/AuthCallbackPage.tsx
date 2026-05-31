import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      const authenticateUser = async () => {
        try {
          const rawToken = token.replace(/^Bearer\s+/i, '');
          
          // Verify token and fetch user details
          const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
          const response = await axios.get(`${baseUrl}/auth/me`, {
            headers: {
              Authorization: `Bearer ${rawToken}`
            }
          });

          if (response.data.success) {
            login(rawToken, response.data.user);
            navigate('/dashboard');
          } else {
            console.error("Failed to authenticate with token.");
            navigate('/login');
          }
        } catch (error) {
          console.error("Error during authentication callback:", error);
          navigate('/login');
        }
      };

      authenticateUser();
    } else {
      console.warn("No token found in URL.");
      navigate('/login');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black/20 border-t-black"></div>
        <p className="text-black/60">Authenticating...</p>
      </div>
    </div>
  );
}
