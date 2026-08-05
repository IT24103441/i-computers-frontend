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
      onSuccess: (response) => {
        setLoading(true);
        api.post("/users/google-login", {
          accessToken: response.access_token
        }).then((res) => {
          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            toast.success(res.data.message || "Login successful");
            if (res.data.isAdmin) {
              navigate("/admin");
            } else {
              navigate("/");
            }
          } else {
            toast.error(res.data.message || "Google login failed");
          }
        }).catch((err) => {
          console.error(err);
          toast.error(err?.response?.data?.message || "Google login failed");
        }).finally(() => {
          setLoading(false);
        });
      },
      onError: (err) => {
        console.error(err);
        toast.error("Google Sign-In was cancelled or failed");
      }
    }
  )
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
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
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
