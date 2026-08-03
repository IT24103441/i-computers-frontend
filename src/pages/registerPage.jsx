import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

export default function RegisterPage() {
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const navigate = useNavigate()

  async function handleRegister() {
    if (!firstName || !lastName || !email || !password) {
      toast.error("Please fill in all fields")
      return
    }
    setLoading(true)
    try {
      await api.post('/users/register', {
        firstName,
        lastName,
        email,
        password
      })
      toast.success("Registration successful! Please login.")
      navigate('/login')
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed")
    }
    setLoading(false)
  }

  return (
    <div className="w-full min-h-screen bg-[url('/login-bg.jpg')] bg-no-repeat bg-center bg-cover flex items-center justify-center p-4">
      <div className="w-full max-w-md p-6 sm:p-8 backdrop-blur-xl bg-white/20 border border-white/30 rounded-2xl shadow-2xl flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-white text-center">Register</h1>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full sm:w-1/2 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              onChange={(e) => setFirstName(e.target.value)}
              value={firstName}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full sm:w-1/2 p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
              onChange={(e) => setLastName(e.target.value)}
              value={lastName}
            />
          </div>
          <input
            type="email"
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
        <button 
          disabled={loading} 
          onClick={handleRegister} 
          className="w-full py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 transition-colors shadow-lg flex items-center justify-center"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="text-white/80 text-center">
          Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}