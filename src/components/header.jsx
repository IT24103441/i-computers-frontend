import { Link, useLocation } from "react-router-dom";
import { BiCart, BiStore } from "react-icons/bi";
import UserData from "./userData";
import NotificationBell from "./notificationBell";
import { IoCartOutline, IoCubeOutline, IoHomeOutline, IoCallOutline } from "react-icons/io5";

export default function Header() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Desktop & Main Header */}
            <header className="sticky top-0 z-50 w-full h-20 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg flex items-center justify-between px-6 lg:px-12 transition-all">

                {/* Brand Logo */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-12 h-12 rounded-xl bg-amber-500 flex justify-center items-center text-slate-950 font-extrabold text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                        C
                    </div>
                    <span className="text-xl lg:text-2xl font-black tracking-tight text-white">
                        I-<span className="text-amber-500">computers</span>
                    </span>
                </Link>

                {/* Desktop Nav Items */}
                <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
                    <Link
                        to="/"
                        className={`transition-colors py-1 border-b-2 ${isActive("/")
                            ? "text-amber-400 border-amber-500"
                            : "text-gray-300 border-transparent hover:text-white"
                            }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/products"
                        className={`transition-colors py-1 border-b-2 ${isActive("/products")
                            ? "text-amber-400 border-amber-500"
                            : "text-gray-300 border-transparent hover:text-white"
                            }`}
                    >
                        Products
                    </Link>
                    <Link
                        to="/contact-us"
                        className={`transition-colors py-1 border-b-2 ${isActive("/contact-us")
                            ? "text-amber-400 border-amber-500"
                            : "text-gray-300 border-transparent hover:text-white"
                            }`}
                    >
                        Contact Us
                    </Link>
                </nav>

                {/* Right Action Icons & User Data */}
                <div className="hidden lg:flex items-center gap-3">
                    <NotificationBell />

                    <Link
                        to="/cart"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 hover:text-amber-400 border border-slate-700/80 transition-all flex items-center justify-center relative shadow-sm"
                        title="View Cart"
                    >
                        <BiCart size={22} />
                    </Link>

                    <UserData />
                </div>
            </header>

            {/* Mobile Floating Bottom Bar */}
            <div className="fixed bottom-0 left-0 w-full h-20 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl flex lg:hidden justify-around items-center z-50 px-2">
                <Link
                    to="/"
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive("/") ? "text-amber-400 font-bold" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <IoHomeOutline className="text-2xl" />
                    <span className="text-[11px]">Home</span>
                </Link>

                <Link
                    to="/products"
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive("/products") ? "text-amber-400 font-bold" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <IoCubeOutline className="text-2xl" />
                    <span className="text-[11px]">Products</span>
                </Link>

                <Link
                    to="/cart"
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive("/cart") ? "text-amber-400 font-bold" : "text-gray-400 hover:text-white"
                        }`}
                >
                    <IoCartOutline className="text-2xl" />
                    <span className="text-[11px]">Cart</span>
                </Link>

                <NotificationBell />

                <UserData />
            </div>
        </>
    );
}