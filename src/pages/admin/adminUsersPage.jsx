import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import { BiRefresh, BiSearch } from "react-icons/bi";
import toast from "react-hot-toast";

export default function AdminUsersPage({ isDarkMode = false }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [activeFilter, setActiveFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (loading) {
            const token = localStorage.getItem("token");
            api
                .get("/users/all/" + pageNumber + "/" + pageSize, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setUsers(res.data.users || []);
                    setTotalUsers(res.data.totalUsers || 0);
                    setTotalPages(res.data.totalPages || 1);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Failed to load users:", err);
                    toast.error(err?.response?.data?.message || "Failed to load users");
                    setUsers([]);
                    setLoading(false);
                });
        }
    }, [loading, pageNumber, pageSize]);

    function handleBlockToggle(email) {
        const token = localStorage.getItem("token");
        api.put("/users/state/" + email, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(() => {
            toast.success("User blocked status updated successfully");
            setLoading(true);
        }).catch((err) => {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to update user status");
        });
    }

    function handleRoleToggle(email) {
        const token = localStorage.getItem("token");
        api.put("/users/role/" + email, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(() => {
            toast.success("User role updated successfully");
            setLoading(true);
        }).catch((err) => {
            console.error(err);
            toast.error(err?.response?.data?.message || "Failed to update user role");
        });
    }

    const filteredUsers = users.filter((u) => {
        const matchesFilter = activeFilter === "all"
            ? true
            : activeFilter === "Admin"
                ? u.isAdmin
                : !u.isAdmin;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
            u.email.toLowerCase().includes(q) ||
            `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
            (u.firstName && u.firstName.toLowerCase().includes(q)) ||
            (u.lastName && u.lastName.toLowerCase().includes(q));
        return matchesFilter && matchesSearch;
    });

    const adminCount = users.filter((u) => u.isAdmin).length;
    const customerCount = users.filter((u) => !u.isAdmin).length;
    const activeCount = users.filter((u) => !u.isBlocked).length;
    const blockedCount = users.filter((u) => u.isBlocked).length;

    return (
        <div className="w-full flex flex-col items-center pb-20">
            {/* Top Header Card */}
            <div className={`w-full border mb-6 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 text-slate-800 shadow-sm'
            }`}>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>All Users</h1>
                <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <BiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-9 pr-4 py-2 border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${
                                isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-gray-50 border-gray-200 text-gray-800 focus:bg-white'
                            }`}
                        />
                    </div>
                    <span className={`font-semibold px-4 py-2 rounded-xl text-xs border whitespace-nowrap ${
                        isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                        {totalUsers} Total Users
                    </span>
                    <button
                        onClick={() => setLoading(true)}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold rounded-xl text-xs transition-colors ${
                            isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                    >
                        <BiRefresh size={18} /> Refresh
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Stats Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border transition-colors ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                    {["all", "Admin", "Customer"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${activeFilter === tab
                                ? "bg-amber-600 text-white shadow-md font-bold"
                                : isDarkMode
                                    ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        Total: <strong>{users.length}</strong>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-700 border-purple-200'}`}>
                        Admin: <strong>{adminCount}</strong>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        Customer: <strong>{customerCount}</strong>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        Active: <strong>{activeCount}</strong>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        Blocked: <strong>{blockedCount}</strong>
                    </span>
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && filteredUsers.length === 0 ? (
                <div className={`w-full rounded-2xl p-12 text-center border transition-colors ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 shadow-sm'
                }`}>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>No users found matching the filter ({activeFilter}).</p>
                </div>
            ) : (
                <div className={`w-full overflow-x-auto rounded-2xl border mb-6 transition-colors ${
                    isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 shadow-sm'
                }`}>
                    <table className="w-full text-left min-w-[800px] border-collapse">
                        <thead className="bg-amber-600 text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Profile</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">First Name</th>
                                <th className="p-4">Last Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Email Verified</th>
                                <th className="p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-slate-800 text-slate-200' : 'divide-gray-100 text-gray-700'}`}>
                            {filteredUsers.map((user) => {
                                return (
                                    <tr className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-amber-50/40'}`} key={user.email}>
                                        <td className="p-4">
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.firstName}
                                                    className={`w-10 h-10 rounded-full object-cover border ${
                                                        isDarkMode ? 'border-slate-700' : 'border-gray-200'
                                                    }`}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-sm">
                                                    {user.firstName ? user.firstName[0].toUpperCase() : "U"}
                                                </div>
                                            )}
                                        </td>
                                        <td className={`p-4 font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>{user.email}</td>
                                        <td className={`p-4 font-medium ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{user.firstName}</td>
                                        <td className={`p-4 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>{user.lastName}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    user.isAdmin
                                                        ? isDarkMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-800'
                                                        : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {user.isAdmin ? "Admin" : "Customer"}
                                                </span>
                                                <button
                                                    title="Toggle Role"
                                                    onClick={() => handleRoleToggle(user.email)}
                                                    className={`p-1 rounded-lg transition-colors ${
                                                        isDarkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                                    }`}
                                                >
                                                    <BiRefresh size={18} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                user.isEmailVerified
                                                    ? isDarkMode ? 'bg-blue-500/20 text-blue-300' : 'bg-blue-100 text-blue-800'
                                                    : isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {user.isEmailVerified ? "Verified" : "Unverified"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                                    user.isBlocked
                                                        ? isDarkMode ? 'bg-red-500/20 text-red-300' : 'bg-red-100 text-red-800'
                                                        : isDarkMode ? 'bg-emerald-500/20 text-emerald-300' : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                    {user.isBlocked ? "Blocked" : "Active"}
                                                </span>
                                                <button
                                                    title="Toggle Block Status"
                                                    onClick={() => handleBlockToggle(user.email)}
                                                    className={`p-1 rounded-lg transition-colors ${
                                                        isDarkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                                    }`}
                                                >
                                                    <BiRefresh size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            <div className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 border rounded-2xl p-4 transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 shadow-sm'
            }`}>
                <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setLoading(true); }}
                    className={`px-3 py-1.5 border rounded-xl text-xs font-semibold focus:outline-none cursor-pointer ${
                        isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-gray-50 border-gray-200 text-gray-700'
                    }`}
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>

                <div className="flex items-center gap-3">
                    <button
                        disabled={pageNumber === 1}
                        onClick={() => { setPageNumber(pageNumber - 1); setLoading(true); }}
                        className={`px-4 py-2 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                            isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Previous
                    </button>
                    <span className={`text-xs font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                        Page {pageNumber} of {totalPages}
                    </span>
                    <button
                        disabled={pageNumber === totalPages}
                        onClick={() => { setPageNumber(pageNumber + 1); setLoading(true); }}
                        className={`px-4 py-2 text-xs font-bold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${
                            isDarkMode ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}