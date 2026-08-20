import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useGoogleLogin } from '@react-oauth/google';
import { BsGoogle } from 'react-icons/bs';
import { BiEnvelope, BiKey } from 'react-icons/bi';
import { HiSparkles } from 'react-icons/hi2';

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  const googleLogin = useGoogleLogin(
    {
      onSuccess: async (response) => {
        setLoading(true);
        try {
          const tokenVal = response.access_token || response.code || response.credential;
          const payload = {
            accessToken: tokenVal,
            token: tokenVal,
            googleToken: tokenVal,
            code: response.code
          };

          const attempts = [
            () => api.post("/users/google-login", payload),
            () => api.post("/users/google", payload),
            () => api.post("/users/login/google", payload),
            () => api.post("/users/google/login", payload),
            () => api.post("/users/login-google", payload),
            () => api.post("/users/googlelogin", payload),
            () => api.post("/users/google-auth", payload),
            () => api.post("/users/auth/google", payload),
          ];

          let lastErr = null;
          let successRes = null;

          for (const attempt of attempts) {
            try {
              const res = await attempt();
              if (res?.data) {
                successRes = res;
                break;
              }
            } catch (err) {
              lastErr = err;
              if (err?.response?.status !== 404 && err?.response?.status !== 405) {
                throw err;
              }
            }
          }

          if (!successRes && lastErr) {
            throw lastErr;
          }

          const res = successRes;
          if (res?.data?.token) {
            localStorage.setItem("token", res.data.token);
            toast.success(res.data.message || "Google Login successful");
            if (res.data.isAdmin) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          } else {
            toast.error(res?.data?.message || "Google Login failed: No token returned");
          }
        } catch (err) {
          console.error("Google Login error:", err);
          if (err?.response?.status === 404) {
            toast.error("Google Login endpoint is not implemented on the backend (404)");
          } else {
            toast.error(err?.response?.data?.message || err?.message || "Google Login failed");
          }
        } finally {
          setLoading(false);
        }
      },
      onError: (err) => {
        console.error("Google OAuth error:", err);
        toast.error(err?.error_description || err?.error || "Google Sign-In failed or was closed");
      }
    }
  );

  async function handleLogin() {
    setLoading(true)
    try {
      const res = await api.post('/users/login', {
        email: email,
        password: password
      })
      if (res.data.token) {
        localStorage.setItem('token', res.data.token)
        toast.success(res.data.message || "Login successful")
        if (res.data.isAdmin) {
          navigate('/admin')
        } else {
          navigate('/')
        }
      } else {
        toast.error(res.data.message || "Login failed")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    }
    setLoading(false)
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background glow accents matching home page */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        
        {/* Brand Header & Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-1">
            <HiSparkles size={15} /> Welcome Back
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 tracking-tight">
            Account Login
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Sign in to access your orders, profile, and exclusive deals.
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BiEnvelope className="text-amber-400" size={16} /> Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BiKey className="text-amber-400" size={16} /> Password
              </label>
              <Link to="/forget-password" className="text-xs text-amber-400 hover:text-amber-300 font-medium transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              "Sign In"
            )}
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-700/80 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest absolute">Or</span>
          </div>

          <button
            disabled={loading}
            onClick={() => googleLogin()}
            className="w-full py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold rounded-xl flex justify-center items-center gap-2.5 border border-slate-700 transition-all shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BsGoogle className="text-red-400" size={16} />
            <span>Sign In with Google</span>
          </button>
        </div>

        {/* Register Footer */}
        <p className="text-xs text-slate-400 text-center pt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-amber-400 hover:text-amber-300 font-bold hover:underline transition-colors">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
}
