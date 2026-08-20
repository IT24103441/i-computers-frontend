import { useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen";
import { Link, useNavigate } from "react-router-dom";
import { BiEnvelope, BiKey, BiShieldQuarter } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  function sendOTP() {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    setLoading(true);
    api
      .post("/users/otp", { email: email })
      .then((res) => {
        console.log(res);
        setLoading(false);
        toast.success("OTP sent to your email");
        setOtpSent(true);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message || "Failed to send OTP");
        setLoading(false);
      });
  }

  function verifyOTP() {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("Please fill in all OTP and password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    api
      .post("/users/verify-otp", {
        email: email,
        otp: otp,
        password: newPassword,
      })
      .then(() => {
        toast.success("Password changed successfully");
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message || "OTP verification failed");
        setLoading(false);
      });
  }

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background glow accents matching home page */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {loading && <LoadingScreen />}

      <div className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/80 shadow-2xl space-y-6">
        {otpSent ? (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-1">
                <HiSparkles size={15} /> Security Verification
              </div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 tracking-tight">
                Reset Password
              </h1>
              <p className="text-xs text-slate-300">
                Enter the OTP sent to your email along with your new password.
              </p>
            </div>

            {/* Inputs */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BiEnvelope className="text-amber-400" size={16} /> Email Address
                </label>
                <input
                  value={email}
                  disabled={true}
                  type="email"
                  className="w-full bg-slate-800/50 border border-slate-700 text-slate-400 rounded-xl px-4 py-3 text-sm cursor-not-allowed"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BiShieldQuarter className="text-amber-400" size={16} /> One-Time OTP Code
                </label>
                <input
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  type="text"
                  placeholder="Enter OTP code"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BiKey className="text-amber-400" size={16} /> New Password
                </label>
                <input
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BiKey className="text-amber-400" size={16} /> Confirm New Password
                </label>
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  type="password"
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              disabled={loading}
              onClick={verifyOTP}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 text-sm disabled:cursor-not-allowed"
            >
              Submit & Reset Password
            </button>

            <p className="text-xs text-slate-400 text-center pt-2">
              Remembered your password?{" "}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold hover:underline transition-colors">
                Back to Login
              </Link>
            </p>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-1">
                <HiSparkles size={15} /> Password Recovery
              </div>
              <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 tracking-tight">
                Forgot Password?
              </h1>
              <p className="text-xs text-slate-300">
                Enter your registered email address below to receive a password reset OTP code.
              </p>
            </div>

            {/* Input */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <BiEnvelope className="text-amber-400" size={16} /> Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="w-full bg-slate-800/80 border border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm outline-none transition-all"
              />
            </div>

            {/* Action button */}
            <button
              disabled={loading}
              onClick={sendOTP}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-500/50 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 text-sm disabled:cursor-not-allowed"
            >
              Send Reset OTP
            </button>

            <p className="text-xs text-slate-400 text-center pt-2">
              Remember your password?{" "}
              <Link to="/login" className="text-amber-400 hover:text-amber-300 font-bold hover:underline transition-colors">
                Back to Login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}