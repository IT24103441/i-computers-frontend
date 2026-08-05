import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductsPage from "./productsPage";
import ProductOverview from "./productOverview";
import CartPage from "./cartPage";
import CheckoutPage from "./checkout";
import MyOrders from "./myOrders";
import Settings from "./settings";
export default function HomePage() {
    return (
        <div className="w-full min-h-screen bg-primary text-secondary">
            <Header />
            <div className="w-full min-h-[calc(100vh-100px)]">
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
                    {/* cart */}
                    <Route path="/cart" element={<CartPage />} />
                    {/* checkout */}
                    <Route path="/checkout" element={<CheckoutPage />} />
                    {/* my-orders */}
                    <Route path="/my-orders" element={<MyOrders />} />
                    {/* settings */}
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </div>
        </div>
    );
}