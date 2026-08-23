import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import ProductDeleteButton from "../../components/productDeleteButton";

export default function AdminProductsPage({ isDarkMode = false }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            const res = await api.get("/products", {
                headers: token ? { Authorization: `Bearer ${token}` } : {}
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Failed to load products:", err);
            toast.error(err?.response?.data?.message || "Failed to load products");
        } finally {
            setIsLoading(false);
        }
    };

    const inStockCount = products.filter(p => p.stock > 5 && (p.isAvailable === true || p.isAvailable === "true")).length;
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 5 && (p.isAvailable === true || p.isAvailable === "true")).length;
    const outOfStockCount = products.filter(p => (p.stock ?? 0) <= 0 || p.isAvailable === false || p.isAvailable === "false").length;

    const filteredProducts = products.filter((p) => {
        const isAvail = p.isAvailable === true || p.isAvailable === "true";
        const isOutOfStock = (p.stock ?? 0) <= 0 || !isAvail;
        const isLowStock = p.stock > 0 && p.stock <= 5 && isAvail;
        const isInStock = p.stock > 5 && isAvail;

        const matchesFilter = activeFilter === "all" ||
            (activeFilter === "In Stock" && isInStock) ||
            (activeFilter === "Low Stock" && isLowStock) ||
            (activeFilter === "Out of Stock" && isOutOfStock);

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q ||
            (p.name || "").toLowerCase().includes(q) ||
            (p.productId || "").toLowerCase().includes(q) ||
            (p.category || "").toLowerCase().includes(q);

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
            {isLoading && <LoadingScreen />}

            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search product name, ID, category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all shadow-sm text-sm ${
                            isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800'
                        }`}
                    />
                </div>

                <Link
                    to="/admin/products/add"
                    className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:bg-amber-700 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                    <FaPlus />
                    <span>Add Product</span>
                </Link>
            </div>

            {/* Filter Tabs & Inventory Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border transition-colors ${
                    isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
                }`}>
                    {["all", "In Stock", "Low Stock", "Out of Stock"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${activeFilter === tab
                                ? "bg-amber-600 text-white shadow-md font-bold"
                                : isDarkMode
                                    ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        Total: <strong>{products.length}</strong>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                        In Stock: <strong>{inStockCount}</strong>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        Low Stock (≤5): <strong>{lowStockCount}</strong>
                    </span>
                    <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        Out of Stock: <strong>{outOfStockCount}</strong>
                    </span>
                </div>
            </div>

            {/* Products Table */}
            <div className={`w-full rounded-2xl border transition-colors overflow-hidden ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 text-slate-800 shadow-sm'
            }`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className={`border-b text-xs font-bold uppercase tracking-wider ${
                                isDarkMode ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-gray-50/50 border-gray-100 text-gray-500'
                            }`}>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Stock</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-slate-800 text-slate-200' : 'divide-gray-100 text-gray-700'}`}>
                            {filteredProducts.map((product) => (
                                <tr key={product.productId} className={`transition-colors group ${
                                    isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-gray-50/50'
                                }`}>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden border ${
                                                isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-100 border-gray-100'
                                            }`}>
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>No img</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className={`font-bold transition-colors ${
                                                    isDarkMode ? 'text-slate-100 group-hover:text-amber-400' : 'text-gray-900 group-hover:text-amber-600'
                                                }`}>{product.name}</div>
                                                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{product.productId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            isDarkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-700'
                                        }`}>
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>LKR {Number(product.price).toLocaleString()}</div>
                                        {(Number(product.labelledPrice ?? product.labeledPrice) > Number(product.price)) && (
                                            <div className={`text-xs line-through ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>LKR {Number(product.labelledPrice ?? product.labeledPrice).toLocaleString()}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${
                                                product.stock <= 0 ? "text-red-500" : product.stock <= 5 ? "text-amber-500" : isDarkMode ? "text-slate-200" : "text-gray-900"
                                            }`}>
                                                {product.stock} units
                                            </span>
                                            {product.stock > 0 && product.stock <= 5 && (
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider animate-pulse ${
                                                    isDarkMode ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                    Low Stock
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const avail = product.isAvailable === true || product.isAvailable === "true";
                                            const isOut = !avail || (product.stock ?? 0) <= 0;
                                            const isLow = avail && product.stock > 0 && product.stock <= 5;
                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    isOut
                                                        ? isDarkMode ? 'bg-red-500/10 text-red-400 border border-red-500/30' : 'bg-red-100 text-red-800 border border-red-200'
                                                        : isLow
                                                            ? isDarkMode ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                            : isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                }`}>
                                                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <Link
                                                className={`p-2 rounded-lg transition-all ${
                                                    isDarkMode ? 'text-slate-400 hover:text-amber-400 hover:bg-slate-800' : 'text-gray-400 hover:text-amber-600 hover:bg-amber-50'
                                                }`}
                                                title="Edit"
                                                to={`/admin/products/edit/${product.productId}`}
                                                state={product}
                                            >
                                                <FaEdit size={18} />
                                            </Link>
                                            <ProductDeleteButton productId={product.productId} refresh={fetchProducts} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className={`p-12 text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                        No products found matching the selected filter ({activeFilter}).
                    </div>
                )}
            </div>
        </div>
    );
}