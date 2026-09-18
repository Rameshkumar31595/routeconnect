import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!emailOrPhone.trim()) {
      setError('Please enter your email address or phone number.');
      return;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await login(emailOrPhone, password);
      navigate('/dashboard');
    } catch (e) {
      setError((e as Error).message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#E7F0EC] px-4 py-12 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Title */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#146B5B] text-white shadow-sm mb-3">
            <MapPin className="h-8 w-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#1F2933]">
            RouteConnect
          </h1>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-[#D9DED9] bg-white p-8 shadow-sm sm:p-10">
          <h2 className="text-xl font-black text-[#1F2933] mb-6">
            Sign In
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1F2933]">
                Email / Mobile Number
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                <input
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  type="text"
                  placeholder="Enter email or mobile..."
                  className="w-full rounded-xl border border-[#D9DED9] bg-white pl-11 pr-4 py-3 text-sm text-[#1F2933] placeholder-[#667085]/60 outline-none transition focus:border-[#146B5B] focus:ring-1 focus:ring-[#146B5B]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-[#1F2933]">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#667085]" />
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password..."
                  className="w-full rounded-xl border border-[#D9DED9] bg-white pl-11 pr-11 py-3 text-sm text-[#1F2933] placeholder-[#667085]/60 outline-none transition focus:border-[#146B5B] focus:ring-1 focus:ring-[#146B5B]"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085] hover:text-[#1F2933] transition"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-3" role="alert">
                <p className="text-xs text-red-700 font-extrabold">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#146B5B] hover:bg-[#0E4E42] py-3.5 text-sm font-bold text-white shadow-sm transition hover:shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="text-center text-sm pt-2">
              <p className="text-[#667085]">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-extrabold text-[#146B5B] hover:underline transition"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
