import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import toast from "react-hot-toast";
import { CiLogin } from "react-icons/ci";
import {
  BiUser,
  BiLogOut,
  BiShoppingBag,
  BiCog,
  BiHomeAlt,
  BiChevronDown,
  BiCrown,
} from "react-icons/bi";

export default function UserData() {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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
        })
        .catch((err) => {
          console.log(err);
          setUser(null);
        });
    }
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsOpen(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleNavigate = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  if (user == null) {
    return (
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="px-4 py-2 text-xs font-semibold text-gray-300 hover:text-amber-400 transition-colors hidden lg:block"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="px-4.5 py-2 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition-all shadow-md shadow-amber-500/20 hidden lg:block"
        >
          Register
        </Link>

        {/* Mobile Login Button */}
        <Link
          to="/login"
          className="lg:hidden flex flex-col justify-center items-center text-amber-400 text-2xl"
        >
          <CiLogin />
          <span className="text-[11px] font-semibold text-amber-400">Login</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Badge Button Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-sm transition-all text-white focus:outline-none focus:ring-2 focus:ring-amber-500/30 group"
      >
        <img
          src={user.image || "/default-profile.png"}
          alt={user.firstName}
          className="w-7 h-7 rounded-full object-cover border border-amber-500/60 bg-slate-700 group-hover:scale-105 transition-transform"
          onError={(e) => {
            e.target.src =
              "https://ui-avatars.com/api/?name=" +
              encodeURIComponent(user.firstName || "User");
          }}
        />

        <span className="text-xs font-bold text-slate-200 group-hover:text-amber-400 transition-colors max-w-[90px] truncate">
          {user.firstName}
        </span>

        <BiChevronDown
          size={16}
          className={`text-slate-400 group-hover:text-amber-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-amber-400" : ""
          }`}
        />
      </button>

      {/* Glassmorphic Custom Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2.5 w-60 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-50 p-2 text-white animate-fade-in space-y-1">
          {/* Header Profile Summary */}
          <div className="px-3.5 py-3 bg-slate-800/60 rounded-xl border border-slate-700/50 mb-1 flex items-center gap-3">
            <img
              src={user.image || "/default-profile.png"}
              alt={user.firstName}
              className="w-9 h-9 rounded-full object-cover border border-amber-500/60 bg-slate-700"
              onError={(e) => {
                e.target.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(user.firstName || "User");
              }}
            />
            <div className="truncate pr-1">
              <p className="text-xs font-bold text-white truncate">
                {user.firstName} {user.lastName || ""}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
              {user.isAdmin ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 mt-1">
                  <BiCrown size={11} /> Admin
                </span>
              ) : (
                <span className="inline-block text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30 mt-1">
                  Customer
                </span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <button
            onClick={() => handleNavigate("/")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-colors text-left"
          >
            <BiHomeAlt size={17} className="text-amber-400" />
            <span>Home Page</span>
          </button>

          <button
            onClick={() => handleNavigate("/my-orders")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-colors text-left"
          >
            <BiShoppingBag size={17} className="text-amber-400" />
            <span>My Orders</span>
          </button>

          <button
            onClick={() => handleNavigate("/settings")}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-amber-400 transition-colors text-left"
          >
            <BiCog size={17} className="text-amber-400" />
            <span>Settings</span>
          </button>

          {user.isAdmin && (
            <button
              onClick={() => handleNavigate("/admin")}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-colors text-left"
            >
              <BiCrown size={17} />
              <span>Admin Panel</span>
            </button>
          )}

          <div className="my-1 border-t border-slate-800" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors text-left"
          >
            <BiLogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}