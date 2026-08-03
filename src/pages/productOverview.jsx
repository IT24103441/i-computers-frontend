import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import ProductImageSlideShow from "../components/productImageSlideShow";
import getFormattedPrice from "../utils/price-formatter";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";

export default function ProductOverview() {
    const parameters = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!parameters.productId) {
            navigate("/products");
            return;
        }

        api.get("/products/" + parameters.productId)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
                navigate("/products");
            });
    }, [parameters.productId, navigate]);

    if (product === null) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <LoadingScreen />
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 sm:p-8 lg:p-12 pb-28 lg:pb-12 flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8 max-w-6xl mx-auto">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
                <ProductImageSlideShow images={product.images} />
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-1/2 flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-gray-400 text-xs font-mono">
                        ID: {product.productId}
                    </span>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${product.stock === 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {product.stock === 0 ? "Out of Stock" : "In Stock"}
                    </span>
                </div>

                {(product.brand || product.model) && (
                    <p className="text-amber-600 font-medium text-sm mb-1">
                        {`${product.brand || ""} ${product.model || ""}`.trim()}
                    </p>
                )}

                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                    {product.name}
                    {Array.isArray(product.altNames) &&
                        product.altNames.map((altName, index) => (
                            <span key={index} className="text-gray-400 font-normal text-lg">
                                {" | " + altName}
                            </span>
                        ))}
                </h1>

                <div className="flex items-baseline gap-3 mb-4">
                    <p className="text-2xl sm:text-3xl text-amber-600 font-bold">
                        {getFormattedPrice(product.price)}
                    </p>
                    {Number(product.labelledPrice ?? product.labeledPrice) > Number(product.price) && (
                        <p className="text-gray-400 text-base line-through">
                            {getFormattedPrice(
                                product.labelledPrice ?? product.labeledPrice
                            )}
                        </p>
                    )}
                </div>

                <div className="border-t border-gray-100 pt-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
                    <button
                        className="w-full sm:w-1/2 py-3 px-6 text-white bg-amber-600 font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-[0.98]"
                        onClick={() => {
                            addToCart(product, 1);
                            toast.success("Product added to cart");
                        }}
                    >
                        Add to Cart
                    </button>

                    <Link
                        className="w-full sm:w-1/2 py-3 px-6 text-gray-800 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-center flex items-center justify-center active:scale-[0.98]"
                        to="/checkout"
                        state={[
                            {
                                product: {
                                    productId: product.productId,
                                    name: product.name,
                                    image: product.images?.[0] || product.image,
                                    price: product.price,
                                    labelledPrice:
                                        product.labelledPrice ??
                                        product.labeledPrice,
                                },
                                qty: 1,
                            },
                        ]}
                    >
                        Buy Now
                    </Link>
                </div>
            </div>
        </div>
    );
}