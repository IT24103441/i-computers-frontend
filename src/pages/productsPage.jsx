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
        <div className="w-full bg-primary flex justify-center items-center gap-6 flex-wrap p-20">
            {
                loading && <LoadingScreen />
            }
            {
                !loading && <>
                    {
                        products.map((product) => {
                            return (
                                <ProductCard key={product.id} product={product} />
                            )
                        })
                    }
                </>
            }
        </div>
    )
}