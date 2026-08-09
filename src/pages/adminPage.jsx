import React, { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdShoppingBasket, MdPeople, MdLogout, MdInventory, MdRateReview, MdEmail } from 'react-icons/md';
import { BiMenu, BiX } from 'react-icons/bi';
import AdminProductsPage from './admin/adminProductsPage';
import AdminAddProductForm from './admin/adminAddProductForm';
import AdminEditProductForm from './admin/adminEditProductForm';
import AdminOrdersPage from "./admin/adminOrdersPage";
import AdminReviewsPage from "./admin/adminReviewsPage";
import AdminContactsPage from "./admin/adminContactsPage";
import AdminUsersPage from "./admin/adminUsersPage";
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function AdminPage() {
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

    const navItems = [
        {
            path: '/admin',
            name: 'Orders',
            icon: <MdShoppingBasket size={22} />,
            element: <AdminOrdersPage />
        },
        {
            path: '/admin/products',
            name: 'Products',
            icon: <MdInventory size={22} />,
            element: <AdminProductsPage />
        },
        {
            path: '/admin/users',
            name: 'Users',
            icon: <MdPeople size={22} />,
            element: <AdminUsersPage />
        },
        {
            path: '/admin/reviews',
            name: 'Reviews',
            icon: <MdRateReview size={22} />,
            element: <AdminReviewsPage />
        },
        {
            path: '/admin/messages',
            name: 'Messages',
            icon: <MdEmail size={22} />,
            element: <AdminContactsPage />
        },
    ];

    const getCurrentPageName = () => {
        const currentPath = location.pathname.replace(/\/$/, '');
        const item = navItems.find(item => item.path.replace(/\/$/, '') === currentPath);
        return item ? item.name : 'Admin Dashboard';
    };

    return (
        <div className="w-full h-screen flex bg-gray-50 overflow-hidden relative">
            
            {/* Mobile Sidebar Overlay Backdrop */}
            {isSidebarOpen && (
                <div
                    onClick={() => setIsSidebarOpen(false)}
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-30 lg:hidden"
                />
            )}

            {/* Sidebar (Responsive Drawer on Mobile, Fixed Sidebar on Desktop) */}
            <aside
                className={`fixed lg:static inset-y-0 left-0 w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-xl lg:shadow-sm z-40 transform transition-transform duration-300 ${
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-amber-600 tracking-tight flex items-center gap-2">
                        <MdDashboard className="text-amber-500" />
                        <span>Admin</span>
                    </h1>
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-lg"
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
                                className={`flex items-center gap-3.5 p-3.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                                    isActive
                                        ? 'bg-amber-600 text-white shadow-md shadow-amber-200 font-bold'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            toast.success("Logged out successfully");
                            navigate("/login");
                        }}
                        className="w-full flex items-center gap-3 p-3.5 text-red-500 hover:bg-red-50 text-sm font-semibold rounded-xl transition-all duration-200 group"
                    >
                        <MdLogout size={20} className="group-hover:translate-x-1 transition-transform" />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                {/* Header Bar */}
                <header className="h-16 sm:h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-8 lg:px-10 shadow-sm z-10 flex-shrink-0">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Hamburger Button for Mobile */}
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            title="Open Navigation Menu"
                        >
                            <BiMenu size={24} />
                        </button>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                            {getCurrentPageName()}
                        </h2>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs sm:text-sm font-bold text-gray-900">
                                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Administrator" : "Administrator"}
                            </span>
                            <span className="text-[11px] text-gray-500">{user?.email || "Super Admin"}</span>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-md border-2 border-white">
                            {user?.firstName ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}` : "AD"}
                        </div>
                    </div>
                </header>

                {/* Sub-Pages Content Container */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10 bg-gray-50/50">
                    <div className="max-w-7xl mx-auto">
                        <Routes>
                            {navItems.map((item) => (
                                <Route
                                    key={item.path}
                                    path={item.path === '/admin' ? '/' : item.path.replace('/admin', '')}
                                    element={item.element}
                                />
                            ))}
                            <Route path="/products/add" element={<AdminAddProductForm />} />
                            <Route path="/products/edit/:productId" element={<AdminEditProductForm />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </div>
    );
}
