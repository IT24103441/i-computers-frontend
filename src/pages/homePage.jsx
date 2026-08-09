import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import HomeLanding from "./homeLanding";
import ProductsPage from "./productsPage";
import ProductOverview from "./productOverview";
import CartPage from "./cartPage";
import CheckoutPage from "./checkout";
import MyOrders from "./myOrders";
import Settings from "./settings";
import ContactUsPage from "./contactUsPage";

export default function HomePage() {
    return (
        <div className="w-full min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">
            <div>
                <Header />
                <div className="w-full min-h-[calc(100vh-100px)]">
                    <Routes>
                        <Route path="/" element={<HomeLanding />} />
                        {/* products */}
                        <Route path="/products" element={<ProductsPage />} />
                        {/* contact-us */}
                        <Route path="/contact-us" element={<ContactUsPage />} />
                        {/* about-us */}
                        <Route path="/about-us" element={<div className="p-12 text-center text-xl font-semibold">About Us Page</div>} />
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
                        <Route path="/*" element={<div className="p-12 text-center text-xl font-semibold">404 Not Found</div>} />
                    </Routes>
                </div>
            </div>
            <Footer />
        </div>
    );
}