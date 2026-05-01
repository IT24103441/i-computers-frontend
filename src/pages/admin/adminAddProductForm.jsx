import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminAddProductForm() {

    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [labelledPrice, setLabelledPrice] = useState("");
    const [images, setImages] = useState([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");



    return (
        <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-500">
            {/* Header section */}
            <div className="w-full bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                    <p className="text-sm text-gray-500">Fill in the details to create a new product catalog entry.</p>
                </div>
                <div className="flex gap-4">
                    <Link to="/admin/products" className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all">
                        Cancel
                    </Link>
                    <button className="px-8 py-2.5 rounded-xl bg-amber-600 text-white font-bold shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all active:scale-95">
                        Save Product
                    </button>
                </div>
            </div>

            {/* Form section */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
                <div className="max-w-4xl grid grid-cols-2 gap-8">
                    {/* Basic Info */}
                    <div className="col-span-2 border-b border-gray-50 pb-2">
                        <h2 className="text-lg font-bold text-gray-800">Basic Information</h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Product ID</label>
                        <input 
                            value={productId} 
                            onChange={(e) => setProductId(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
                            placeholder="e.g. PD-001" 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Product Name</label>
                        <input 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
                            placeholder="e.g. NVIDIA RTX 5090" 
                        />
                    </div>

                    <div className="col-span-2 flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">
                            Alternative Names <span className="font-normal text-gray-400 italic">(comma-separated)</span>
                        </label>
                        <input 
                            value={altNames} 
                            onChange={(e) => setAltNames(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
                            placeholder="VGA, Graphic Card, GPU" 
                        />
                    </div>

                    <div className="col-span-2 flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Description</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all min-h-[120px]" 
                            placeholder="Enter detailed product description..." 
                        />
                    </div>

                    {/* Pricing & Stock */}
                    <div className="col-span-2 border-b border-gray-50 pb-2 mt-4">
                        <h2 className="text-lg font-bold text-gray-800">Pricing & Inventory</h2>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Actual Price (LKR)</label>
                        <input 
                            type="number"
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
                            placeholder="0.00" 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Labelled Price (LKR)</label>
                        <input 
                            type="number"
                            value={labelledPrice} 
                            onChange={(e) => setLabelledPrice(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
                            placeholder="0.00" 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
                        <input 
                            type="number"
                            value={stock} 
                            onChange={(e) => setStock(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all" 
                            placeholder="0" 
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-bold text-gray-700">Category</label>
                        <select 
                            value={category} 
                            onChange={(e) => setCategory(e.target.value)} 
                            className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                        >
                            <option value="">Select Category</option>
                            <option value="electronics">Electronics</option>
                            <option value="pc-components">PC Components</option>
                            <option value="accessories">Accessories</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}