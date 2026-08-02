import { Link } from "react-router-dom";
import { BiCart } from "react-icons/bi";

export default function Header() {
    return (
        <header className="w-full h-[100px] bg-accent flex justify-between p-6">
            <div className=" h-full flex justify-center items-center gap-4">
                <Link to="/" className="h-full flex justify-center items-center text-white hover:text-gray-300">Home</Link>
                <Link to="/products" className="h-full flex justify-center items-center text-white hover:text-gray-300">Products</Link>
                <Link to="/contact-us" className="h-full flex justify-center items-center text-white hover:text-gray-300">Contact Us</Link>
            </div>
            <div className="">
                <Link to="/cart" className="h-full flex justify-center items-center text-white hover:text-gray-900 px-4">
                    <BiCart size={24} />
                </Link>

            </div>
        </header>
    )
}