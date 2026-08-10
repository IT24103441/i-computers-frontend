import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import getFormattedPrice from "../../utils/price-formatter";
import formatTimestamp from "../../utils/date-formatter";
import AdminOrderDataModal from "../../components/orderDataModal";
import toast from "react-hot-toast";
import { BiShoppingBag, BiRefresh, BiTrash } from "react-icons/bi";

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [refreshKey, setRefreshKey] = useState(0);
    const [activeFilter, setActiveFilter] = useState("all");

    const triggerRefresh = () => {
        setLoading(true);
        setRefreshKey((prev) => prev + 1);
    };

    useEffect(() => {
        let isSubscribed = true;
        const token = localStorage.getItem("token");
        api
            .get("/orders/" + pageNumber + "/" + pageSize, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                if (isSubscribed) {
                    setOrders(res.data.orders || (Array.isArray(res.data) ? res.data : []));
                    setTotalOrders(res.data.totalOrders ?? (res.data.orders ? res.data.orders.length : 0));
                    setTotalPages(res.data.totalPages ?? 1);
                }
            })
            .catch((err) => {
                if (isSubscribed) {
                    console.error("Failed to load orders:", err);
                    setOrders([]);
                }
            })
            .finally(() => {
                if (isSubscribed) {
                    setLoading(false);
                }
            });

        return () => {
            isSubscribed = false;
        };
    }, [pageNumber, pageSize, refreshKey]);

    const handleUpdateStatusRow = (orderId, newStatus) => {
        const token = localStorage.getItem("token");

        api.put("/orders/" + orderId, { status: newStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(() => {
                toast.success(`Order #${orderId} status set to ${newStatus}`);
                setOrders((prev) =>
                    prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
                );
            })
            .catch((err) => {
                console.error("Failed to update status:", err);
                toast.error("Failed to update status");
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
        <div className="w-full space-y-6">
            {/* Top Header Card */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <BiShoppingBag className="text-amber-500" /> Customer Orders Management
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Track, process, and update status for customer orders.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <span className="bg-amber-50 text-amber-700 font-bold px-4 py-2 rounded-xl text-xs border border-amber-200">
                        Total Orders: {totalOrders}
                    </span>
                    <button
                        onClick={triggerRefresh}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
                    >
                        <BiRefresh size={18} /> Refresh
                    </button>
                </div>
            </div>

            {/* Filter Tabs & Stats Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
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

            {loading && (
                <div className="w-full py-16 flex justify-center items-center">
                    <LoadingScreen />
                </div>
            )}

            {!loading && filteredOrders.length === 0 ? (
                <div className="w-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-2">
                    <BiShoppingBag size={48} className="mx-auto text-gray-300" />
                    <h3 className="text-base font-bold text-gray-700">No orders found</h3>
                    <p className="text-xs text-gray-400">There are no orders matching the selected filter ({activeFilter}).</p>
                </div>
            ) : (
                <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">City / Phone</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Total Amount</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                                {filteredOrders.map((order) => {
                                    return (
                                        <tr className="hover:bg-gray-50/50 transition-colors" key={order.orderId}>
                                            {/* Order ID */}
                                            <td className="p-4 font-mono font-bold text-amber-600 text-xs">
                                                #{order.orderId}
                                            </td>

                                            {/* Customer */}
                                            <td className="p-4">
                                                <p className="font-semibold text-gray-900 text-xs">{order.firstName} {order.lastName}</p>
                                                <p className="text-[11px] text-gray-400">{order.email}</p>
                                            </td>

                                            {/* City / Phone */}
                                            <td className="p-4 text-xs">
                                                <p className="font-medium text-gray-800">{order.city}</p>
                                                <p className="text-[11px] text-gray-400 font-mono">{order.phone}</p>
                                            </td>

                                            {/* Status Dropdown */}
                                            <td className="p-4">
                                                <select
                                                    disabled={order.status === "Cancelled"}
                                                    value={order.status}
                                                    onChange={(e) => handleUpdateStatusRow(order.orderId, e.target.value)}
                                                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border outline-none transition-all ${order.status === "Cancelled"
                                                            ? "bg-red-50 text-red-700 border-red-200 cursor-not-allowed opacity-80"
                                                            : order.status === "Delivered"
                                                                ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                                                                : order.status === "Shipped"
                                                                    ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 cursor-pointer"
                                                                    : order.status === "Processing"
                                                                        ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer"
                                                                        : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 cursor-pointer"
                                                        }`}
                                                >
                                                    <option value="Pending" className="bg-white text-gray-800">Pending</option>
                                                    <option value="Processing" className="bg-white text-gray-800">Processing</option>
                                                    <option value="Shipped" className="bg-white text-gray-800">Shipped</option>
                                                    <option value="Delivered" className="bg-white text-gray-800">Delivered</option>
                                                    <option value="Cancelled" className="bg-white text-gray-800">Cancelled</option>
                                                </select>
                                            </td>

                                            {/* Date */}
                                            <td className="p-4 text-xs text-gray-400 whitespace-nowrap">
                                                {(() => {
                                                    try {
                                                        return formatTimestamp(order.date);
                                                    } catch {
                                                        return new Date(order.date).toLocaleDateString();
                                                    }
                                                })()}
                                            </td>

                                            {/* Total */}
                                            <td className="p-4 font-extrabold text-amber-600 text-sm">
                                                {getFormattedPrice(order.totalAmount)}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-center">
                                                <div className="flex justify-center items-center gap-2">
                                                    <AdminOrderDataModal isAdmin={true} order={order} refresh={triggerRefresh} />

                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
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