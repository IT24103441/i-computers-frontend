import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState("all"); // "all", "available", "unavailable"

    useEffect(() => {
        api.get("/products")
            .then((res) => {
                setProducts(res.data || []);
            })
            .catch((err) => {
                console.error("Failed to load products:", err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const isAvailable = (product) => {
        return product.isAvailable === true || product.isAvailable === "true";
    };

    const filteredProducts = products.filter((product) => {
        if (filter === "available") return isAvailable(product);
        if (filter === "unavailable") return !isAvailable(product);
        return true;
    });

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <div className="w-full p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Products</h1>
                {/* Filter Tabs */}
                <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-xl self-start md:self-auto">
                    <button
                        onClick={() => setFilter("all")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            filter === "all"
                                ? "bg-white text-amber-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        All ({products.length})
                    </button>
                    <button
                        onClick={() => setFilter("available")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            filter === "available"
                                ? "bg-white text-amber-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Available ({products.filter(isAvailable).length})
                    </button>
                    <button
                        onClick={() => setFilter("unavailable")}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                            filter === "unavailable"
                                ? "bg-white text-amber-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                        }`}
                    >
                        Unavailable ({products.filter((p) => !isAvailable(p)).length})
                    </button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center text-gray-500 py-12 bg-white rounded-2xl border border-gray-100">
                    No products found for this filter.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => {
                        const available = isAvailable(product);
                        return (
                            <div
                                key={product.productId}
                                className={`bg-white border rounded-xl shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between relative overflow-hidden ${
                                    available ? "border-gray-200" : "border-gray-200 bg-gray-50/50 opacity-80"
                                }`}
                            >
                                {/* Availability Badge */}
                                <div className="absolute top-6 right-6 z-10">
                                    <span
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${
                                            available
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {available ? "Available" : "Unavailable"}
                                    </span>
                                </div>

                                <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden mb-4 flex items-center justify-center relative">
                                    {product.images?.[0] ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.name}
                                            className={`w-full h-full object-cover ${
                                                !available ? "grayscale brightness-90" : ""
                                            }`}
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">No Image</span>
                                    )}
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                                <div className="flex items-baseline gap-2 mb-4">
                                    <span className="text-xl font-bold text-amber-600">
                                        LKR {product.price?.toLocaleString()}
                                    </span>
                                    {product.labelledPrice > product.price && (
                                        <span className="text-sm text-gray-400 line-through">
                                            LKR {product.labelledPrice?.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <Link
                                    to={`/overview/${product.productId}`}
                                    className={`w-full text-center font-medium py-2.5 rounded-lg transition-colors ${
                                        available
                                            ? "bg-amber-600 hover:bg-amber-700 text-white"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                    }`}
                                >
                                    {available ? "View Details" : "View Out of Stock"}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
