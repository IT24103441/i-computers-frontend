import { useEffect, useState } from "react";
import api from "../utils/api";
import uploadMedia from "../utils/mediaUpload";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen";
import { BiUser, BiCamera, BiKey, BiEnvelope, BiCheck, BiShieldQuarter } from "react-icons/bi";
import { HiSparkles } from "react-icons/hi2";

export default function Settings() {
    const [user, setUser] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token != null) {
            api
                .get("/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUser(res.data);
                    setFirstName(res.data.firstName || "");
                    setLastName(res.data.lastName || "");
                })
                .catch((err) => {
                    console.log(err);
                    setUser(null);
                });
        } else {
            window.location.href = "/login";
        }
    }, []);

    async function handleUpdateProfile(e) {
        if (e) e.preventDefault();
        setLoading(true);

        let imageUrl = user?.image || "";
        if (image != null) {
            try {
                imageUrl = await uploadMedia(image);
            } catch (imgErr) {
                console.error("Image upload error:", imgErr);
                toast.error("Image upload failed: " + (imgErr?.message || (typeof imgErr === 'string' ? imgErr : "Storage error")));
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
                ...(userId ? [
                    () => api.put(`/users/${userId}`, payload, config),
                    () => api.patch(`/users/${userId}`, payload, config),
                ] : [])
            ];

            let lastErr = null;
            let success = false;

            for (const attempt of attempts) {
                try {
                    await attempt();
                    success = true;
                    break;
                } catch (err) {
                    lastErr = err;
                    if (err?.response?.status !== 404 && err?.response?.status !== 405) {
                        throw err;
                    }
                }
            }

            if (!success && lastErr) {
                throw lastErr;
            }

            setLoading(false);
            toast.success("Profile updated successfully");
            window.location.reload();
        } catch (err) {
            console.error("Profile update error:", err);
            toast.error(err?.response?.data?.message || err?.message || (typeof err === 'string' ? err : "Profile update failed"));
            setLoading(false);
        }
    }

    async function handleChangePassword(e) {
        if (e) e.preventDefault();
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

            setLoading(false);
            toast.success("Password changed successfully");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Password change error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to change password");
            setLoading(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-slate-50 text-slate-800 pb-16">
            {loading && <LoadingScreen />}

            {/* HERO BANNER - Matching Home Page Design */}
            <section className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white overflow-hidden py-12 px-6 shadow-md">
                {/* Subtle Background Glows */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto space-y-3 relative z-10 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                        <HiSparkles size={16} /> Personal Preference Center
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
                        Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">Settings</span>
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed">
                        Update your personal profile information, upload a profile avatar, and manage your account security credentials.
                    </p>
                </div>
            </section>

            {/* CONTENT GRID */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    
                    {/* CARD 1: PROFILE INFORMATION */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <BiUser className="text-amber-600" size={22} /> Profile Information
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Manage your name and avatar picture</p>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                Personal Info
                            </span>
                        </div>

                        {/* Avatar & User Details */}
                        <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="relative group w-20 h-20 rounded-full overflow-hidden bg-amber-100 border-2 border-amber-500 flex items-center justify-center flex-shrink-0 shadow-md">
                                {image ? (
                                    <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                                ) : user?.image ? (
                                    <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-amber-600 font-bold text-2xl">
                                        {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                                    </span>
                                )}
                                <label className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer">
                                    <BiCamera size={24} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setImage(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-base">
                                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : "Valued Member"}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">{user?.email || "No email linked"}</p>
                                <label className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer">
                                    <BiCamera size={14} /> Change Photo
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                setImage(e.target.files[0]);
                                            }
                                        }}
                                    />
                                </label>
                            </div>
                        </div>

                        {/* Input Fields */}
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">First Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none transition-all"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First Name"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Last Name</label>
                                    <input
                                        type="text"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none transition-all"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last Name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                    <BiEnvelope /> Email Address (Read-Only)
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    className="w-full bg-slate-100 border border-slate-200 text-slate-500 rounded-xl px-4 py-3 text-sm cursor-not-allowed"
                                    value={user?.email || ""}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-600/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50"
                            >
                                <BiCheck size={18} /> Update Profile
                            </button>
                        </form>
                    </div>

                    {/* CARD 2: CHANGE PASSWORD */}
                    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    <BiShieldQuarter className="text-amber-600" size={22} /> Security & Password
                                </h2>
                                <p className="text-xs text-slate-500 mt-1">Keep your account secure with a strong password</p>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                                Credentials
                            </span>
                        </div>

                        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
                            <BiKey size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                            <span>
                                Ensure your new password contains a mix of letters, numbers, and special symbols for maximum security.
                            </span>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none transition-all"
                                    value={password}
                                    placeholder="••••••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Confirm New Password</label>
                                <input
                                    type="password"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:bg-white focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 outline-none transition-all"
                                    value={confirmPassword}
                                    placeholder="••••••••••••"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl shadow-lg shadow-amber-600/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm mt-2 disabled:opacity-50"
                            >
                                <BiCheck size={18} /> Change Password
                            </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}