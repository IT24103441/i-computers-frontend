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
        <div className="w-full h-full flex justify-center items-center">
            <div className="w-full h-auto lg:h-full pt-10 lg:pt-0 flex flex-col lg:flex-row justify-center items-center">
                <ProductImageSlideShow images={product.images} />
            </div>

            <div className="w-[200px] lg:w-[600px] h-[250px] lg:h-[150px]  flex flex-col p-6 h-full">
                <span className="text-gray-500 text-sm italic mb-4">
                    {product.productId}
                </span>
                <span className="text-gray-500 text-sm italic mb-4">
                    {product.stock === 0 ? "Out of Stock" : "In Stock"}
                </span>

                {(product.brand || product.model) && (
                    <p className="text-gray-500 text-sm italic mb-4">
                        {`${product.brand || ""} ${product.model || ""}`.trim()}
                    </p>
                )}

                <h1 className="text-3xl font-semibold mb-6">
                    {product.name}
                    {Array.isArray(product.altNames) &&
                        product.altNames.map((altName, index) => (
                            <span key={index} className="text-gray-500">
                                {" | " + altName}
                            </span>
                        ))}
                </h1>

                {Number(product.labelledPrice ?? product.labeledPrice) >
                    Number(product.price) && (
                        <p className="text-gray-500 text-lg line-through mb-2">
                            {getFormattedPrice(
                                product.labelledPrice ?? product.labeledPrice
                            )}
                        </p>
                    )}

                <p className="text-xl text-accent font-semibold">
                    {getFormattedPrice(product.price)}
                </p>

                <p className="text-gray-700 mt-6">{product.description}</p>

                <div className="flex">
                    <button
                        className="w-[220px] p-2 text-white bg-accent rounded-sm hover:bg-accent/90 mt-6"
                        onClick={() => {
                            addToCart(product, 1);
                            toast.success("Product added to cart");
                        }}
                    >
                        Add to Cart
                    </button>

                    <Link
                        className="w-[220px] p-2 text-gray-700 bg-gray-300 rounded-sm hover:bg-gray-400 mt-6 ml-4 text-center"
                        to="/checkout"
                        state={[
                            {
                                product: {
                                    productId: product.productId,
                                    name: product.name,
                                    image: product.images?.[0],
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