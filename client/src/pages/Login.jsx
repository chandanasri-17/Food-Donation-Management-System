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
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#5C4D43] text-[#F7E6CA] shadow-sm">
            <UtensilsCrossed className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#2B2421] tracking-tight">
            Welcome to FoodBridge
          </h2>
          <p className="text-xs text-[#706660]">
            Sign in to post surplus meals or coordinate food collections
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Box */}
        <div className="bg-[#FAF8F6] border border-[#E8DFD5] rounded-2xl p-4 space-y-2.5">
          <p className="text-xs font-bold text-[#2B2421] flex items-center justify-between">
            <span>⚡ Instant Demo Accounts (1-Click Fill):</span>
            <span className="text-[10px] text-[#AD9C8E] font-normal">Pass: password123</span>
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill('hotel@demo.com')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E8DFD5] text-[#706660] hover:border-[#AD9C8E] font-medium transition-colors text-left shadow-xs"
            >
              <Building2 className="w-4 h-4 text-[#5C4D43] shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[#2B2421] truncate">Demo Hotel</span>
                <span className="text-[10px] text-[#AD9C8E]">Provider</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('orphanage@demo.com')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E8DFD5] text-[#706660] hover:border-[#AD9C8E] font-medium transition-colors text-left shadow-xs"
            >
              <HeartHandshake className="w-4 h-4 text-[#8F5345] shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[#2B2421] truncate">Demo Orphanage</span>
                <span className="text-[10px] text-[#AD9C8E]">NGO</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('hostel@demo.com')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E8DFD5] text-[#706660] hover:border-[#AD9C8E] font-medium transition-colors text-left shadow-xs"
            >
              <Building2 className="w-4 h-4 text-[#5C4D43] shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[#2B2421] truncate">Demo Hostel Mess</span>
                <span className="text-[10px] text-[#AD9C8E]">Provider</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill('ngo@demo.com')}
              className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-[#E8DFD5] text-[#706660] hover:border-[#AD9C8E] font-medium transition-colors text-left shadow-xs"
            >
              <HeartHandshake className="w-4 h-4 text-[#8F5345] shrink-0" />
              <div className="truncate">
                <span className="block font-bold text-[#2B2421] truncate">Community NGO</span>
                <span className="text-[10px] text-[#AD9C8E]">NGO</span>
              </div>
            </button>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#E8DFD5] shadow-xs space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#F9F1EE] border border-[#D9BBB0] text-[#754034] text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#706660] uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] focus:border-transparent transition-all placeholder:text-[#AD9C8E]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#706660] uppercase tracking-wide">
                  Password
                </label>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DFD5] text-[#2B2421] text-sm focus:outline-none focus:ring-2 focus:ring-[#AD9C8E] focus:border-transparent transition-all placeholder:text-[#AD9C8E]"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#5C4D43] hover:bg-[#483C34] shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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

          <div className="pt-4 border-t border-[#FAF8F6] text-center text-xs text-[#706660]">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-[#5C4D43] hover:text-[#2B2421]">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
