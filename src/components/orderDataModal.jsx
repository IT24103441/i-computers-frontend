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
                                    <select className="ml-4 border" defaultValue={order.status}
                                        onChange={
                                            (e) => {
                                                updateOrderStatus(e.target.value)
                                            }
                                        }>
                                        <option value="Pending">Pending</option>
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </p>
                            </div>
                        </div>
                        <div className="w-full h-[400px] p-4 flex flex-col gap-4 overflow-y-scroll">
                            {order.items.map((item, index) => {
                                return (
                                    <div
                                        className="w-[600px] h-[150px]  shadow-2xl bg-white my-4 flex flex-row relative"
                                        key={index}
                                    >
                                        <img
                                            src={item.product.image}
                                            className="h-full aspect-square"
                                        />

                                        <div className="h-full  w-[450px] flex flex-col  p-4">
                                            <h3 className="text-lg font-bold">{item.product.name}</h3>
                                            {/* labelled price */}
                                            <p className="text-gray-500 text-sm line-through">
                                                {getFormattedPrice(item.product.labelledPrice)}
                                            </p>
                                            <p className="text-accent font-semibold">
                                                {getFormattedPrice(item.product.price)}
                                            </p>
                                            <div className="h-[30px] w-[100px] mt-2 border border-accent rounded-4xl flex flex-row items-center justify-center overflow-hidden">
                                                <span className="w-[40px] h-full flex justify-center items-center">
                                                    {item.qty}
                                                </span>
                                            </div>
                                        </div>

                                        {/* total price */}
                                        <span className="absolute bottom-2 text-xl right-2 text-accent font-semibold">
                                            {getFormattedPrice(item.product.price * item.qty)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}