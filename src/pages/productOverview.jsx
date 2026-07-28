import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";

export default function ProductOverview() {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (productId) {
            api.get("/products/" + productId)
                .then((res) => {
                    setProduct(res.data);
                })
                .catch((err) => {
                    console.error("Failed to load product details:", err);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [productId]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!product) {
        return (
            <div className="w-full p-12 text-center text-gray-500">
                <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
                <Link to="/products" className="text-amber-600 underline">
                    Back to Products
                </Link>
            </div>
        );
    }

    const available = product.isAvailable === true || product.isAvailable === "true";

    return (
        <div className="w-full max-w-6xl mx-auto p-8">
            <Link
                to="/products"
                className="inline-block mb-6 text-gray-600 hover:text-amber-600 transition-colors"
            >
                &larr; Back to Products
            </Link>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Images */}
                <div className="flex flex-col gap-4">
                    <div className="w-full h-80 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 relative">
                        {product.images?.[selectedImage] ? (
                            <img
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className={`w-full h-full object-cover ${!available ? "grayscale brightness-90" : ""}`}
                            />
                        ) : (
                            <span className="text-gray-400">No Image</span>
                        )}
                        {!available && (
                            <span className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                Unavailable
                            </span>
                        )}
                    </div>
                    {product.images?.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {product.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 ${
                                        selectedImage === idx
                                            ? "border-amber-600"
                                            : "border-transparent opacity-70"
                                    }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wider">
                                {product.category}
                            </span>
                            <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                                    available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {available ? "Available" : "Unavailable"}
                            </span>
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <p className="text-xs text-gray-400 mb-4">ID: {product.productId}</p>

                        <div className="flex items-baseline gap-3 mb-6">
                            <span className="text-3xl font-bold text-amber-600">
                                LKR {product.price?.toLocaleString()}
                            </span>
                            {product.labelledPrice > product.price && (
                                <span className="text-lg text-gray-400 line-through">
                                    LKR {product.labelledPrice?.toLocaleString()}
                                </span>
                            )}
                        </div>

                        {product.description && (
                            <div className="mb-6">
                                <h3 className="text-sm font-semibold text-gray-700 mb-1">Description</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm mb-6">
                            {product.brand && (
                                <div>
                                    <span className="text-gray-400 block text-xs">Brand</span>
                                    <span className="font-medium text-gray-800">{product.brand}</span>
                                </div>
                            )}
                            {product.model && (
                                <div>
                                    <span className="text-gray-400 block text-xs">Model</span>
                                    <span className="font-medium text-gray-800">{product.model}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-gray-400 block text-xs">Availability Status</span>
                                <span
                                    className={`font-medium ${
                                        available ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {available ? `In Stock (${product.stock ?? 0})` : "Out of Stock / Unavailable"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        disabled={!available}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-amber-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:shadow-none"
                    >
                        {available ? "Add to Cart" : "Out of Stock"}
                    </button>
                </div>
            </div>
        </div>
    );
}
