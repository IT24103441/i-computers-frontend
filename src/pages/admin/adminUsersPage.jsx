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

    return (
        <div className="w-full flex flex-col items-center pb-20">
            <div className="w-full bg-white shadow-sm border border-gray-100 mb-6 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
                <div className="bg-amber-50 text-amber-700 font-semibold px-4 py-1.5 rounded-full text-sm">
                    {totalUsers} Users
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && users.length === 0 ? (
                <div className="w-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg">No users found.</p>
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
                            {users.map((user) => {
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
            <div className="w-full max-w-md bg-white shadow-md border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-4 mt-4">
                <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setLoading(true); }}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none"
                >
                    <option value={2}>2 per page</option>
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>

                <div className="flex items-center gap-2">
                    <button
                        disabled={pageNumber === 1}
                        onClick={() => { setPageNumber(pageNumber - 1); setLoading(true); }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Prev
                    </button>
                    <span className="text-xs text-gray-600 font-medium">
                        Page {pageNumber} of {totalPages}
                    </span>
                    <button
                        disabled={pageNumber === totalPages}
                        onClick={() => { setPageNumber(pageNumber + 1); setLoading(true); }}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}