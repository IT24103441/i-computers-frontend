import { useState } from "react"
import { getCart, getTotal } from "../utils/cart"
import getFormattedPrice from "../utils/price-formatter"
import { useLocation } from "react-router-dom"
import CreateOrder from "../components/createOrder"

export default function CheckoutPage() {
    const location = useLocation();
    const data = location.state;
    const [cart, setCart] = useState(data || getCart());

    if (!cart || cart.length === 0) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center pb-28 lg:pb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">No Items for Checkout</h2>
                <p className="text-gray-500 mb-6 max-w-sm">Please add items to your cart or select a product to buy.</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 sm:p-8 flex flex-col items-center pb-28 lg:pb-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Order Checkout</h1>
            
            <div className="w-full max-w-2xl flex flex-col gap-4">
                {cart.map((cartItem, index) => {
                    const product = cartItem.product || {};
                    const imgSrc = product.image || product.images?.[0];
                    const price = product.price ?? 0;
                    const labelledPrice = product.labelledPrice ?? product.labeledPrice;

                    return (
                        <div
                            className="w-full bg-white shadow-sm border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 relative transition-all hover:shadow-md"
                            key={product.productId || index}
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                {imgSrc ? (
                                    <img src={imgSrc} className="w-full h-full object-cover" alt={product.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                )}
                            </div>

                            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                                <h3 className="text-base font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                                {labelledPrice && Number(labelledPrice) > Number(price) && (
                                    <p className="text-gray-400 text-xs line-through mt-0.5">
                                        {getFormattedPrice(labelledPrice)}
                                    </p>
                                )}
                                <p className="text-amber-600 font-bold text-base mt-0.5">{getFormattedPrice(price)}</p>

                                <div className="h-8 border border-gray-200 rounded-lg flex flex-row items-center overflow-hidden mt-2 bg-gray-50">
                                    <button
                                        className="w-7 h-full text-gray-600 hover:bg-amber-600 hover:text-white font-bold transition-colors text-sm"
                                        onClick={() => {
                                            const newCart = cart.map(item => ({ ...item }));
                                            const newQty = newCart[index].qty - 1;
                                            if (newQty > 0) {
                                                newCart[index].qty = newQty;
                                                setCart(newCart);
                                            }
                                        }}
                                    >
                                        -
                                    </button>
                                    <span className="w-8 text-center font-semibold text-xs text-gray-800">
                                        {cartItem.qty}
                                    </span>
                                    <button
                                        className="w-7 h-full text-gray-600 hover:bg-amber-600 hover:text-white font-bold transition-colors text-sm"
                                        onClick={() => {
                                            const newCart = cart.map(item => ({ ...item }));
                                            newCart[index].qty = newCart[index].qty + 1;
                                            setCart(newCart);
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className="text-right">
                                <span className="text-sm text-gray-400 block">Subtotal</span>
                                <span className="text-lg font-bold text-amber-600">
                                    {getFormattedPrice(price * cartItem.qty)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="w-full max-w-2xl bg-white shadow-xl border border-gray-100 rounded-2xl p-4 my-6 sticky bottom-24 lg:bottom-6 z-20 flex flex-row items-center justify-between">
                <CreateOrder cart={cart} />
                <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm font-medium">Total:</span>
                    <span className="text-amber-600 text-xl sm:text-2xl font-bold">
                        {getFormattedPrice(getTotal(cart))}
                    </span>
                </div>
            </div>
        </div>
    );
}