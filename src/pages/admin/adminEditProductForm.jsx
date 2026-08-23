import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import uploadMedia from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function AdminEditProductForm({ isDarkMode = false }) {
    const location = useLocation();
    const params = useParams();
    const navigate = useNavigate();

    const productData = location.state || {};

    const [productId, setProductId] = useState(productData.productId || params.productId || "");
    const [name, setName] = useState(productData.name || "");
    const [altNames, setAltNames] = useState(
        Array.isArray(productData.altNames) ? productData.altNames.join(",") : (productData.altNames || "")
    );
    const [description, setDescription] = useState(productData.description || "");
    const [price, setPrice] = useState(productData.price ?? "");
    const [labelledPrice, setLabelledPrice] = useState(productData.labelledPrice ?? "");
    const [images, setImages] = useState(productData.images || []);
    const [isAvailable, setIsAvailable] = useState(productData.isAvailable ?? true);
    const [category, setCategory] = useState(productData.category || "");
    const [stock, setStock] = useState(productData.stock ?? 0);
    const [brand, setBrand] = useState(productData.brand || "");
    const [model, setModel] = useState(productData.model || "");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const targetId = params.productId || productId;
        if (!location.state && targetId) {
            setIsLoading(true);
            api.get("/products/" + targetId)
                .then((res) => {
                    const prod = res.data;
                    if (prod) {
                        setProductId(prod.productId || targetId);
                        setName(prod.name || "");
                        setAltNames(Array.isArray(prod.altNames) ? prod.altNames.join(",") : (prod.altNames || ""));
                        setDescription(prod.description || "");
                        setPrice(prod.price ?? "");
                        setLabelledPrice(prod.labelledPrice ?? "");
                        setImages(prod.images || []);
                        setIsAvailable(prod.isAvailable ?? true);
                        setCategory(prod.category || "");
                        setStock(prod.stock ?? 0);
                        setBrand(prod.brand || "");
                        setModel(prod.model || "");
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch product details:", error);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [location.state, params.productId, productId]);

    async function editProduct() {
        setIsLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
            toast.error("You must be logged in to edit a product");
            navigate("/login");
            return;
        }

        try {
            let imageUrls = [];

            if (images && images.length > 0) {
                if (images[0] instanceof File) {
                    const imageUploadPromises = [];
                    for (let i = 0; i < images.length; i++) {
                        imageUploadPromises.push(uploadMedia(images[i]));
                    }
                    imageUrls = await Promise.all(imageUploadPromises);
                } else {
                    imageUrls = Array.isArray(images) ? images : Array.from(images);
                }
            }

            if ((!imageUrls || imageUrls.length === 0) && productData.images) {
                imageUrls = productData.images;
            }

            const altNamesArray = typeof altNames === "string"
                ? altNames.split(",").map(s => s.trim()).filter(Boolean)
                : (Array.isArray(altNames) ? altNames : []);

            const requestBody = {
                name: name,
                altNames: altNamesArray,
                description: description,
                price: Number(price) || 0,
                labelledPrice: Number(labelledPrice) || 0,
                images: imageUrls,
                isAvailable: Boolean(isAvailable),
                category: category,
                stock: Number(stock) || 0,
                brand: brand,
                model: model
            };

            const config = {
                headers: {
                    Authorization: "Bearer " + token
                }
            };

            try {
                await api.put("/products/" + productId, requestBody, config);
            } catch (putErr) {
                if (putErr?.response?.status === 404 || putErr?.response?.status === 405) {
                    await api.put("/products", { productId, ...requestBody }, config);
                } else {
                    throw putErr;
                }
            }

            toast.success("Product updated successfully");
            navigate("/admin/products");
        } catch (error) {
            console.error("Edit product error:", error);
            toast.error(error?.response?.data?.message || "Failed to update product");
        } finally {
            setIsLoading(false);
        }
    }

    const inputClasses = `w-full h-11 border rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all ${
        isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800'
    }`;

    const labelClasses = `text-sm font-semibold ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`;
    const optionClasses = isDarkMode ? "bg-slate-900 text-white" : "bg-white text-gray-800";

    return (
        <div className="w-full h-full flex items-center flex-col">
            {/* Top Bar */}
            <div className={`w-full h-[100px] border rounded-xl flex p-6 items-center justify-between mb-6 transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-md' : 'bg-white border-gray-100 text-gray-800 shadow-md'
            }`}>
                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-slate-100' : 'text-gray-800'}`}>Edit Product</h1>
                <div className="flex items-center gap-4">
                    <Link
                        to="/admin/products"
                        className={`px-6 py-2.5 rounded-lg border font-medium transition-colors ${
                            isDarkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        Cancel
                    </Link>

                    <button
                        disabled={isLoading}
                        className="px-6 py-2.5 rounded-lg bg-amber-600 text-white font-medium shadow-lg shadow-amber-500/20 hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={editProduct}
                    >
                        {isLoading ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </div>

            {/* Main Form Container */}
            <div className={`w-full rounded-xl border p-8 transition-colors ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100 shadow-md' : 'bg-white border-gray-100 text-gray-800 shadow-sm'
            }`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Product ID */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Product ID</label>
                        <input
                            disabled
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className={`w-full h-11 border rounded-lg px-4 outline-none transition-all cursor-not-allowed ${
                                isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-400' : 'bg-gray-100 border-gray-200 text-gray-500'
                            }`}
                            placeholder="PD-001"
                        />
                    </div>

                    {/* Product Name */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Product Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClasses}
                            placeholder="Nvidia RTX 5090"
                        />
                    </div>

                    {/* Alternative Names */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className={labelClasses}>
                            Alternative Names <span className={`font-normal text-xs ml-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>(comma-separated)</span>
                        </label>
                        <input
                            value={altNames}
                            onChange={(e) => setAltNames(e.target.value)}
                            className={inputClasses}
                            placeholder="VGA, Graphic Card, GPU"
                        />
                    </div>

                    {/* Price */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Price</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={inputClasses}
                            placeholder="0.00"
                        />
                    </div>

                    {/* Labelled Price */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Labelled Price</label>
                        <input
                            type="number"
                            value={labelledPrice}
                            onChange={(e) => setLabelledPrice(e.target.value)}
                            className={inputClasses}
                            placeholder="0.00"
                        />
                    </div>

                    {/* Stock */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Stock</label>
                        <input
                            type="number"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                            className={inputClasses}
                            placeholder="0"
                        />
                    </div>

                    {/* Availability */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Availability</label>
                        <select
                            value={isAvailable}
                            onChange={(e) => { setIsAvailable(e.target.value === 'true') }}
                            className={inputClasses}
                        >
                            <option value={true} className={optionClasses}>Available</option>
                            <option value={false} className={optionClasses}>Unavailable</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>Category</label>
                        <select
                            value={category}
                            onChange={(e) => { setCategory(e.target.value) }}
                            className={inputClasses}
                        >
                            <option value="" className={optionClasses}>Select Category</option>
                            <option value="graphic card" className={optionClasses}>Graphics Card</option>
                            <option value="motherboard" className={optionClasses}>Motherboard</option>
                            <option value="cpu" className={optionClasses}>CPU</option>
                            <option value="ram" className={optionClasses}>RAM</option>
                            <option value="storage" className={optionClasses}>Storage</option>
                            <option value="power supply" className={optionClasses}>Power Supply</option>
                            <option value="case" className={optionClasses}>Case</option>
                            <option value="cooling" className={optionClasses}>Cooling</option>
                            <option value="peripherals" className={optionClasses}>Peripherals</option>
                            <option value="keyboards" className={optionClasses}>Keyboards</option>
                            <option value="mouse" className={optionClasses}>Mouse</option>
                            <option value="laptops" className={optionClasses}>Laptops</option>
                            <option value="others" className={optionClasses}>Others</option>
                        </select>
                    </div>

                    {/* Brand */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>
                            Brand <span className={`font-normal text-xs ml-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>(optional)</span>
                        </label>
                        <select
                            value={brand}
                            onChange={(e) => { setBrand(e.target.value) }}
                            className={inputClasses}
                        >
                            <option value="" className={optionClasses}>No brand</option>
                            <option value="nvidia" className={optionClasses}>NVIDIA</option>
                            <option value="amd" className={optionClasses}>AMD</option>
                            <option value="intel" className={optionClasses}>Intel</option>
                            <option value="asus" className={optionClasses}>ASUS</option>
                            <option value="msi" className={optionClasses}>MSI</option>
                            <option value="gigabyte" className={optionClasses}>Gigabyte</option>
                            <option value="corsair" className={optionClasses}>Corsair</option>
                            <option value="cooler master" className={optionClasses}>Cooler Master</option>
                            <option value="logitech" className={optionClasses}>Logitech</option>
                            <option value="razer" className={optionClasses}>Razer</option>
                            <option value="dell" className={optionClasses}>Dell</option>
                            <option value="hp" className={optionClasses}>HP</option>
                            <option value="lenovo" className={optionClasses}>Lenovo</option>
                            <option value="apple" className={optionClasses}>Apple</option>
                            <option value="red dragon" className={optionClasses}>Red Dragon</option>
                        </select>
                    </div>

                    {/* Model */}
                    <div className="flex flex-col gap-2">
                        <label className={labelClasses}>
                            Model <span className={`font-normal text-xs ml-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>(optional)</span>
                        </label>
                        <input
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className={inputClasses}
                            placeholder="RTX 5090"
                        />
                    </div>

                    {/* Images */}
                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className={labelClasses}>Images</label>
                        <input
                            multiple={true}
                            onChange={(e) => { setImages(e.target.files) }}
                            type="file"
                            className={`w-full h-11 border rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all ${
                                isDarkMode
                                    ? 'bg-slate-800 border-slate-700 text-slate-200 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-500/10 file:text-amber-400 hover:file:bg-amber-500/20'
                                    : 'bg-white border-gray-200 text-gray-800 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100'
                            }`}
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-4 flex flex-col gap-2">
                        <label className={labelClasses}>Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`w-full h-32 border rounded-lg p-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none ${
                                isDarkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-white border-gray-200 text-gray-800'
                            }`}
                            placeholder="Enter detailed product description..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}