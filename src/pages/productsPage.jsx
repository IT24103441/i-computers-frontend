import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import ProductCard from "../components/productCard";
import getFormattedPrice from "../utils/price-formatter";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BiSearch, BiX } from "react-icons/bi";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const searchContainerRef = useRef(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const categoryParam = searchParams.get("category");

    useEffect(() => {
        if (loading) {
            api.get("/products")
                .then((response) => {
                    const data = Array.isArray(response.data) ? response.data : [];
                    setProducts(data);
                    setAllProducts(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                    setProducts([]);
                    setAllProducts([]);
                    setLoading(false);
                });
        }
    }, [loading]);

    // Handle URL category query parameter filtering
    useEffect(() => {
        if (categoryParam && allProducts.length > 0) {
            setQuery(categoryParam);
            const catLower = categoryParam.toLowerCase();
            const filtered = allProducts.filter((p) => {
                const cat = p.category?.toLowerCase() || "";
                const name = p.name?.toLowerCase() || "";
                const desc = p.description?.toLowerCase() || "";
                return cat.includes(catLower) || name.includes(catLower) || desc.includes(catLower);
            });
            setProducts(filtered);
        } else if (!categoryParam && allProducts.length > 0 && !query) {
            setProducts(allProducts);
        }
    }, [categoryParam, allProducts]);

    // Handle suggestions filtering when query changes
    useEffect(() => {
        const trimmedQuery = query.trim().toLowerCase();
        if (trimmedQuery.length > 0) {
            const matches = allProducts.filter((product) => {
                const name = product.name?.toLowerCase() || "";
                const category = product.category?.toLowerCase() || "";
                const description = product.description?.toLowerCase() || "";
                return (
                    name.includes(trimmedQuery) ||
                    category.includes(trimmedQuery) ||
                    description.includes(trimmedQuery)
                );
            });
            setSuggestions(matches);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [query, allProducts]);

    // Close suggestions dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function searchProducts(searchQuery = query) {
        setShowSuggestions(false);
        if (!searchQuery.trim()) {
            setLoading(true);
            return;
        }
        setSearching(true);
        api.get("products/search/" + searchQuery)
            .then((response) => {
                setProducts(Array.isArray(response.data) ? response.data : []);
                setSearching(false);
            })
            .catch((error) => {
                console.error("Error searching products:", error);
                const filtered = allProducts.filter((product) =>
                    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setProducts(filtered);
                setSearching(false);
            });
    }

    function handleSelectSuggestion(product) {
        setShowSuggestions(false);
        navigate(`/overview/${product.productId}`);
    }

    return (
        <div className="w-full min-h-screen bg-primary flex flex-col items-center p-4 sm:p-8 lg:p-12 pb-28 lg:pb-12 max-w-7xl mx-auto">
            {loading && <LoadingScreen />}
            {searching && <LoadingScreen />}

            {/* Search Panel Container */}
            <div className="w-full flex justify-center mb-8 relative z-30">
                <div
                    ref={searchContainerRef}
                    className="w-full max-w-2xl relative flex flex-col sm:flex-row items-center gap-3 bg-white p-2.5 rounded-2xl shadow-lg border border-gray-100"
                >
                    {/* Search Input Field */}
                    <div className="relative flex-1 w-full flex items-center">
                        <BiSearch className="absolute left-3 text-gray-400 text-xl pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search by product name, category..."
                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all text-sm"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onFocus={() => {
                                if (query.trim().length > 0) setShowSuggestions(true);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    searchProducts();
                                }
                                if (e.key === "Escape") {
                                    setShowSuggestions(false);
                                }
                            }}
                        />
                        {query && (
                            <button
                                onClick={() => {
                                    setQuery("");
                                    setShowSuggestions(false);
                                }}
                                className="absolute right-3 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <BiX size={20} />
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                            onClick={() => searchProducts()}
                            disabled={searching}
                            className="px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 active:scale-95 transition-all text-sm shadow-md disabled:opacity-50"
                        >
                            {searching ? "Searching..." : "Search"}
                        </button>
                        <button
                            onClick={() => {
                                setQuery("");
                                setShowSuggestions(false);
                                setLoading(true);
                            }}
                            className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all text-sm"
                        >
                            All Products
                        </button>
                    </div>

                    {/* Search Suggestions Panel Dropdown */}
                    {showSuggestions && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-3 bg-amber-50/60 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
                                <span>Search Suggestions</span>
                                <span>{suggestions.length} match{suggestions.length !== 1 ? "es" : ""}</span>
                            </div>

                            {suggestions.length > 0 ? (
                                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                                    {suggestions.slice(0, 6).map((product) => (
                                        <div
                                            key={product.productId || product._id || product.id}
                                            onClick={() => handleSelectSuggestion(product)}
                                            className="p-3 flex items-center gap-3 hover:bg-amber-50/50 cursor-pointer transition-colors group"
                                        >
                                            <div className="w-12 h-12 rounded-lg bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                                                {product.images?.[0] || product.image ? (
                                                    <img
                                                        src={product.images?.[0] || product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px]">
                                                        No Image
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-800 group-hover:text-amber-600 text-sm truncate transition-colors">
                                                    {product.name}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    {product.category && (
                                                        <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                                            {product.category}
                                                        </span>
                                                    )}
                                                    <span className="text-xs font-bold text-amber-600">
                                                        {getFormattedPrice(product.price)}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-medium text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                View →
                                            </span>
                                        </div>
                                    ))}
                                    {suggestions.length > 6 && (
                                        <button
                                            onClick={() => searchProducts()}
                                            className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-amber-600 font-semibold text-xs text-center transition-colors border-t border-gray-100"
                                        >
                                            View all {suggestions.length} results
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="p-6 text-center text-gray-400 text-sm">
                                    No products found matching "<span className="font-semibold text-gray-600">{query}</span>"
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Product Grid */}
            <div className="w-full flex justify-center items-center gap-6 flex-wrap">
                {!loading && products.length === 0 ? (
                    <div className="w-full bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
                        <p className="text-gray-500 text-lg">No products found matching your search.</p>
                        <button
                            onClick={() => {
                                setQuery("");
                                setLoading(true);
                            }}
                            className="mt-4 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                        >
                            View All Products
                        </button>
                    </div>
                ) : (
                    !loading &&
                    products.map((product, index) => (
                        <ProductCard
                            key={product.productId || product._id || product.id || index}
                            product={product}
                        />
                    ))
                )}
            </div>
        </div>
    );
}