import { Link } from "react-router-dom";
import { BiCart, BiEnvelope, BiMap, BiPhone, BiRightArrowAlt } from "react-icons/bi";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-slate-900 text-gray-300 pt-12 pb-24 lg:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex justify-center items-center text-slate-900 font-bold text-xl shadow-lg">
              C
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              I-<span className="text-amber-500">computers</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Your premier destination for high-quality products. We deliver excellence, unbeatable prices, and exceptional customer satisfaction worldwide.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-900 flex justify-center items-center transition-colors text-gray-300">
              <FaFacebookF size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-900 flex justify-center items-center transition-colors text-gray-300">
              <FaInstagram size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-900 flex justify-center items-center transition-colors text-gray-300">
              <FaTwitter size={16} />
            </a>
            <a href="#" className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-900 flex justify-center items-center transition-colors text-gray-300">
              <FaLinkedinIn size={16} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-800 pb-2">
            Quick Navigation
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BiRightArrowAlt className="text-amber-500" /> Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BiRightArrowAlt className="text-amber-500" /> Explore Products
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BiRightArrowAlt className="text-amber-500" /> Shopping Cart
              </Link>
            </li>
            <li>
              <Link to="/my-orders" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BiRightArrowAlt className="text-amber-500" /> Track My Orders
              </Link>
            </li>
            <li>
              <Link to="/contact-us" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <BiRightArrowAlt className="text-amber-500" /> Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories / Services */}
        <div>
          <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-800 pb-2">
            Popular Categories
          </h3>
          <ul className="space-y-2.5 text-sm text-gray-400">
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Electronics & Gadgets</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Fashion & Accessories</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Home & Living Essentials</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">Special Deals & Offers</li>
            <li className="hover:text-amber-400 transition-colors cursor-pointer">New Arrivals</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-white font-semibold text-base mb-4 border-b border-slate-800 pb-2">
            Contact Information
          </h3>
          <div className="flex items-start gap-3 text-sm text-gray-400">
            <BiMap className="text-amber-500 text-lg flex-shrink-0 mt-1" />
            <span>123 Innovation Way, Commerce Suite 400, NY 10001</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <BiPhone className="text-amber-500 text-lg flex-shrink-0" />
            <span>+1 (800) 555-COURS</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <BiEnvelope className="text-amber-500 text-lg flex-shrink-0" />
            <span>support@cours-store.com</span>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>© {new Date().getFullYear()} CoursStore Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Refund Policy</a>
        </div>
      </div>
    </footer>
  );
}
