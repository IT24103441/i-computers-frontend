import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdShoppingBasket, MdPeople, MdLogout, MdInventory, MdRateReview, MdEmail } from 'react-icons/md';
import { BiMenu, BiX, BiSun, BiMoon } from 'react-icons/bi';
import AdminProductsPage from './admin/adminProductsPage';
import AdminAddProductForm from './admin/adminAddProductForm';
import AdminEditProductForm from './admin/adminEditProductForm';
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminReviewsPage from "./admin/adminReviewsPage";
import AdminContactsPage from "./admin/adminContactsPage";
import AdminUsersPage from "./admin/adminUsersPage";
import AdminProfileModal from '../components/adminProfileModal';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminPage() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Theme state (Dark Mode / Light Mode)
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem("adminTheme");
        return savedTheme === "dark";
    });

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token != null) {
            api.get("/users/me", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }).then((res) => {
                if (res.data.isAdmin) {
                    setUser(res.data);
                } else {
                    toast.error("You are not authorized to access this page");
                    navigate("/");
                }
            }).catch((err) => {
                console.log(err);
                setUser(null);
            });
        } else {
            toast.error("You are not authorized to access this page");
            navigate("/login");
        }
    }, [navigate]);

    const toggleTheme = () => {
        const nextMode = !isDarkMode;
        setIsDarkMode(nextMode);
        localStorage.setItem("adminTheme", nextMode ? "dark" : "light");
        toast.success(`Switched to ${nextMode ? 'Dark' : 'Light'} Mode`);
    };

    const navItems = [
        {
            path: '/admin',
            name: 'Orders',
            icon: <MdShoppingBasket size={22} />,
            element: <AdminOrdersPage isDarkMode={isDarkMode} />
        },
        {
            path: '/admin/products',
            name: 'Products',
            icon: <MdInventory size={22} />,
            element: <AdminProductsPage isDarkMode={isDarkMode} />
        },
        {
            path: '/admin/users',
            name: 'Users',
            icon: <MdPeople size={22} />,
            element: <AdminUsersPage isDarkMode={isDarkMode} />
        },
        {
            path: '/admin/reviews',
            name: 'Reviews',
            icon: <MdRateReview size={22} />,
            element: <AdminReviewsPage isDarkMode={isDarkMode} />
        },
        {
            path: '/admin/messages',
            name: 'Messages',
            icon: <MdEmail size={22} />,
            element: <AdminContactsPage isDarkMode={isDarkMode} />
        },
    ];

    const getCurrentPageName = () => {
        const currentPath = location.pathname.replace(/\/$/, '');
        const item = navItems.find(item => item.path.replace(/\/$/, '') === currentPath);
        return item ? item.name : 'Admin Dashboard';
    };

    return (
        <div className={`w-full h-screen flex overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-gray-50 text-slate-800'
            }`}>

            {/* Mobile Sidebar Overlay Backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-30 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 w-72 h-full border-r flex flex-col shadow-xl lg:shadow-sm z-40 transform transition-all duration-300 ${isDarkMode
                    ? 'bg-slate-900 border-slate-800 text-slate-200'
                    : 'bg-white border-gray-200 text-gray-800'
                    } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                    <h1 className="text-2xl font-bold text-amber-500 tracking-tight flex items-center gap-2">
                        <MdDashboard className="text-amber-500" />
                        <span>Admin</span>
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className={`lg:hidden p-1 rounded-lg ${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        <BiX size={24} />
                    </button>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname.replace(/\/$/, '') === item.path.replace(/\/$/, '');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3.5 p-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                    ? 'bg-amber-600 text-white shadow-md shadow-amber-500/20 font-bold'
                                    : isDarkMode
                                        ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className={`p-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            toast.success("Logged out successfully");
                            navigate("/login");
                        }}
                        className={`w-full flex items-center gap-3 p-3.5 text-red-500 font-semibold text-sm rounded-xl transition-all duration-200 group ${isDarkMode ? 'hover:bg-red-500/10 text-red-400' : 'hover:bg-red-50 text-red-500'
                            }`}
                    >
                        <MdLogout size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header Bar */}
                <header className={`h-16 sm:h-20 border-b flex items-center justify-between px-4 sm:px-8 lg:px-10 shadow-sm z-10 flex-shrink-0 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-gray-800'
                    }`}>
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Hamburger Button for Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className={`lg:hidden p-2 rounded-xl transition-colors ${isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            title="Open Navigation Menu"
                        >
                            <BiMenu size={24} />
                        </button>
                        <h2 className={`text-lg sm:text-xl font-bold truncate ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>
                            {getCurrentPageName()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                        {/* Dark Mode / Light Mode Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${isDarkMode
                                ? 'bg-slate-800 text-amber-400 border-slate-700 hover:bg-slate-700 hover:text-amber-300 shadow-sm'
                                : 'bg-gray-100 text-slate-700 border-gray-200 hover:bg-gray-200 hover:text-amber-600 shadow-sm'
                                }`}
                            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                        >
                            {isDarkMode ? <BiSun size={20} /> : <BiMoon size={20} />}
                        </button>

                        {/* Top-Right Profile Clickable Badge */}
                        <div
                            onClick={() => setIsProfileModalOpen(true)}
                            className={`flex items-center gap-3 cursor-pointer p-1.5 sm:p-2 rounded-2xl transition-all group ${isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-gray-100'
                                }`}
                            title="Click to edit Admin Profile & Password"
                        >
                            <div className="hidden sm:flex flex-col items-end">
                                <span className={`text-xs sm:text-sm font-bold group-hover:text-amber-500 transition-colors ${isDarkMode ? 'text-slate-100' : 'text-gray-900'
                                    }`}>
                                    {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Administrator" : "Administrator"}
                                </span>
                                <span className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{user?.email || "Super Admin"}</span>
                            </div>
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md border-2 border-white group-hover:scale-105 transition-transform flex-shrink-0">
                                {user?.image ? (
                                    <img src={user.image} alt="Admin Avatar" className="w-full h-full object-cover" />
                                ) : user?.firstName ? (
                                    `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}`
                                ) : (
                                    "AD"
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Sub-Pages Content Container */}
                <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50/50 text-gray-800'
                    }`}>
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            {navItems.map((item) => (
                                <Route
                                    key={item.path}
                                    path={item.path === '/admin' ? '/' : item.path.replace('/admin', '')}
                                    element={item.element}
                                />
                            ))}
                            <Route path="/products/add" element={<AdminAddProductForm isDarkMode={isDarkMode} />} />
                            <Route path="/products/edit/:productId" element={<AdminEditProductForm isDarkMode={isDarkMode} />} />
                        </Routes>
                    </div>
                </main>
            </div>

            {/* Admin Profile & Password Modal */}
            <AdminProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
                user={user}
                onProfileUpdated={(updatedUser) => setUser(updatedUser)}
                isDarkMode={isDarkMode}
            />
        </div>
    );
}
