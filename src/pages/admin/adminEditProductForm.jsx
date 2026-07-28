import { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import uploadMedia from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function AdminEditProductForm() {
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
    }, [location.state, params.productId]);

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

    return (
        <div className="w-full h-full flex items-center flex-col">
            <div className="w-full h-[100px] bg-white shadow-md rounded-xl flex p-6 items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                <div className="flex items-center gap-4">
                    <Link to="/admin/products" className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                        Cancel
                    </Link>

                    <button
                        disabled={isLoading}
                        className={`px-6 py-2.5 rounded-lg bg-amber-600 text-white font-medium shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                        onClick={editProduct}
                    >
                        {isLoading ? "Saving..." : "Save Product"}
                    </button>
                </div>
            </div>
            <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Product ID</label>
                        <input disabled value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full h-11 border border-gray-200 bg-gray-100 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all cursor-not-allowed" placeholder="PD-001" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Product Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="Nvidia RTX 5090" />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Alternative Names <span className="font-normal text-xs text-gray-400 ml-1">(comma-separated)</span></label>
                        <input value={altNames} onChange={(e) => setAltNames(e.target.value)} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="VGA, Graphic Card, GPU" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Price</label>
                        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="0.00" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Labelled Price</label>
                        <input type="number" value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="0.00" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Stock</label>
                        <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="0" />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Availability</label>
                        <select value={isAvailable} onChange={(e) => { setIsAvailable(e.target.value === 'true') }} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all">
                            <option value={true}>Available</option>
                            <option value={false}>Unavailable</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Category</label>
                        <select value={category} onChange={(e) => { setCategory(e.target.value) }} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all">
                            <option value="">Select Category</option>
                            <option value="graphic card">Graphics Card</option>
                            <option value="motherboard">Motherboard</option>
                            <option value="cpu">CPU</option>
                            <option value="ram">RAM</option>
                            <option value="storage">Storage</option>
                            <option value="power supply">Power Supply</option>
                            <option value="case">Case</option>
                            <option value="cooling">Cooling</option>
                            <option value="peripherals">Peripherals</option>
                            <option value="keyboards">Keyboards</option>
                            <option value="mouse">Mouse</option>
                            <option value="laptops">Laptops</option>
                            <option value="others">Others</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Brand <span className="font-normal text-xs text-gray-400 ml-1">(optional)</span></label>
                        <select value={brand} onChange={(e) => { setBrand(e.target.value) }} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all">
                            <option value="">No brand</option>
                            <option value="nvidia">NVIDIA</option>
                            <option value="amd">AMD</option>
                            <option value="intel">Intel</option>
                            <option value="asus">ASUS</option>
                            <option value="msi">MSI</option>
                            <option value="gigabyte">Gigabyte</option>
                            <option value="corsair">Corsair</option>
                            <option value="cooler master">Cooler Master</option>
                            <option value="logitech">Logitech</option>
                            <option value="razer">Razer</option>
                            <option value="dell">Dell</option>
                            <option value="hp">HP</option>
                            <option value="lenovo">Lenovo</option>
                            <option value="apple">Apple</option>
                            <option value="red dragon">Red Dragon</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Model <span className="font-normal text-xs text-gray-400 ml-1">(optional)</span></label>
                        <input value={model} onChange={(e) => setModel(e.target.value)} className="w-full h-11 border border-gray-200 rounded-lg px-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all" placeholder="RTX 5090" />
                    </div>

                    <div className="md:col-span-2 flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Images</label>
                        <input multiple={true} onChange={(e) => { setImages(e.target.files) }} type="file" className="w-full h-11 border border-gray-200 rounded-lg px-4 py-1.5 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                    </div>

                    <div className="md:col-span-4 flex flex-col gap-2">
                        <label className="text-sm font-semibold text-gray-700">Description</label>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-32 border border-gray-200 rounded-lg p-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none" placeholder="Enter detailed product description..." />
                    </div>
                </div>
            </div>
        </div>
    );
}