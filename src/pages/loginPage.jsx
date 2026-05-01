import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  async function handleLogin() {
    try {
      await axios.post('http://localhost:3000/users/login', {
        email: email,
        password: password
      })
      toast.success('Login successful')
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }

  }

  return (
    <div className="w-full h-full bg-[url('/login-bg.jpg')] bg-no-repeat bg-center bg-cover flex items-center justify-center">
      <div className="w-[400px] p-8 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl flex flex-col gap-6">
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
        <button onClick={handleLogin} className="w-full py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-colors shadow-lg">
          Login
        </button>
        <p className="text-white/80 text-center">
          Don't have an account? <Link to="/register" className="text-white font-bold hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
