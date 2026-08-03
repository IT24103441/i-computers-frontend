import { useState } from "react";
import { IoMdEye } from "react-icons/io";
import getFormattedPrice from "../utils/price-formatter";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function AdminOrderDataModal(props) {
    const [isOpen, setIsOpen] = useState(false);
    const order = props.order;
    const refresh = props.refresh;

    function updateOrderStatus(newStatus) {
        const token = localStorage.getItem("token");

        api.put("/orders/" + order.orderId, {
            status: newStatus
        }, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then((res) => {
            toast.success("Order status updated successfully")
            console.log(res.data)
            refresh()
        }).catch((err) => {
            console.log(err)
            toast.error("Failed to update order status")
        })
    }

    return (
        <>
            <IoMdEye
                className="text-blue-600 text-xl rounded-full hover:border cursor-pointer"
                onClick={() => setIsOpen(true)}
            />
            {isOpen && (
                <div className="w-screen h-screen fixed left-0 top-0 bg-black/70 flex justify-center items-center z-50">
                    <div className="w-[700px] max-h-screen flex flex-col bg-primary rounded-xl">
                        <div className="w-full h-[250px] bg-white relative">
                            {/* orderId , firstName, lastName, email, phone, addressLine1, addressLine2, city, status */}
                            {/* close button */}
                            <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                                onClick={() => setIsOpen(false)}
                            >
                                ✕
                            </button>
                            <div className="w-full h-full p-4 flex flex-col gap-2">
                                <h2 className="text-2xl font-semibold">Order ID: {order.orderId}</h2>
                                <p>Name: {order.firstName} {order.lastName}</p>
                                <p>Email: {order.email}</p>
                                <p>Phone: {order.phone}</p>
                                <p>Address: {order.addressLine1} {order.addressLine2} , {order.city}</p>
                                <p>Status: {order.status}
                                    {props.isAdmin && <select className="ml-4 border" defaultValue={order.status}
                                        onChange={
                                            (e) => {
                                                updateOrderStatus(e.target.value)
                                            }
                                        }>
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>}
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-[400px] p-4 flex flex-col gap-4 overflow-y-auto">
                            {(order?.items || order?.orderedItems || []).length === 0 ? (
                                <p className="text-gray-500 italic text-center my-auto">No items found in this order.</p>
                            ) : (
                                (order?.items || order?.orderedItems || []).map((item, index) => {
                                    const qty = item.qty ?? item.quantity ?? 1;
                                    const product = item.product || {};
                                    const price = product.price ?? item.price ?? 0;
                                    const labelledPrice = product.labelledPrice ?? product.labeledPrice;
                                    const imgSrc = product.image || product.images?.[0];

                                    return (
                                        <div
                                            className="w-full min-h-[120px] shadow-md border rounded-lg bg-white p-3 flex flex-row items-center justify-between relative gap-4"
                                            key={index}
                                        >
                                            <div className="flex flex-row items-center gap-4">
                                                {imgSrc ? (
                                                    <img
                                                        src={imgSrc}
                                                        alt={product.name || "Product"}
                                                        className="w-20 h-20 object-cover rounded-md border"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 bg-gray-100 rounded-md border flex items-center justify-center text-xs text-gray-400">
                                                        No Image
                                                    </div>
                                                )}

                                                <div className="flex flex-col">
                                                    <h3 className="text-base font-bold text-gray-800">{product.name || item.name || "Product"}</h3>
                                                    {labelledPrice && Number(labelledPrice) > Number(price) && (
                                                        <p className="text-gray-400 text-xs line-through">
                                                            {getFormattedPrice(labelledPrice)}
                                                        </p>
                                                    )}
                                                    <p className="text-accent font-semibold text-sm">
                                                        {getFormattedPrice(price)}
                                                    </p>
                                                    <span className="text-xs text-gray-600 mt-1">
                                                        Quantity: <span className="font-bold">{qty}</span>
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end justify-center">
                                                <span className="text-sm text-gray-500">Total:</span>
                                                <span className="text-lg font-bold text-accent">
                                                    {getFormattedPrice(price * qty)}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}