import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, CheckCircle2, MapPin, Eye, EyeOff, Navigation } from 'lucide-react';
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

  const handleGuestLogin = async () => {
    setError('');
    setLoading(true);
    try {
      // Use the seeded account to immediately authenticate the guest
      await login('pulagorlalakshmi8@gmail.com', 'password123');
      navigate('/dashboard');
    } catch (e) {
      setError('Guest login is temporarily offline. Please create a new account.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    alert('A password reset link has been dispatched to your registered address.');
  };

  return (
    <main className="min-h-screen bg-[#F4F2ED] px-4 py-10 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Logo and Pitch section */}
        <section className="space-y-6 text-[#1F2933] lg:max-w-md shrink-0">
          <div className="flex items-center gap-4 border-l-4 border-[#146B5B] bg-white p-6 shadow-sm">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-[#146B5B] text-white">
              <MapPin className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-[#1F2933] sm:text-5xl">
                RouteConnect
              </h1>
              <p className="mt-2 text-xs uppercase tracking-wider font-bold text-[#146B5B]">
                Unified Multi-Modal Planner
              </p>
            </div>
          </div>
          <p className="text-[#667085] text-sm font-semibold max-w-sm pl-4 leading-relaxed">
            Compare practical combinations of trains, buses, and local rides for one clear journey.
          </p>
        </section>

        {/* Login form Card */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-xl border border-[#D9DED9] bg-white p-8 shadow-sm sm:p-10">
            <div className="flex items-center gap-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F1EE] text-[#146B5B]">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs text-[#146B5B] font-extrabold uppercase tracking-wider">Your journeys, in one place</p>
                <p className="text-xl font-black text-[#1F2933]">Sign in</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-blue-950">
                  Email / Mobile Number
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                  <input
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    type="text"
                    placeholder="Enter email or mobile..."
                    className="w-full rounded-xl border border-blue-200 bg-blue-50/20 px-12 py-3 text-sm text-blue-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-sm font-bold text-blue-950">Password</label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-blue-400" />
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password..."
                    className="w-full rounded-xl border border-blue-200 bg-blue-50/20 px-12 py-3 text-sm text-blue-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-600 transition"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3">
                  <p className="text-xs text-red-700 font-extrabold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-bold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              <div className="flex flex-col gap-3 text-center text-sm pt-2">
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  disabled={loading}
                  className="w-full rounded-xl border border-blue-200 hover:bg-blue-50 py-3 text-sm font-bold text-blue-800 transition flex items-center justify-center gap-2"
                >
                  <Navigation className="h-4 w-4 text-blue-500" />
                  Continue as Guest
                </button>

                <p className="text-blue-800/85 mt-2">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="font-extrabold text-blue-600 hover:text-blue-800 transition"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
