import { Link } from "react-router-dom";
import { BiCart } from "react-icons/bi";
import UserData from "./userData";
import { IoCartOutline, IoCubeOutline, IoHomeOutline } from "react-icons/io5";
import { CiPhone } from "react-icons/ci";
export default function Header() {
    return (
        <>
            <header className="w-full h-[100px] bg-accent flex justify-center lg:justify-between p-6">
                <div className=" h-full hidden lg:flex justify-center items-center gap-4">
                    <Link to="/" className="h-full flex justify-center items-center text-white hover:text-gray-300">Home</Link>
                    <Link to="/products" className="h-full flex justify-center items-center text-white hover:text-gray-300">Products</Link>
                    <Link to="/contact-us" className="h-full flex justify-center items-center text-white hover:text-gray-300">Contact Us</Link>
                </div>
                <div className="justify-center items-center gap-4 hidden lg:flex">
                    <Link to="/cart" className="h-full flex justify-center items-center text-white hover:text-gray-500 px-4">
                        <BiCart size={24} />
                    </Link>
                    <UserData />
                </div>
            </header>
            <div className="fixed bottom-0 left-0 w-full h-[80px] bg-white shadow-2xl flex lg:hidden justify-evenly items-center">
                <Link to="/" className="h-full flex flex-col justify-center items-center text-accent text-3xl  ">
                    <IoHomeOutline />
                    <span className="text-sm text-accent">Home</span>
                </Link>
                <Link to="/products" className="h-full flex flex-col justify-center items-center text-accent text-3xl  ">
                    <IoCubeOutline />
                    <span className="text-sm text-accent">Products</span>
                </Link>
                <Link to="/contact-us" className="h-full flex flex-col justify-center items-center text-accent text-3xl  ">
                    <CiPhone />
                    <span className="text-sm text-accent">Contact Us</span>
                </Link>
                <UserData />
            </div>

        </>
    )
}