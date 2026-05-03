import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('admin@team.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-white font-sans">
      <div className="w-full max-w-sm">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-10 text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Sign in</h2>
            <p className="text-white/40 text-sm">Enter your credentials to access your workspace.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 text-xs text-red-400 border border-red-400/20 bg-red-400/5">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Email address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20"
                  placeholder="admin@team.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-white/90">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border border-white/10 px-4 py-3 text-sm focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20"
                  placeholder="••••••••"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-white/20" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 bg-transparent border border-white/20 rounded-none checked:bg-white checked:border-white appearance-none cursor-pointer transition-all"
                />
                <span className="ml-3 text-sm text-white/60 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-sm text-white/60 hover:text-white transition-colors">
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-4 text-sm font-bold flex justify-center items-center group hover:bg-white/90 transition-colors"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <div className="flex items-center space-x-2">
                  <span>Sign in</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              )}
            </button>
          </form>
          
          <div className="mt-12 pt-8 border-t border-white/5">
            <p className="text-[11px] uppercase tracking-widest text-white/30 mb-4 text-center">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white/5 rounded-sm">
                <p className="text-[10px] text-white/40 uppercase mb-1">Admin</p>
                <p className="text-xs text-white/70">admin@team.com</p>
              </div>
              <div className="p-3 bg-white/5 rounded-sm">
                <p className="text-[10px] text-white/40 uppercase mb-1">Manager</p>
                <p className="text-xs text-white/70">john@team.com</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
