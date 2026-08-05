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

    const filteredProducts = products.filter(p =>
        (p.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.productId || "").toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-full flex flex-col gap-6 animate-in fade-in duration-500">
            {isLoading && <LoadingScreen />}
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all shadow-sm"
                    />
                </div>

                <Link
                    to="/admin/products/add"
                    className="bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    <FaPlus />
                    <span>Add Product</span>
                </Link>
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
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {product.stock} units
                                    </td>
                                     <td className="px-6 py-4">
                                         {(() => {
                                             const avail = product.isAvailable === true || product.isAvailable === "true";
                                             return (
                                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${avail
                                                     ? 'bg-green-100 text-green-800'
                                                     : 'bg-red-100 text-red-800'
                                                     }`}>
                                                     {avail ? 'Available' : 'Out of Stock'}
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
                    <div className="p-12 text-center text-gray-500">
                        No products found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}