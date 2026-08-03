import { useState } from "react"
import { addToCart, getCart, getTotal } from "../utils/cart"
import getFormattedPrice from "../utils/price-formatter"
import { Link } from "react-router-dom"

export default function CartPage() {
    const [cart, setCart] = useState(getCart());

    if (!cart || cart.length === 0) {
        return (
            <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center pb-28 lg:pb-12">
                <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mb-4 text-3xl">
                    🛒
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6 max-w-sm">Looks like you haven't added any items to your cart yet.</p>
                <Link to="/products" className="px-6 py-3 text-white bg-amber-600 font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-md text-center">
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 sm:p-8 flex flex-col items-center pb-28 lg:pb-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Shopping Cart</h1>
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
                            {/* Product Image */}
                            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                {imgSrc ? (
                                    <img src={imgSrc} className="w-full h-full object-cover" alt={product.name} />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                                )}
                            </div>

                            {/* Details */}
                            <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                                <h3 className="text-base font-bold text-gray-800 line-clamp-1">{product.name}</h3>
                                {labelledPrice && Number(labelledPrice) > Number(price) && (
                                    <p className="text-gray-400 text-xs line-through mt-0.5">
                                        {getFormattedPrice(labelledPrice)}
                                    </p>
                                )}
                                <p className="text-amber-600 font-bold text-lg mt-0.5">{getFormattedPrice(price)}</p>

                                {/* Quantity Control */}
                                <div className="h-9 border border-gray-200 rounded-lg flex flex-row items-center overflow-hidden mt-3 bg-gray-50">
                                    <button
                                        className="w-8 h-full text-gray-600 hover:bg-amber-600 hover:text-white font-bold transition-colors"
                                        onClick={() => {
                                            addToCart(product, -1);
                                            setCart(getCart());
                                        }}
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center font-semibold text-sm text-gray-800">
                                        {cartItem.qty}
                                    </span>
                                    <button
                                        className="w-8 h-full text-gray-600 hover:bg-amber-600 hover:text-white font-bold transition-colors"
                                        onClick={() => {
                                            addToCart(product, 1);
                                            setCart(getCart());
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Item Total & Remove */}
                            <div className="flex sm:flex-col items-center justify-between sm:items-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                                <button
                                    className="text-gray-400 hover:text-red-600 p-1 font-bold transition-colors text-sm"
                                    title="Remove item"
                                    onClick={() => {
                                        addToCart(product, -cartItem.qty);
                                        setCart(getCart());
                                    }}
                                >
                                    ✕ Remove
                                </button>
                                <span className="text-lg font-bold text-amber-600 sm:mt-4">
                                    {getFormattedPrice(price * cartItem.qty)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Total / Checkout Bar */}
            <div className="w-full max-w-2xl bg-white shadow-xl border border-gray-100 rounded-2xl p-4 my-6 sticky bottom-24 lg:bottom-6 z-20 flex flex-row items-center justify-between">
                <Link
                    to="/checkout"
                    className="px-6 py-3 text-white bg-amber-600 font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-md text-center active:scale-[0.98]"
                    state={cart}
                >
                    Proceed to Checkout
                </Link>
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