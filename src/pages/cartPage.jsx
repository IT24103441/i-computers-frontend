import { useState } from "react"
import { addToCart, getCart, getTotal } from "../utils/cart"
import getFormattedPrice from "../utils/price-formatter"
import { Link } from "react-router-dom"

export default function CartPage() {

    const [cart, setCart] = useState(getCart())

    if (!cart || cart.length === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                <Link to="/products" className="w-[200px] p-2 text-white bg-accent rounded-sm hover:bg-accent/90 text-center">
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="w-full h-full overflow-y-scroll flex items-center flex-col">
            {
                cart.map(
                    (cartItem, index) => {
                        return (
                            <div className="w-[600px] h-[150px] shadow-2xl bg-white my-4 flex flex-row relative" key={cartItem.product?.productId || index}>
                                <img src={cartItem.product.image} className="h-full aspect-square object-cover" alt={cartItem.product.name} />

                                <div className="h-full w-[450px] flex flex-col p-4">
                                    <h3 className="text-lg font-bold">{cartItem.product.name}</h3>
                                    {/* labelled price */}
                                    {(Number(cartItem.product.labelledPrice ?? cartItem.product.labeledPrice) > Number(cartItem.product.price)) && (
                                        <p className="text-gray-500 text-sm line-through">
                                            {getFormattedPrice(cartItem.product.labelledPrice ?? cartItem.product.labeledPrice)}
                                        </p>
                                    )}
                                    <p className="text-accent font-semibold">{getFormattedPrice(cartItem.product.price)}</p>
                                    <div className="h-[30px] w-[100px] mt-2 border border-accent rounded-4xl flex flex-row items-center justify-center overflow-hidden">
                                        <button className="w-[30px] h-full hover:bg-accent hover:text-white"
                                            onClick={
                                                () => {
                                                    addToCart(cartItem.product, -1)
                                                    setCart(getCart())
                                                }
                                            }>
                                            -
                                        </button>
                                        <span className="w-[40px] h-full flex justify-center items-center">
                                            {cartItem.qty}
                                        </span>
                                        <button className="w-[30px] h-full hover:bg-accent hover:text-white"
                                            onClick={
                                                () => {
                                                    addToCart(cartItem.product, 1)
                                                    setCart(getCart())
                                                }
                                            }>
                                            +
                                        </button>
                                    </div>
                                </div>
                                <span className="absolute top-2 right-2 text-gray-500 cursor-pointer hover:text-red-700 font-bold p-1"
                                    onClick={
                                        () => {
                                            addToCart(cartItem.product, -cartItem.qty)
                                            setCart(getCart())
                                        }
                                    }>
                                    X
                                </span>
                                {/* total price */}
                                <span className="absolute bottom-2 text-xl right-2 text-accent font-semibold">
                                    {getFormattedPrice(cartItem.product.price * cartItem.qty)}
                                </span>
                            </div>
                        )
                    }
                )
            }

            <div className="w-[600px] h-[150px] sticky bottom-0 shadow-2xl bg-white my-4 flex flex-row items-center justify-between p-4">
                <Link to="/checkout" className="w-[220px] p-2 text-white bg-accent rounded-sm hover:bg-accent/90 text-center" state={cart}>
                    Checkout
                </Link>
                <div className="flex justify-end h-full items-center">
                    <span className="text-gray-500 text-lg mr-4">Total:</span>
                    <span className="text-accent text-2xl font-bold ">
                        {getFormattedPrice(getTotal(cart))}
                    </span>
                </div>
            </div>
        </div>
    )
}