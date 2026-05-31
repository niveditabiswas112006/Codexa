import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Briefcase } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'employee' // Default role for registration
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const baseUrl = import.meta.env.VITE_API_URL;
      const url = isLogin ? `${baseUrl}/auth/login` : `${baseUrl}/auth/register`;

      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            password: formData.password,
            role: formData.role
          };

      const response = await axios.post(url, payload);

      if (response.data.token) {
        const rawToken = response.data.token?.replace(/^Bearer\s+/i, '');
        login(rawToken, response.data.user);
        navigate('/dashboard');
      } else if (!isLogin && response.data.success) {
        // After successful registration, switch to login mode
        setIsLogin(true);
        setError('Account created successfully! Please log in.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen w-full bg-white text-black selection:bg-black/10 p-2 transition-all duration-500 lg:h-screen lg:overflow-hidden lg:p-4">
      {/* Left Column (Video/Decoration) */}
      <div className="hidden lg:flex w-[52%] relative flex-col items-center justify-center pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full">
        <video className="absolute inset-0 w-full h-full object-cover" autoPlay muted loop playsInline>
          <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#ff7b00_0%,#ff8d21_18%,#ffa652_36%,#ffb76b_54%,#ffcd90_72%,#fff4df_90%)] opacity-85 pointer-events-none" />
        
        <div className="z-10 w-full max-w-xs space-y-8">
          <div className="flex items-center gap-3">
            <img src="/codexa-logo.png" alt="CODEXA Logo" className="w-8 h-8 filter brightness-0 invert" />
            <span className="text-2xl font-bold tracking-tight text-white">CODEXA</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap text-white">
              {isLogin ? 'Welcome back to' : 'Join'}{' '}
              <span className="font-bold text-5xl text-white">CODEXA</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed px-4">
              {isLogin 
                ? 'Sign in to access your dashboard, projects, and leads.' 
                : 'Follow these 3 quick phases to activate your space.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${isLogin ? 'bg-white text-black border-black/10' : 'bg-brand-gray text-white border-none bg-black/20'}`}>
              <div className={`flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm ${isLogin ? 'bg-black text-white' : 'bg-white/10 text-white'}`}>
                1
              </div>
              <span className="text-sm font-medium">
                {isLogin ? 'Authenticate Identity' : 'Register your identity'}
              </span>
            </div>
            <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${!isLogin ? 'bg-brand-gray text-white border-none bg-black/20' : 'bg-white/5 text-white/40 border-none'}`}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm bg-white/10 text-white">
                2
              </div>
              <span className="text-sm font-medium">Configure your studio</span>
            </div>
            <div className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all ${!isLogin ? 'bg-brand-gray text-white border-none bg-black/20' : 'bg-white/5 text-white/40 border-none'}`}>
              <div className="flex items-center justify-center w-8 h-8 rounded-full font-medium text-sm bg-white/10 text-white">
                3
              </div>
              <span className="text-sm font-medium">Finalize your profile</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden bg-white">
        <motion.div 
          className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="space-y-2">
            <h2 className="text-4xl font-medium tracking-tight">
              {isLogin ? 'Account Sign In' : 'Create New Profile'}
            </h2>
            <p className="text-black/60 text-base">
              {isLogin ? 'Access your workspace and tools.' : 'Input your basic details to begin the journey.'}
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button" 
              onClick={() => {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
                window.location.href = `${baseUrl}/auth/google`;
              }}
              className="flex items-center justify-center gap-2 border border-black/10 rounded-xl h-12 hover:bg-black/5 text-black font-medium transition-colors"
            >
              <span>Google</span>
            </button>
            <button 
              type="button" 
              onClick={() => {
                const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5003/api';
                window.location.href = `${baseUrl}/auth/github`;
              }}
              className="flex items-center justify-center gap-2 border border-black/10 rounded-xl h-12 hover:bg-black/5 text-black font-medium transition-colors"
            >
              <span>Github</span>
            </button>
          </div>


          <div className="relative flex items-center">
            <div className="flex-1 border-t border-black/10"></div>
            <span className="bg-white px-4 text-xs font-medium text-black/60 uppercase tracking-widest">Or</span>
            <div className="flex-1 border-t border-black/10"></div>
          </div>

          {error && (
            <div className={`p-4 rounded-xl text-sm font-medium ${error.includes('successfully') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-black">First Name</label>
                    <input 
                      type="text" 
                      name="firstName" 
                      placeholder="Enter your first name" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full bg-gray-100 border border-black/10 rounded-xl h-12 px-4 text-base text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-medium text-black">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      placeholder="Enter your last name" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required={!isLogin}
                      className="w-full bg-gray-100 border border-black/10 rounded-xl h-12 px-4 text-base text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-black">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-gray-100 border border-black/10 rounded-xl h-12 px-4 text-base text-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-base font-medium text-black">Email</label>
              <input 
                type="email" 
                name="email" 
                placeholder="Enter your email address" 
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full bg-gray-100 border border-black/10 rounded-xl h-12 px-4 text-base text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-base font-medium text-black">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  name="password" 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-gray-100 border border-black/10 rounded-xl h-12 px-4 text-base text-black placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-black/10 pr-12" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {!isLogin && <p className="text-sm text-black/40">Requires at least 8 symbols.</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-black text-white font-semibold rounded-xl text-base hover:bg-black/90 active:scale-[0.98] transition-all mt-4 flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>

            <p className="text-center text-base text-black/60 mt-4">
              {isLogin ? "New to CODEXA?" : "Member of the team?"}{' '}
              <button 
                type="button" 
                onClick={() => setIsLogin(!isLogin)}
                className="text-black font-semibold hover:underline transition-colors"
              >
                {isLogin ? 'Create Account' : 'Log in'}
              </button>
            </p>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
