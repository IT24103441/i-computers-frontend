import { useState } from "react";
import toast from "react-hot-toast";
import { BiKey, BiUser, BiEnvelope } from "react-icons/bi";
import { BsGoogle } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useGoogleLogin } from "@react-oauth/google";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      console.log(response);

      api
        .post("/users/google-login", {
          accessToken: response.access_token,
        })
        .then((res) => {
          console.log(res);
          localStorage.setItem("token", res.data.token);
          if (res.data.isAdmin) {
            navigate("/admin");
          } else {
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  async function handleRegister() {
    if (!email || !firstName || !lastName || !password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/", {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
      });

      toast.success("Account registered successfully! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background glow accents matching home page */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg bg-slate-900/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        {/* Brand Header & Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-1">
            <HiSparkles size={15} /> Join Us Today
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 tracking-tight">
            Create Account
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Sign up to unlock personalized shopping, track orders, and grab exclusive rewards.
          </p>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <BiEnvelope className="text-amber-400" size={16} /> Email Address
            </label>
            <input
              className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* First & Last Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BiUser className="text-amber-400" size={16} /> First Name
              </label>
              <input
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                type="text"
                placeholder="John"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BiUser className="text-amber-400" size={16} /> Last Name
              </label>
              <input
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                type="text"
                placeholder="Doe"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BiKey className="text-amber-400" size={16} /> Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                value={password}
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                placeholder="••••••••••••"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BiKey className="text-amber-400" size={16} /> Confirm Password
              </label>
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                value={confirmPassword}
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 text-sm disabled:cursor-not-allowed"
            onClick={handleRegister}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              "Register Now"
            )}
          </button>

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-slate-700/80 w-full" />
            <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest absolute">Or</span>
          </div>

          <button
            disabled={loading}
            onClick={googleLogin}
            className="w-full py-3.5 bg-slate-800/90 hover:bg-slate-700 text-white font-semibold rounded-xl flex justify-center items-center gap-2.5 border border-slate-700 transition-all shadow-md text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BsGoogle className="text-red-400" size={16} />
            <span>Sign In with Google</span>
          </button>
        </div>

        {/* Login Footer */}
        <p className="text-xs text-slate-400 text-center pt-2">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold hover:underline transition-colors">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
