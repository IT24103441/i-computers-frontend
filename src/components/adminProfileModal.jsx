import React, { useState, useEffect } from "react";
import api from "../utils/api";
import uploadMedia from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { BiX, BiUser, BiCamera, BiKey, BiCheck, BiShieldQuarter } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";

export default function AdminProfileModal({ isOpen, onClose, user, onProfileUpdated, isDarkMode }) {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'security'
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPreviewUrl(user.image || "");
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = user?.image || "";
    if (imageFile != null) {
      try {
        imageUrl = await uploadMedia(imageFile);
      } catch (imgErr) {
        console.error("Image upload error:", imgErr);
        toast.error(
          "Image upload failed: " +
            (imgErr?.message || (typeof imgErr === "string" ? imgErr : "Storage error"))
        );
        setLoading(false);
        return;
      }
    }

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = {
        firstName: firstName,
        lastName: lastName,
        image: imageUrl,
      };

      const userId = user?._id || user?.id || user?.userId || user?.email;
      const attempts = [
        () => api.put("/users", payload, config),
        () => api.put("/users/me", payload, config),
        () => api.patch("/users", payload, config),
        () => api.patch("/users/me", payload, config),
        () => api.put("/users/profile", payload, config),
        () => api.patch("/users/profile", payload, config),
        () => api.post("/users/profile", payload, config),
        () => api.post("/users/update", payload, config),
        ...(userId
          ? [
              () => api.put(`/users/${userId}`, payload, config),
              () => api.patch(`/users/${userId}`, payload, config),
            ]
          : []),
      ];

      let lastErr = null;
      let successRes = null;

      for (const attempt of attempts) {
        try {
          const res = await attempt();
          successRes = res;
          break;
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

      const updatedUser = {
        ...user,
        firstName,
        lastName,
        image: imageUrl,
      };

      if (onProfileUpdated) {
        onProfileUpdated(updatedUser);
      }

      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const payload = { password: password };

      try {
        await api.post("/users/password", payload, config);
      } catch (err1) {
        if (err1?.response?.status === 404 || err1?.response?.status === 405) {
          try {
            await api.put("/users/password", payload, config);
          } catch (err2) {
            if (err2?.response?.status === 404 || err2?.response?.status === 405) {
              await api.post("/users/change-password", payload, config);
            } else {
              throw err2;
            }
          }
        } else {
          throw err1;
        }
      }

      toast.success("Password changed successfully!");
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      console.error("Password change error:", err);
      toast.error(
        err?.response?.data?.message || err?.message || "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className={`relative w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh] transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-100 text-slate-800'
      }`}>
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="p-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl">
              <HiSparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold tracking-tight text-white">Admin Profile Settings</h3>
              <p className="text-xs text-gray-300">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="relative z-10 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <BiX size={22} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={`flex border-b px-6 pt-3 gap-2 ${isDarkMode ? 'border-slate-800 bg-slate-900/90' : 'border-gray-200 bg-gray-50/80'}`}>
          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "profile"
                ? "border-amber-500 text-amber-500"
                : isDarkMode ? "border-transparent text-slate-400 hover:text-slate-200" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <BiUser size={18} /> Profile & Photo
          </button>
          <button
            onClick={() => setActiveTab("security")}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === "security"
                ? "border-amber-500 text-amber-500"
                : isDarkMode ? "border-transparent text-slate-400 hover:text-slate-200" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            <BiShieldQuarter size={18} /> Password & Security
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "profile" && (
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              {/* Photo Upload */}
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="relative group w-24 h-24 rounded-full overflow-hidden border-4 border-amber-500/20 shadow-lg bg-slate-800 flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Admin Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-amber-500">
                      {firstName ? firstName[0].toUpperCase() : "A"}
                    </span>
                  )}
                  <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer text-xs font-semibold gap-1">
                    <BiCamera size={22} />
                    <span>Change</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <p className={`text-[11px] text-center ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                  Click on the avatar to upload a new profile image.
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none transition-all ${
                      isDarkMode
                        ? 'bg-slate-800 border-slate-700 text-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                        : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                    }`}
                  />
                </div>
              </div>

              {/* Email Display (Read-Only) */}
              <div className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                  Email Address (Read-Only)
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium cursor-not-allowed ${
                    isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-gray-100 border-gray-200 text-gray-500'
                  }`}
                />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Saving Changes...
                  </span>
                ) : (
                  <>
                    <BiCheck size={18} /> Save Profile Changes
                  </>
                )}
              </button>
            </form>
          )}

          {activeTab === "security" && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className={`p-3.5 border rounded-xl text-xs flex items-start gap-2.5 ${
                isDarkMode ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}>
                <BiKey size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <span>
                  Update your admin account password. Make sure your new password is at least 6 characters long and stored securely.
                </span>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full px-3.5 py-2.5 border rounded-xl text-sm font-medium outline-none transition-all ${
                    isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                      : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                  }`}
                />
              </div>

              {/* Password Save Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-slate-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    Updating Password...
                  </span>
                ) : (
                  <>
                    <BiCheck size={18} /> Update Password
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
