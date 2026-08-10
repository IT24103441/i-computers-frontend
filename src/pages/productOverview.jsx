import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import LoadingScreen from "../components/loadingScreen";
import ProductImageSlideShow from "../components/productImageSlideShow";
import getFormattedPrice from "../utils/price-formatter";
import { addToCart } from "../utils/cart";
import toast from "react-hot-toast";
import { BiStar, BiMessageSquareAdd, BiX, BiUserCheck } from "react-icons/bi";

export default function ProductOverview() {
    const parameters = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // Review Modal & Form State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewComment, setReviewComment] = useState("");
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!parameters.productId) {
            navigate("/products");
            return;
        }

        api.get("/products/" + parameters.productId)
            .then((response) => {
                setProduct(response.data);
            })
            .catch((error) => {
                console.error("Error fetching product details:", error);
                navigate("/products");
            });

        // Fetch product reviews
        api.get(`/reviews?productId=${parameters.productId}`)
            .then((res) => {
                setReviews(Array.isArray(res.data) ? res.data : []);
                setLoadingReviews(false);
            })
            .catch((err) => {
                console.error("Error fetching reviews:", err);
                setReviews([]);
                setLoadingReviews(false);
            });
    }, [parameters.productId, navigate]);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        if (!reviewComment.trim()) {
            toast.error("Please enter a review comment.");
            return;
        }

        setSubmitting(true);
        const reviewData = {
            productId: product.productId,
            productName: product.name,
            rating: Number(rating),
            title: reviewTitle,
            comment: reviewComment,
            userName: userName,
            userEmail: userEmail
        };

        api.post("/reviews", reviewData)
            .then((res) => {
                toast.success(res.data.message || "Review submitted successfully!");
                setShowReviewModal(false);
                setReviewTitle("");
                setReviewComment("");
                setSubmitting(false);

                // Add to list if approved
                if (res.data.review && res.data.review.status === "approved") {
                    setReviews((prev) => [res.data.review, ...prev]);
                }
            })
            .catch((err) => {
                console.error("Failed to submit review:", err);
                toast.error(err.response?.data?.message || "Failed to submit review.");
                setSubmitting(false);
            });
    };

    if (product === null) {
        return (
            <div className="w-full h-full flex justify-center items-center">
                <LoadingScreen />
            </div>
        );
    }

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : null;

    return (
        <div className="w-full min-h-screen p-4 sm:p-8 lg:p-12 pb-28 lg:pb-12 max-w-6xl mx-auto space-y-12">
            
            {/* PRODUCT MAIN SECTION */}
            <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-8">
                {/* Image Section */}
                <div className="w-full lg:w-1/2 flex justify-center items-center">
                    <ProductImageSlideShow images={product.images} />
                </div>

                {/* Details Section */}
                <div className="w-full lg:w-1/2 flex flex-col p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between gap-4 mb-3">
                        <span className="text-gray-400 text-xs font-mono">
                            ID: {product.productId}
                        </span>
                        {(() => {
                            const avail = product.isAvailable === true || product.isAvailable === "true";
                            const isOut = !avail || product.stock === 0;
                            const isLow = avail && product.stock > 0 && product.stock <= 5;
                            return (
                                <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
                                    isOut
                                        ? "bg-red-100 text-red-700 border-red-200"
                                        : isLow
                                            ? "bg-amber-100 text-amber-800 border-amber-200 animate-pulse"
                                            : "bg-emerald-100 text-emerald-700 border-emerald-200"
                                }`}>
                                    {isOut ? "Out of Stock" : isLow ? `Only ${product.stock} left in stock!` : "In Stock"}
                                </span>
                            );
                        })()}
                    </div>

                    {(product.brand || product.model) && (
                        <p className="text-amber-600 font-medium text-sm mb-1">
                            {`${product.brand || ""} ${product.model || ""}`.trim()}
                        </p>
                    )}

                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 leading-tight">
                        {product.name}
                        {Array.isArray(product.altNames) &&
                            product.altNames.map((altName, index) => (
                                <span key={index} className="text-gray-400 font-normal text-lg">
                                    {" | " + altName}
                                </span>
                            ))}
                    </h1>

                    {/* Rating Summary Pill */}
                    <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-amber-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <BiStar
                                    key={i}
                                    size={18}
                                    className={i < Math.round(averageRating || 5) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <span className="text-xs font-bold text-gray-800">
                            {averageRating ? `${averageRating}/5` : "New"}
                        </span>
                        <span className="text-xs text-gray-400">
                            ({reviews.length} customer review{reviews.length !== 1 ? "s" : ""})
                        </span>
                    </div>

                    <div className="flex items-baseline gap-3 mb-4">
                        <p className="text-2xl sm:text-3xl text-amber-600 font-bold">
                            {getFormattedPrice(product.price)}
                        </p>
                        {Number(product.labelledPrice ?? product.labeledPrice) > Number(product.price) && (
                            <p className="text-gray-400 text-base line-through">
                                {getFormattedPrice(
                                    product.labelledPrice ?? product.labeledPrice
                                )}
                            </p>
                        )}
                    </div>

                    <div className="border-t border-gray-100 pt-4 mb-6">
                        <h3 className="text-sm font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
                        {(() => {
                            const avail = product.isAvailable === true || product.isAvailable === "true";
                            const isOut = !avail || product.stock === 0;
                            return (
                                <>
                                    <button
                                        disabled={isOut}
                                        className="w-full sm:w-1/2 py-3 px-6 text-white bg-amber-600 font-semibold rounded-xl hover:bg-amber-700 transition-colors shadow-md flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-600"
                                        onClick={() => {
                                            addToCart(product, 1);
                                            toast.success("Product added to cart");
                                        }}
                                    >
                                        {isOut ? "Out of Stock" : "Add to Cart"}
                                    </button>

                                    {isOut ? (
                                        <button
                                            disabled
                                            className="w-full sm:w-1/2 py-3 px-6 text-gray-400 bg-gray-100 font-semibold rounded-xl text-center flex items-center justify-center opacity-50 cursor-not-allowed"
                                        >
                                            Out of Stock
                                        </button>
                                    ) : (
                                        <Link
                                            className="w-full sm:w-1/2 py-3 px-6 text-gray-800 bg-gray-100 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-center flex items-center justify-center active:scale-[0.98]"
                                            to="/checkout"
                                            state={[
                                                {
                                                    product: {
                                                        productId: product.productId,
                                                        name: product.name,
                                                        image: product.images?.[0] || product.image,
                                                        price: product.price,
                                                        labelledPrice:
                                                            product.labelledPrice ??
                                                            product.labeledPrice,
                                                    },
                                                    qty: 1,
                                                },
                                            ]}
                                        >
                                            Buy Now
                                        </Link>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>

            {/* CUSTOMER REVIEWS SECTION */}
            <div className="w-full bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Customer Reviews</h2>
                        <p className="text-xs text-gray-500 mt-1">
                            Read verified feedback from customers who purchased this item.
                        </p>
                    </div>

                    <button
                        onClick={() => setShowReviewModal(true)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-xs shadow-md transition-all active:scale-95"
                    >
                        <BiMessageSquareAdd size={18} /> Write a Review
                    </button>
                </div>

                {/* Reviews List */}
                {loadingReviews ? (
                    <div className="py-8 flex justify-center">
                        <LoadingScreen />
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                        <BiStar size={40} className="mx-auto text-gray-300" />
                        <p className="text-gray-600 font-medium text-sm">No reviews for this product yet.</p>
                        <p className="text-xs text-gray-400">Be the first to share your thoughts!</p>
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="mt-2 px-4 py-2 bg-amber-50 text-amber-700 font-semibold rounded-lg text-xs hover:bg-amber-100 transition-colors"
                        >
                            Write the First Review
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {reviews.map((rev) => (
                            <div key={rev._id || rev.id} className="p-5 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={rev.userImage || "/default-profile.png"}
                                            alt={rev.userName}
                                            className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-white"
                                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(rev.userName || "User"); }}
                                        />
                                        <div>
                                            <p className="font-bold text-gray-900 text-xs flex items-center gap-1">
                                                {rev.userName} <BiUserCheck className="text-emerald-600 text-sm" title="Verified Buyer" />
                                            </p>
                                            <p className="text-[10px] text-gray-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex text-amber-400 gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <BiStar
                                                key={i}
                                                size={14}
                                                className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {rev.title && (
                                    <h4 className="font-semibold text-gray-800 text-xs">{rev.title}</h4>
                                )}
                                <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* WRITE A REVIEW MODAL */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
                        
                        <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Write a Product Review</h3>
                                <p className="text-xs text-gray-400">{product.name}</p>
                            </div>
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                            >
                                <BiX size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitReview} className="space-y-4">
                            
                            {/* Star Rating Input */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Your Rating</label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            className="p-1 hover:scale-110 transition-transform"
                                        >
                                            <BiStar
                                                size={28}
                                                className={star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}
                                            />
                                        </button>
                                    ))}
                                    <span className="text-xs font-bold text-gray-700 ml-2">{rating} out of 5</span>
                                </div>
                            </div>

                            {/* Name & Email Inputs (if not automatically detected) */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. John Doe"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">Your Email</label>
                                    <input
                                        type="email"
                                        placeholder="john@example.com"
                                        value={userEmail}
                                        onChange={(e) => setUserEmail(e.target.value)}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Review Title */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Headline (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="Summarize your experience..."
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                            </div>

                            {/* Review Comment */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Review Comments *</label>
                                <textarea
                                    rows={4}
                                    required
                                    placeholder="What did you like or dislike about this product?"
                                    value={reviewComment}
                                    onChange={(e) => setReviewComment(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="px-6 py-2.5 bg-amber-600 text-white font-bold rounded-xl text-xs hover:bg-amber-700 shadow-md transition-colors disabled:opacity-50"
                                >
                                    {submitting ? "Submitting..." : "Submit Review"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}