import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductsPage from "./productsPage";
import ProductOverview from "./productOverview";

export default function HomePage() {
    return (
        <div className="w-full h-full bg-primary text-secondary">
            <Header />
            <div className="h-[calc(100%-100px)] w-full ">
                <Routes>
                    <Route path="/" element={<h1>Home Page</h1>} />
                    {/* products */}
                    <Route path="/products" element={<ProductsPage />} />
                    {/* contact-us */}
                    <Route path="/contact-us" element={<h1>Contact Us Page</h1>} />
                    {/* about-us */}
                    <Route path="/about-us" element={<h1>About Us Page</h1>} />
                    {/* product-overview */}
                    <Route path="/overview/:productId" element={<ProductOverview />} />

                    <Route path="/*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </div>
        </div>
    );
}