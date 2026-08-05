import React from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard, MdShoppingBasket, MdPeople, MdLogout, MdInventory } from 'react-icons/md';
import AdminProductsPage from './admin/adminProductsPage';
import AdminAddProductForm from './admin/adminAddProductForm';
import AdminEditProductForm from './admin/adminEditProductForm';
import AdminOrdersPage from "./admin/adminOrdersPage";
import api from '../utils/api';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function AdminPage() {
    const location = useLocation();
    const [user, setUser] = useState(null);
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
            element: (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold mb-4 text-gray-900">User Accounts</h3>
                        <div className="h-64 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-gray-400 gap-2">
                            <MdPeople size={48} className="opacity-20" />
                            <p>User administration and role management.</p>
                        </div>
                    </div>
                </div>
            )
        },
    ];

    const getCurrentPageName = () => {
        const currentPath = location.pathname.replace(/\/$/, '');
        const item = navItems.find(item => item.path.replace(/\/$/, '') === currentPath);
        return item ? item.name : 'Admin Dashboard';
    };

    return (
        <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-72 h-full bg-white border-r border-gray-200 flex flex-col shadow-sm z-20">
                <div className="p-8 border-b border-gray-100">
                    <h1 className="text-2xl font-bold text-amber-600 tracking-tight flex items-center gap-2">
                        <MdDashboard className="text-amber-500" />
                        <span>Admin</span>
                    </h1>
                </div>

                <nav className="flex-1 p-6 flex flex-col gap-2 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname.replace(/\/$/, '') === item.path.replace(/\/$/, '');
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-200'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-gray-100">
                    <button
                        onClick={() => {
                            localStorage.removeItem("token");
                            toast.success("Logged out successfully");
                            navigate("/login");
                        }}
                        className="w-full flex items-center gap-4 p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                        <MdLogout size={22} className="group-hover:translate-x-1 transition-transform" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-10 shadow-sm z-10">
                    <h2 className="text-xl font-bold text-gray-800 truncate">
                        {getCurrentPageName()}
                    </h2>
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-sm font-bold text-gray-900">
                                {user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Administrator" : "Administrator"}
                            </span>
                            <span className="text-xs text-gray-500">{user?.email || "Super Admin"}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md border-2 border-white">
                            {user?.firstName ? `${user.firstName[0]}${user.lastName ? user.lastName[0] : ''}` : "AD"}
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-10 bg-gray-50/50">
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
