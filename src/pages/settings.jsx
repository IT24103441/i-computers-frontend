import { useEffect, useState } from "react";
import api from "../utils/api";
import uploadMedia from "../utils/mediaUpload";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen";

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
                    setFirstName(res.data.firstName);
                    setLastName(res.data.lastName);
                })
                .catch((err) => {
                    console.log(err);
                    setUser(null);
                });
        } else {
            window.location.href = "/login";
        }
    }, []);

    async function handleUpdateProfile() {
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

    async function handleChangePassword() {
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
        } catch (err) {
            console.error("Password change error:", err);
            toast.error(err?.response?.data?.message || err?.message || "Failed to change password");
            setLoading(false);
        }
    }

    return (
        <div className="w-full h-full overflow-y-auto p-4 pb-20 flex flex-col lg:flex-row justify-center items-center gap-6">
            <div className="w-full max-w-[420px] p-6 bg-white shadow-xl rounded-2xl border border-gray-100 flex flex-col">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Profile Information</h1>
                
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-amber-50 border-2 border-amber-500 flex items-center justify-center flex-shrink-0">
                        {image ? (
                            <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover" />
                        ) : user?.image ? (
                            <img src={user.image} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-amber-600 font-bold text-xl">
                                {user?.firstName ? user.firstName.charAt(0).toUpperCase() : "U"}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-700">{user?.firstName} {user?.lastName}</span>
                        <span className="text-xs text-gray-400">{user?.email}</span>
                    </div>
                </div>

                <label className="text-xs font-semibold text-gray-600 mb-1">First Name</label>
                <input
                    type="text"
                    className="w-full h-11 border border-gray-200 rounded-xl px-3 mb-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={firstName}
                    onChange={(e) => {
                        setFirstName(e.target.value);
                    }}
                />
                <label className="text-xs font-semibold text-gray-600 mb-1">Last Name</label>
                <input
                    type="text"
                    className="w-full h-11 border border-gray-200 rounded-xl px-3 mb-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={lastName}
                    onChange={(e) => {
                        setLastName(e.target.value);
                    }}
                />
                <label className="text-xs font-semibold text-gray-600 mb-1">Profile Image</label>
                <input
                    type="file"
                    accept="image/*"
                    className="w-full h-11 border border-gray-200 rounded-xl px-3 py-2 text-sm mb-4 text-gray-500 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                    onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                            setImage(e.target.files[0]);
                        }
                    }}
                />
                <button
                    className="w-full h-11 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-md active:scale-[0.98]"
                    onClick={handleUpdateProfile}
                >
                    Update Profile
                </button>
            </div>

            <div className="w-[400px] p-4 h-[400px] bg-white shadow-2xl rounded-lg">
                <h1 className="text-2xl font-semibold mb-4">Change Password</h1>
                <label className="text-sm font-medium">New Password</label>
                <input
                    type="password"
                    className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                <label className="text-sm font-medium">Confirm New Password</label>
                <input
                    type="password"
                    className="w-full h-[40px] border border-gray-300 rounded-md px-2 mb-4"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                />
                <button
                    className="w-full h-[40px] bg-accent/80 text-white rounded-md hover:bg-accent"
                    onClick={handleChangePassword}
                >
                    Change Password
                </button>
            </div>
            {
                loading && <LoadingScreen />
            }
        </div>
    );
}