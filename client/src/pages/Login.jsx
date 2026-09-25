import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UtensilsCrossed, AlertCircle, Building2, HeartHandshake, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === 'provider') {
        navigate('/provider/dashboard', { replace: true });
      } else {
        navigate('/ngo/dashboard', { replace: true });
      }
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleDemoFill = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-200">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Welcome to FoodBridge
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to post surplus meals or coordinate food collections
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Box */}
        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-4 space-y-2.5">
          <p className="text-xs font-bold text-emerald-900 flex items-center justify-between">
            <span>⚡ Instant Demo Accounts (1-Click Fill):</span>
            <span className="text-[10px] text-emerald-700 font-normal">Pass: password123</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('hotel@demo.com')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:border-emerald-500 font-medium transition-colors text-left"
            >
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-slate-900 truncate">Demo Hotel</span>
                <span className="text-[10px] text-slate-500">Provider</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('orphanage@demo.com')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:border-emerald-500 font-medium transition-colors text-left"
            >
              <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-slate-900 truncate">Demo Orphanage</span>
                <span className="text-[10px] text-slate-500">NGO</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('hostel@demo.com')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:border-emerald-500 font-medium transition-colors text-left"
            >
              <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-slate-900 truncate">Demo Hostel Mess</span>
                <span className="text-[10px] text-slate-500">Provider</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('ngo@demo.com')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-emerald-200 text-slate-700 hover:border-emerald-500 font-medium transition-colors text-left"
            >
              <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-slate-900 truncate">Community NGO</span>
                <span className="text-[10px] text-slate-500">NGO</span>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
