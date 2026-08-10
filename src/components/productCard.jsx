import { Link } from "react-router-dom";
import getFormattedPrice from "../utils/price-formatter";

export default function ProductCard({ product }) {
    if (!product) return null;

    const available = product.isAvailable === true || product.isAvailable === "true";
    const isOutOfStock = !available || product.stock === 0;
    const isLowStock = available && product.stock > 0 && product.stock <= 5;

    return (
        <div className={`border w-64 rounded-xl shadow-md p-4 bg-white flex flex-col justify-between transition-all hover:shadow-lg ${isOutOfStock ? "opacity-80" : ""}`}>
            <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-3 relative flex justify-center items-center">
                {product.images?.[0] ? (
                    <img src={product.images[0]} alt={product.name} className={`w-full h-full object-cover ${isOutOfStock ? "grayscale" : ""}`} />
                ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                )}
                {isOutOfStock ? (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
                        Out of Stock
                    </span>
                ) : isLowStock ? (
                    <span className="absolute top-2 right-2 bg-amber-500 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-sm animate-pulse">
                        Only {product.stock} left!
                    </span>
                ) : null}
            </div>

            <h3 className="font-semibold text-gray-800 text-lg line-clamp-1 mb-1" title={product.name}>{product.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{product.category}</p>

            <div className="mb-3">
                {(Number(product.labelledPrice ?? product.labeledPrice) > Number(product.price)) && (
                    <span className="text-xs text-gray-400 line-through block">
                        {getFormattedPrice(product.labelledPrice ?? product.labeledPrice)}
                    </span>
                )}
                <span className="text-amber-600 font-bold text-lg">{getFormattedPrice(product.price)}</span>
            </div>

            <Link to={`/overview/${product.productId}`} className="w-full text-center bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-colors">
                View Product
            </Link>
        </div>
    );
}