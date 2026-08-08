import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';
import { useGoogleLogin } from '@react-oauth/google';
import { BsGoogle } from 'react-icons/bs';
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
    <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-no-repeat bg-center bg-cover flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-white text-center">Login</h1>
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Email"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <div className="text-right mt-2">
              <Link to="/forget-password" className="text-sm text-white/80 hover:text-white font-medium hover:underline transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>
        </div>
        <button disabled={loading} onClick={handleLogin} className="w-full py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-colors shadow-lg flex items-center justify-center">
          {
            loading ? "Loading..." : "Login"
          }
        </button>
        <button
          disabled={loading}
          onClick={() => googleLogin()}
          className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg flex justify-center items-center gap-2 border border-white/20 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <BsGoogle />
          <span>Sign In with Google</span>
        </button>

        <p className="text-white/80 text-center">
          Don't have an account? <Link to="/register" className="text-white font-bold hover:underline">Register</Link>
        </p>

      </div>
    </div>
  );
}
