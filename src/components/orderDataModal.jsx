import { useState } from "react";
import { BiShow, BiX, BiUser, BiPhone, BiEnvelope, BiMap, BiPackage, BiCheckCircle, BiTrash } from "react-icons/bi";
import getFormattedPrice from "../utils/price-formatter";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function AdminOrderDataModal(props) {
    const [isOpen, setIsOpen] = useState(false);
    const order = props.order;
    const refresh = props.refresh;
    const isDarkMode = props.isDarkMode || false;
    const [currentStatus, setCurrentStatus] = useState(order.status);
    const [updating, setUpdating] = useState(false);

    function updateOrderStatus(newStatus) {
        const token = localStorage.getItem("token");
        setUpdating(true);

        api.put("/orders/" + order.orderId, {
            status: newStatus
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            toast.success(`Order status updated to ${newStatus}`);
            setCurrentStatus(newStatus);
            setUpdating(false);
            if (typeof refresh === 'function') {
                refresh();
            }
        }).catch((err) => {
            console.error("Failed to update order status:", err);
            toast.error(err?.response?.data?.message || "Failed to update order status");
            setUpdating(false);
        });
    }

    function handleUserCancelOrder() {
        if (!window.confirm(`Are you sure you want to cancel Order #${order.orderId}?`)) return;

        const token = localStorage.getItem("token");
        setUpdating(true);

        api.put("/orders/" + order.orderId + "/cancel", {}, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            toast.success(res.data.message || "Order cancelled successfully");
            setCurrentStatus("Cancelled");
            setUpdating(false);
            if (typeof refresh === 'function') {
                refresh();
            }
        }).catch((err) => {
            console.error("Failed to cancel order:", err);
            toast.error(err?.response?.data?.message || "Failed to cancel order");
            setUpdating(false);
        });
    }

    function handleDeleteOrder() {
        if (!window.confirm(`Are you sure you want to delete Order #${order.orderId}?`)) return;

        const token = localStorage.getItem("token");
        setUpdating(true);

        api.delete("/orders/" + order.orderId, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            toast.success(res.data.message || "Order deleted successfully");
            setUpdating(false);
            setIsOpen(false);
            if (typeof refresh === 'function') {
                refresh();
            }
        }).catch((err) => {
            console.error("Failed to delete order:", err);
            toast.error(err?.response?.data?.message || "Failed to delete order");
            setUpdating(false);
        });
    }

    const items = order?.items || order?.orderedItems || [];

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 font-bold rounded-xl text-xs transition-colors ${
                    isDarkMode
                        ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 shadow-sm"
                }`}
                title="View Full Order Details"
            >
                <BiShow size={16} /> Details
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-4 sm:p-6 z-50 animate-in fade-in duration-200">
                    <div className={`w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl border overflow-hidden flex flex-col transition-colors ${
                        isDarkMode ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-white text-slate-800 border-slate-200'
                    }`}>
                        
                        {/* Modal Header */}
                        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-extrabold tracking-tight">Order #{order.orderId}</h2>
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                            currentStatus === "Delivered"
                                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                                : currentStatus === "Shipped"
                                                ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                                : currentStatus === "Processing"
                                                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                                                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                        }`}
                                    >
                                        {currentStatus}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 mt-0.5">Placed by {order.firstName} {order.lastName}</p>
                            </div>

                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                            >
                                <BiX size={24} />
                            </button>
                        </div>

                        {/* Modal Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            
                            {/* Customer & Shipping Details Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                                    isDarkMode ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-800'
                                }`}>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                        <BiUser className="text-amber-500" /> Customer Information
                                    </h3>
                                    <p className={`font-bold text-sm ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{order.firstName} {order.lastName}</p>
                                    <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        <BiEnvelope className="text-slate-400" /> {order.email}
                                    </p>
                                    <p className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        <BiPhone className="text-slate-400" /> {order.phone}
                                    </p>
                                </div>

                                <div className={`p-4 rounded-2xl border space-y-2 transition-colors ${
                                    isDarkMode ? 'bg-slate-800/60 border-slate-700/60 text-slate-200' : 'bg-slate-50 border-slate-100 text-slate-800'
                                }`}>
                                    <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                    }`}>
                                        <BiMap className="text-amber-500" /> Shipping Address
                                    </h3>
                                    <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {order.addressLine1} {order.addressLine2 ? `, ${order.addressLine2}` : ""}<br />
                                        {order.city}
                                    </p>

                                     {/* Admin Change Status Dropdown */}
                                    {props.isAdmin && (
                                        <div className={`pt-2 border-t flex items-center justify-between ${
                                            isDarkMode ? 'border-slate-700' : 'border-slate-200/60'
                                        }`}>
                                            <span className={`text-[11px] font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Update Status:</span>
                                            {currentStatus === "Cancelled" ? (
                                                <span className={`text-xs font-bold px-2.5 py-1 rounded-xl border ${
                                                    isDarkMode ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-red-50 text-red-600 border-red-200'
                                                }`}>
                                                    Order Cancelled
                                                </span>
                                            ) : (
                                                <select
                                                    disabled={updating}
                                                    value={currentStatus}
                                                    onChange={(e) => updateOrderStatus(e.target.value)}
                                                    className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer transition-all ${
                                                        isDarkMode ? 'bg-slate-900 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-300'
                                                    }`}
                                                >
                                                    <option value="Pending" className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>Pending</option>
                                                    <option value="Processing" className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>Processing</option>
                                                    <option value="Shipped" className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>Shipped</option>
                                                    <option value="Delivered" className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>Delivered</option>
                                                    <option value="Cancelled" className={isDarkMode ? "bg-slate-900 text-white" : "bg-white text-slate-900"}>Cancelled</option>
                                                </select>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Items List */}
                            <div className="space-y-3">
                                <h3 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                    <BiPackage className="text-amber-500" /> Order Items ({items.length})
                                </h3>

                                {items.length === 0 ? (
                                    <p className={`text-xs italic p-4 text-center rounded-xl border ${
                                        isDarkMode ? 'bg-slate-800/60 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-400'
                                    }`}>No items in this order.</p>
                                ) : (
                                    <div className="space-y-2.5">
                                        {items.map((item, index) => {
                                            const qty = item.qty ?? item.quantity ?? 1;
                                            const product = item.product || {};
                                            const price = product.price ?? item.price ?? 0;
                                            const labelledPrice = product.labelledPrice ?? product.labeledPrice;
                                            const imgSrc = product.image || product.images?.[0];

                                            return (
                                                <div
                                                    key={index}
                                                    className={`p-3.5 rounded-2xl border shadow-sm flex items-center justify-between gap-4 transition-colors ${
                                                        isDarkMode ? 'bg-slate-800/80 border-slate-700 hover:border-amber-500/40' : 'bg-white border-slate-200 hover:border-amber-200'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        {imgSrc ? (
                                                            <img
                                                                src={imgSrc}
                                                                alt={product.name || "Product"}
                                                                className={`w-14 h-14 object-cover rounded-xl border flex-shrink-0 ${
                                                                    isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-100 bg-slate-50'
                                                                }`}
                                                            />
                                                        ) : (
                                                            <div className={`w-14 h-14 rounded-xl border flex items-center justify-center text-[10px] flex-shrink-0 ${
                                                                isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-200 text-slate-400'
                                                            }`}>
                                                                No Image
                                                            </div>
                                                        )}

                                                        <div className="min-w-0">
                                                            <h4 className={`font-bold text-xs truncate ${
                                                                isDarkMode ? 'text-slate-100' : 'text-slate-900'
                                                            }`}>
                                                                {product.name || item.name || "Product"}
                                                            </h4>
                                                            <div className="flex items-baseline gap-2 mt-0.5">
                                                                <span className="text-xs font-bold text-amber-500">
                                                                    {getFormattedPrice(price)}
                                                                </span>
                                                                {labelledPrice && Number(labelledPrice) > Number(price) && (
                                                                    <span className={`text-[10px] line-through ${
                                                                        isDarkMode ? 'text-slate-500' : 'text-slate-400'
                                                                    }`}>
                                                                        {getFormattedPrice(labelledPrice)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className={`text-[10px] font-medium ${
                                                                isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                                            }`}>
                                                                Quantity: <strong className={isDarkMode ? 'text-slate-200' : 'text-slate-800'}>{qty}</strong>
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right flex-shrink-0">
                                                        <span className="text-[10px] text-slate-400 font-semibold block">Subtotal</span>
                                                        <span className={`text-sm font-extrabold ${
                                                            isDarkMode ? 'text-slate-100' : 'text-slate-900'
                                                        }`}>
                                                            {getFormattedPrice(price * qty)}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* Modal Footer */}
                        <div className={`p-4 sm:p-6 border-t flex items-center justify-between gap-4 transition-colors ${
                            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
                        }`}>
                            <div>
                                <span className={`text-xs font-semibold block ${
                                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>Total Amount Paid</span>
                                <span className="text-xl font-black text-amber-500">{getFormattedPrice(order.totalAmount)}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                {!props.isAdmin && (currentStatus === "Pending" || currentStatus === "Processing") && (
                                    <button
                                        disabled={updating}
                                        onClick={handleUserCancelOrder}
                                        className={`px-4 py-2.5 font-bold text-xs rounded-xl border transition-colors shadow-sm disabled:opacity-50 ${
                                            isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                                        }`}
                                    >
                                        {updating ? "Cancelling..." : "Cancel Order"}
                                    </button>
                                )}

                                {currentStatus === "Cancelled" && (
                                    <button
                                        disabled={updating}
                                        onClick={handleDeleteOrder}
                                        className={`inline-flex items-center gap-1 px-4 py-2.5 font-bold text-xs rounded-xl border transition-colors shadow-sm disabled:opacity-50 ${
                                            isDarkMode ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30' : 'bg-red-50 hover:bg-red-100 text-red-600 border-red-200'
                                        }`}
                                    >
                                        <BiTrash size={16} /> {updating ? "Deleting..." : "Delete Order"}
                                    </button>
                                )}

                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`px-6 py-2.5 font-bold text-xs rounded-xl shadow-md transition-colors ${
                                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700' : 'bg-slate-900 hover:bg-slate-800 text-white'
                                    }`}
                                >
                                    Close Window
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}