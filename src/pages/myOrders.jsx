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

    return (
        <div className="w-full min-h-screen p-4 sm:p-8 max-w-6xl mx-auto flex flex-col items-center pb-28 lg:pb-12">
            <div className="w-full bg-white shadow-sm border border-gray-100 mb-6 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
                <div className="bg-amber-50 text-amber-700 font-semibold px-4 py-1.5 rounded-full text-sm">
                    {totalOrders} Total Orders
                </div>
            </div>

            {loading && <LoadingScreen />}

            {!loading && orders.length === 0 ? (
                <div className="w-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg">No orders found.</p>
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
                            {orders.map((order) => {
                                const isCancellable = order.status === "Pending" || order.status === "Processing";
                                const isCancelled = order.status === "Cancelled";
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
            <div className="w-full max-w-md bg-white shadow-md border border-gray-100 rounded-xl p-3 flex items-center justify-between gap-4 mt-auto">
                <select
                    value={pageSize}
                    onChange={(e) => { setPageSize(Number(e.target.value)); setLoading(true); }}
                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-700 focus:outline-none"
                >
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