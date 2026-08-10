import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import ProductDeleteButton from "../../components/productDeleteButton";

export default function AdminProductsPage() {
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
    const outOfStockCount = products.filter(p => p.stock === 0 || p.isAvailable === false || p.isAvailable === "false").length;

    const filteredProducts = products.filter((p) => {
        const isAvail = p.isAvailable === true || p.isAvailable === "true";
        const isOutOfStock = p.stock === 0 || !isAvail;
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
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all shadow-sm text-sm"
                    />
                </div>

                <Link
                    to="/admin/products/add"
                    className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
                >
                    <FaPlus />
                    <span>Add Product</span>
                </Link>
            </div>

            {/* Filter Tabs & Inventory Stats */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
                    {["all", "In Stock", "Low Stock", "Out of Stock"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                                activeFilter === tab
                                    ? "bg-amber-600 text-white shadow-md"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                    <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
                        Total: <strong>{products.length}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
                        In Stock: <strong>{inStockCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200">
                        Low Stock (≤5): <strong>{lowStockCount}</strong>
                    </span>
                    <span className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 border border-red-200">
                        Out of Stock: <strong>{outOfStockCount}</strong>
                    </span>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.productId} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden border border-gray-100">
                                                {product.images?.[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-gray-400 text-xs">No img</span>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 group-hover:text-amber-600 transition-colors">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.productId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">LKR {Number(product.price).toLocaleString()}</div>
                                        {(Number(product.labelledPrice ?? product.labeledPrice) > Number(product.price)) && (
                                            <div className="text-xs text-gray-400 line-through">LKR {Number(product.labelledPrice ?? product.labeledPrice).toLocaleString()}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs font-bold ${
                                                product.stock === 0 ? "text-red-600" : product.stock <= 5 ? "text-amber-600" : "text-gray-900"
                                            }`}>
                                                {product.stock} units
                                            </span>
                                            {product.stock > 0 && product.stock <= 5 && (
                                                <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider animate-pulse">
                                                    Low Stock
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {(() => {
                                            const avail = product.isAvailable === true || product.isAvailable === "true";
                                            const isOut = !avail || product.stock === 0;
                                            const isLow = avail && product.stock > 0 && product.stock <= 5;
                                            return (
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                                                    isOut
                                                        ? 'bg-red-100 text-red-800 border border-red-200'
                                                        : isLow
                                                            ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                                }`}>
                                                    {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                                                </span>
                                            );
                                        })()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end items-center gap-3">
                                            <Link
                                                className="p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
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
                    <div className="p-12 text-center text-gray-500 text-sm">
                        No products found matching the selected filter ({activeFilter}).
                    </div>
                )}
            </div>
        </div>
    );
}