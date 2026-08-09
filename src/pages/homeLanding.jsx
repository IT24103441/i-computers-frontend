import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import ProductCard from "../components/productCard";
import LoadingScreen from "../components/loadingScreen";
import toast from "react-hot-toast";
import {
  BiShoppingBag,
  BiCreditCard,
  BiSupport,
  BiStar,
  BiRightArrowAlt,
  BiSearch,
  BiTag,
  BiTrendingUp,
  BiShieldAlt2,
} from "react-icons/bi";
import { TbTruckDelivery } from "react-icons/tb";
import { HiSparkles } from "react-icons/hi2";


export default function HomeLanding() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [liveReviews, setLiveReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [emailInput, setEmailInput] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/products")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setFeaturedProducts(data);

        // Extract unique categories dynamically from products
        const uniqueCats = Array.from(
          new Set(data.map((p) => p.category).filter(Boolean))
        );
        setCategories(uniqueCats);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load homepage products:", err);
        setLoading(false);
      });

    // Fetch approved customer reviews
    api.get("/reviews")
      .then((res) => {
        setLiveReviews(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("Failed to load customer reviews:", err);
      });
  }, []);


  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      toast.error("Please enter a valid email address.");
      return;
    }
    toast.success("Thank you for subscribing! Check your inbox for special offers.");
    setEmailInput("");
  };

  const filteredProducts =
    activeCategory === "All"
      ? featuredProducts
      : featuredProducts.filter(
        (p) => p.category?.toLowerCase() === activeCategory.toLowerCase()
      );

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800">

      {/* HERO SECTION */}
      <section className="relative w-full bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 text-white overflow-hidden py-16 lg:py-24 px-6">
        {/* Subtle Background Glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">

          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <HiSparkles size={16} /> Premium Shopping Experience
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Discover Quality Products <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Tailored for Your Lifestyle
              </span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Explore thousands of curated items with uncompromised quality, unbeatable prices, and lightning-fast nationwide delivery.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <BiShoppingBag size={20} /> Shop Collection
              </Link>
              <a
                href="#featured"
                className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl backdrop-blur-md border border-white/10 transition-all flex items-center justify-center gap-2"
              >
                Explore Deals <BiRightArrowAlt size={20} />
              </a>
            </div>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-700/60 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold text-white">100%</p>
                <p className="text-xs text-gray-400">Authentic Guarantee</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24/7</p>
                <p className="text-xs text-gray-400">Customer Support</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">Fast</p>
                <p className="text-xs text-gray-400">Express Delivery</p>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md bg-slate-800/80 backdrop-blur-xl p-6 rounded-3xl border border-slate-700/70 shadow-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30 flex items-center gap-1">
                  <BiTrendingUp /> Trending Now
                </span>
                <span className="text-xs text-gray-400">Verified Stock</span>
              </div>

              {/* Showcase Image / Highlight */}
              <div className="w-full h-56 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden relative flex items-center justify-center group">
                {featuredProducts[0]?.images?.[0] ? (
                  <img
                    src={featuredProducts[0].images[0]}
                    alt={featuredProducts[0].name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <BiShoppingBag size={48} className="mx-auto text-amber-500/60" />
                    <p className="text-sm text-gray-400 font-medium">Top Store Selection</p>
                  </div>
                )}

                <div className="absolute bottom-3 left-3 right-3 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 flex items-center justify-between">
                  <div className="truncate pr-2">
                    <p className="text-xs font-bold text-white truncate">
                      {featuredProducts[0]?.name || "Featured Product"}
                    </p>
                    <p className="text-[10px] text-amber-400 font-semibold">
                      {featuredProducts[0]?.category || "Best Seller"}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (featuredProducts[0]?.productId) {
                        navigate(`/overview/${featuredProducts[0].productId}`);
                      } else {
                        navigate("/products");
                      }
                    }}
                    className="px-3 py-1.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400 transition-colors flex-shrink-0"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Rating & Assurance pills */}
              <div className="flex items-center justify-between text-xs text-gray-300 pt-1">
                <div className="flex items-center gap-1 text-amber-400">
                  <BiStar size={16} />
                  <BiStar size={16} />
                  <BiStar size={16} />
                  <BiStar size={16} />
                  <BiStar size={16} />
                  <span className="text-white font-bold ml-1">4.9/5</span>
                </div>
                <span className="text-gray-400 text-[11px]">Over 2,500+ happy buyers</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VALUE PROPOSITIONS BAR */}
      <section className="w-full bg-white border-b border-slate-200 py-8 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl flex-shrink-0">
              <TbTruckDelivery />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Free Express Shipping</h4>
              <p className="text-xs text-slate-500">On all orders with fast tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
              <BiShieldAlt2 />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">100% Authentic</h4>
              <p className="text-xs text-slate-500">Verified products & guarantee</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl flex-shrink-0">
              <BiCreditCard />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Secure Payment</h4>
              <p className="text-xs text-slate-500">256-bit encrypted checkout</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-2xl flex-shrink-0">
              <BiSupport />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">24/7 Support</h4>
              <p className="text-xs text-slate-500">Dedicated customer care team</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION */}
      <section id="featured" className="max-w-7xl mx-auto px-6 py-16 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
              Curated Selection
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Featured Products
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setActiveCategory("All")}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${activeCategory === "All"
                ? "bg-amber-600 text-white shadow-md"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
            >
              All ({featuredProducts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all whitespace-nowrap ${activeCategory === cat
                  ? "bg-amber-600 text-white shadow-md"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="w-full py-16 flex justify-center items-center">
            <LoadingScreen />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="w-full bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4">
            <BiShoppingBag size={48} className="mx-auto text-slate-300" />
            <h3 className="text-lg font-bold text-slate-700">No products available in this category</h3>
            <button
              onClick={() => setActiveCategory("All")}
              className="px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-xl text-sm hover:bg-amber-700 transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
            {filteredProducts.slice(0, 8).map((product, idx) => (
              <ProductCard key={product.productId || product._id || product.id || idx} product={product} />
            ))}
          </div>
        )}

        {/* View All Products CTA */}
        {featuredProducts.length > 0 && (
          <div className="text-center pt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-2xl shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Browse All Products ({featuredProducts.length}) <BiRightArrowAlt size={20} />
            </Link>
          </div>
        )}
      </section>



      {/* TESTIMONIALS & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-6 py-16 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">
            Loved By Thousands
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm text-slate-500">
            Real feedback from verified shoppers who love our products and fast delivery service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {liveReviews.length > 0
            ? liveReviews.slice(0, 3).map((rev) => (
              <div key={rev._id || rev.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400 gap-1 text-base">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <BiStar
                        key={i}
                        className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}
                      />
                    ))}
                  </div>
                  {rev.title && (
                    <h4 className="font-bold text-slate-800 text-sm">{rev.title}</h4>
                  )}
                  <p className="text-slate-700 text-sm leading-relaxed italic line-clamp-3">
                    "{rev.comment}"
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <img
                    src={rev.userImage || "/default-profile.png"}
                    alt={rev.userName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100"
                    onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(rev.userName || "User"); }}
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-xs">{rev.userName}</p>
                    <p className="text-[11px] text-emerald-600 font-medium">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))
            : (
              <>
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex text-amber-400 gap-1 text-base">
                    <BiStar /><BiStar /><BiStar /><BiStar /><BiStar />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "The shipping was amazingly fast! Received my order in pristine condition within 2 days. Highly recommended!"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex justify-center items-center text-sm">
                      JD
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">John Doe</p>
                      <p className="text-[11px] text-emerald-600 font-medium">Verified Buyer</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex text-amber-400 gap-1 text-base">
                    <BiStar /><BiStar /><BiStar /><BiStar /><BiStar />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "Product quality exceeded my expectations. Customer support helped me immediately when I had a question."
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex justify-center items-center text-sm">
                      SP
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Sarah Parker</p>
                      <p className="text-[11px] text-emerald-600 font-medium">Verified Buyer</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex text-amber-400 gap-1 text-base">
                    <BiStar /><BiStar /><BiStar /><BiStar /><BiStar />
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed italic">
                    "Great pricing and seamless checkout experience. Will definitely be ordering from CoursStore again!"
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex justify-center items-center text-sm">
                      AM
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">Alex Morgan</p>
                      <p className="text-[11px] text-emerald-600 font-medium">Verified Buyer</p>
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>

      </section>

    </div>
  );
}
