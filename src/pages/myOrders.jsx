import { useEffect, useState } from "react";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import getFormattedPrice from "../utils/price-formatter";
import formatTimestamp from "../utils/date-formatter";
import AdminOrderDataModal from "../components/orderDataModal";
import toast from "react-hot-toast";
import { BiTrash, BiXCircle } from "react-icons/bi";


export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [activeFilter, setActiveFilter] = useState("all");

    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        setLoading(true);
        setRefreshKey((prev) => prev + 1);
    };

    useEffect(() => {
        let isSubscribed = true;
        const token = localStorage.getItem("token");

        const fetchMyOrders = async () => {
            try {
                const res = await api.get("/orders/my/" + pageNumber + "/" + pageSize, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (isSubscribed) {
                    setOrders(res.data.orders || (Array.isArray(res.data) ? res.data : []));
                    setTotalOrders(res.data.totalOrders ?? (res.data.orders ? res.data.orders.length : 0));
                    setTotalPages(res.data.totalPages ?? 1);
                }
            } catch (err) {
                try {
                    const fallbackRes = await api.get("/orders/" + pageNumber + "/" + pageSize, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (isSubscribed) {
                        setOrders(fallbackRes.data.orders || (Array.isArray(fallbackRes.data) ? fallbackRes.data : []));
                        setTotalOrders(fallbackRes.data.totalOrders ?? (fallbackRes.data.orders ? fallbackRes.data.orders.length : 0));
                        setTotalPages(fallbackRes.data.totalPages ?? 1);
                    }
                } catch (fallbackErr) {
                    if (isSubscribed) {
                        console.error("Error fetching my orders:", fallbackErr);
                        setOrders([]);
                    }
                }
            } finally {
                if (isSubscribed) {
                    setLoading(false);
                }
            }
        };

        fetchMyOrders();

        return () => {
            isSubscribed = false;
        };
    }, [pageNumber, pageSize, refreshKey]);

    const handleCancelOrder = (orderId) => {
        if (!window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) return;

        const token = localStorage.getItem("token");
        api.put("/orders/" + orderId + "/cancel", {}, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                toast.success(res.data.message || "Order cancelled successfully");
                triggerRefresh();
            })
            .catch((err) => {
                console.error("Failed to cancel order:", err);
                toast.error(err.response?.data?.message || "Failed to cancel order");
            });
    };

    const handleDeleteOrder = (orderId) => {
        if (!window.confirm(`Are you sure you want to delete Order #${orderId}?`)) return;

        const token = localStorage.getItem("token");
        api.delete("/orders/" + orderId, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                toast.success(res.data.message || "Order deleted successfully");
                triggerRefresh();
            })
            .catch((err) => {
                console.error("Failed to delete order:", err);
                toast.error(err.response?.data?.message || "Failed to delete order");
            });
    };

    const filteredOrders = activeFilter === "all" ? orders : orders.filter((o) => o.status === activeFilter);
    const pendingCount = orders.filter((o) => o.status === "Pending").length;
    const processingCount = orders.filter((o) => o.status === "Processing").length;
    const shippedCount = orders.filter((o) => o.status === "Shipped").length;
    const deliveredCount = orders.filter((o) => o.status === "Delivered").length;
    const cancelledCount = orders.filter((o) => o.status === "Cancelled").length;

    return (
        <div className="w-full min-h-screen p-4 sm:p-8 max-w-6xl mx-auto flex flex-col items-center pb-28 lg:pb-12">
            <div className="w-full bg-white shadow-sm border border-gray-100 mb-6 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <div className="bg-amber-50 text-amber-700 font-semibold px-4 py-1.5 rounded-full text-sm">
                    {totalOrders} Total Orders
                </div>
            </div>

            {/* Filter Tabs & Stats Bar */}
            <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
                    {["all", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((tab) => (
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
                        Total: <strong>{orders.length}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200">
                        Pending: <strong>{pendingCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                        Processing: <strong>{processingCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200">
                        Shipped: <strong>{shippedCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Delivered: <strong>{deliveredCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200">
                        Cancelled: <strong>{cancelledCount}</strong>
                    </span>
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && filteredOrders.length === 0 ? (
                <div className="w-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg">No orders found matching the selected filter ({activeFilter}).</p>
                </div>
            ) : (
                <div className="w-full overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
                    <table className="w-full text-left min-w-[700px] border-collapse">
                        <thead className="bg-amber-600 text-white text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4">City</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Total</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {filteredOrders.map((order) => {
                                return (
                                    <tr className="hover:bg-amber-50/40 transition-colors" key={order.orderId}>
                                        <td className="p-4 font-mono font-medium text-gray-900">{order.orderId}</td>
                                        <td className="p-4">
                                            <div className="font-semibold text-gray-900">{order.firstName} {order.lastName}</div>
                                            <div className="text-xs text-gray-400">{order.email}</div>
                                        </td>
                                        <td className="p-4">{order.city}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${order.status === "Delivered"
                                                    ? "bg-emerald-100 text-emerald-800"
                                                    : order.status === "Cancelled"
                                                        ? "bg-red-100 text-red-800"
                                                        : order.status === "Shipped"
                                                            ? "bg-purple-100 text-purple-800"
                                                            : "bg-amber-100 text-amber-800"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-xs text-gray-500">{formatTimestamp(order.date)}</td>
                                        <td className="p-4 font-bold text-amber-600">{getFormattedPrice(order.totalAmount)}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <AdminOrderDataModal isAdmin={false} order={order} refresh={triggerRefresh} />
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
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mt-auto">
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