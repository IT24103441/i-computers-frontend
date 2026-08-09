import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { CiLogin } from "react-icons/ci";
import { BiUser, BiLogOut, BiShoppingBag, BiCog } from "react-icons/bi";

export default function UserData() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token != null) {
            api.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
                setUser(null);
            });
        }
    }, []);

    const handleSelectChange = (e) => {
        const value = e.target.value;
        if (value === "settings") navigate("/settings");
        if (value === "my-orders") navigate("/my-orders");
        if (value === "admin" && user?.isAdmin) navigate("/admin");
        if (value === "logout") {
            localStorage.removeItem("token");
            setUser(null);
            navigate("/");
        }
    };

    if (user == null) {
        return (
            <div className="flex items-center gap-3">
                <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-semibold text-white hover:text-amber-400 transition-colors hidden lg:block"
                >
                    Login
                </Link>
                <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md hidden lg:block"
                >
                    Register
                </Link>

                {/* Mobile Login Button */}
                <Link
                    to="/login"
                    className="lg:hidden flex flex-col justify-center items-center text-amber-500 text-2xl"
                >
                    <CiLogin />
                    <span className="text-[11px] font-semibold text-amber-500">Login</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2 text-white">
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-sm">
                <img
                    src={user.image || "/default-profile.png"}
                    alt={user.firstName}
                    className="w-7 h-7 rounded-full object-cover border border-amber-500/50 bg-slate-700"
                    onError={(e) => {
                        e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.firstName || "User");
                    }}
                />
                
                <select
                    onChange={handleSelectChange}
                    defaultValue="default"
                    className="bg-transparent text-xs font-bold text-amber-400 focus:outline-none cursor-pointer pr-1"
                >
                    <option value="default" disabled hidden>
                        {user.firstName}
                    </option>
                    <option value="my-orders" className="bg-slate-900 text-white font-medium">
                        📦 My Orders
                    </option>
                    <option value="settings" className="bg-slate-900 text-white font-medium">
                        ⚙️ Settings
                    </option>
                    {user.isAdmin && (
                        <option value="admin" className="bg-slate-900 text-amber-400 font-bold">
                            👑 Admin Panel
                        </option>
                    )}
                    <option value="logout" className="bg-slate-900 text-red-400 font-medium">
                        🚪 Logout
                    </option>
                </select>
            </div>
        </div>
    );
}