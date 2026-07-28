import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import api from "../utils/api"
import LoadingScreen from "../components/loadingScreen"
import ProductImageSlideShow from "../components/productImageSlideShow"
import getFormattedPrice from "../utils/price-formatter"

export default function ProductOverview() {
    const parameters = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)

    useEffect(() => {

        if (parameters.productId == null) {
            navigate("/products")
        }
        api.get("/products/" + parameters.productId).then((response) => {
            setProduct(response.data)
        }).catch((error) => {
            console.error("Error fetching product details:", error)
            navigate("/products")
        })

    }, [])


    return (
        <div className="w-full h-full flex justify-center items-center">
            {
                product == null && <LoadingScreen />
            }
            {
                product != null && <>

                    <div className="w-1/2  h-full flex justify-center items-center">
                        <ProductImageSlideShow images={product.images} />
                    </div>
                    <div className="w-1/2  flex flex-col p-6 h-full">
                        <span className="text-gray-500 text-sm italic mb-4">{product.productId}</span>
                        {/* brand and model */}
                        {(product.brand || product.model) && (
                            <p className="text-gray-500 text-sm italic mb-4">
                                {((product.brand || "") + " " + (product.model || "")).trim()}
                            </p>
                        )}
                        <h1 className="text-3xl font-semibold mb-6">{product.name}
                            {
                                Array.isArray(product.altNames) && product.altNames.map(
                                    (altName, index) => {
                                        return (
                                            <span key={index} className=" text-gray-500 ">{" | " + altName}</span>
                                        )
                                    }
                                )
                            }
                        </h1>
                        {
                            (Number(product.labelledPrice ?? product.labeledPrice) > Number(product.price)) && (
                                <p className="text-gray-500 text-lg line-through mb-2">
                                    {getFormattedPrice(product.labelledPrice ?? product.labeledPrice)}
                                </p>
                            )
                        }
                        <p className="text-xl text-accent font-semibold ">{getFormattedPrice(product.price)}</p>
                        <p className="text-gray-700 mt-6">{product.description}</p>
                        <div className="flex">
                            <button className="w-[220px] p-2 text-white bg-accent rounded-sm hover:bg-accent/90 mt-6">Add to Cart</button>
                            <button className="w-[220px] p-2 text-gray-700 bg-gray-300 rounded-sm hover:bg-gray-400 mt-6 ml-4">Buy Now</button>
                        </div>
                    </div>

                </>
            }
        </div>
    )
}