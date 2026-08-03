import { useEffect, useState } from "react";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import ProductCard from "../components/productCard";

export default function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            api.get("/products")
                .then((response) => {
                    setProducts(response.data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                    setLoading(false);
                });
        }
    }, [loading]);
    return (
        <div className="w-full min-h-screen bg-primary flex justify-center items-center gap-6 flex-wrap p-4 sm:p-8 lg:p-12 pb-28 lg:pb-12 max-w-7xl mx-auto">
            {
                loading && <LoadingScreen />
            }
            {
                !loading && <>
                    {
                        products.map((product, index) => {
                            return (
                                <ProductCard key={product.productId || product._id || product.id || index} product={product} />
                            )
                        })
                    }
                </>
            }
        </div>
    )
}