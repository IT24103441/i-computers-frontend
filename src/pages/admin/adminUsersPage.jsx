import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import { BiRefresh } from "react-icons/bi";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [activeFilter, setActiveFilter] = useState("all");

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
                    console.log(res.data);
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
        }).then((res) => {
            console.log(res.data);
            toast.success("User blocked status updated successfully");
            setLoading(true);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.message || "Failed to update user status");
        });
    }

    function handleRoleToggle(email) {
        const token = localStorage.getItem("token");
        api.put("/users/role/" + email, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((res) => {
            console.log(res.data);
            toast.success("User role updated successfully");
            setLoading(true);
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.message || "Failed to update user role");
        });
    }

    const filteredUsers = activeFilter === "all" 
        ? users 
        : activeFilter === "Admin" 
            ? users.filter((u) => u.isAdmin) 
            : users.filter((u) => !u.isAdmin);

    const adminCount = users.filter((u) => u.isAdmin).length;
    const customerCount = users.filter((u) => !u.isAdmin).length;
    const activeCount = users.filter((u) => !u.isBlocked).length;
    const blockedCount = users.filter((u) => u.isBlocked).length;

    return (
        <div className="w-full flex flex-col items-center pb-20">
            <div className="w-full bg-white shadow-sm border border-gray-100 mb-6 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
                <div className="flex items-center gap-3">
                    <span className="bg-amber-50 text-amber-700 font-semibold px-4 py-1.5 rounded-full text-sm">
                        {totalUsers} Total Users
                    </span>
                    <button
                        onClick={() => setLoading(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
                    >
                        <BiRefresh size={18} /> Refresh
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Stats Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
                    {["all", "Admin", "Customer"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                                activeFilter === tab
                                    ? "bg-amber-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                        Total: <strong>{users.length}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                        Admin: <strong>{adminCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                        Customer: <strong>{customerCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active: <strong>{activeCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200">
                        Blocked: <strong>{blockedCount}</strong>
                    </span>
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && filteredUsers.length === 0 ? (
                <div className="w-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg">No users found matching the filter ({activeFilter}).</p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
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
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {filteredUsers.map((user) => {
                                return (
                                    <tr className="hover:bg-amber-50/40 transition-colors" key={user.email}>
                                        <td className="p-4">
                                            {user.image ? (
                                                <img
                                                    src={user.image}
                                                    alt={user.firstName}
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                                                    {user.firstName ? user.firstName[0].toUpperCase() : "U"}
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono text-xs text-gray-600">{user.email}</td>
                                        <td className="p-4 font-medium text-gray-900">{user.firstName}</td>
                                        <td className="p-4 text-gray-700">{user.lastName}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'}`}>
                                                    {user.isAdmin ? "Admin" : "Customer"}
                                                </span>
                                                <button
                                                    title="Toggle Role"
                                                    onClick={() => handleRoleToggle(user.email)}
                                                    className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                >
                                                    <BiRefresh size={18} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.isEmailVerified ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'}`}>
                                                {user.isEmailVerified ? "Verified" : "Unverified"}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                                    {user.isBlocked ? "Blocked" : "Active"}
                                                </span>
                                                <button
                                                    title="Toggle Block Status"
                                                    onClick={() => handleBlockToggle(user.email)}
                                                    className="p-1 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
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
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setLoading(true); }}
                    className="px-3 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold bg-gray-50 text-gray-700 focus:outline-none cursor-pointer"
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>

                <div className="flex items-center gap-3">
                    <button
                        disabled={pageNumber === 1}
                        onClick={() => { setPageNumber(pageNumber - 1); setLoading(true); }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <span className="text-xs text-gray-600 font-semibold">
                        Page {pageNumber} of {totalPages}
                    </span>
                    <button
                        disabled={pageNumber === totalPages}
                        onClick={() => { setPageNumber(pageNumber + 1); setLoading(true); }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 text-xs font-bold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}