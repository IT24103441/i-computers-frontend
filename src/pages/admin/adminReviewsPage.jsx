import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import toast from "react-hot-toast";
import { BiStar, BiTrash, BiCheckCircle, BiXCircle, BiMessageSquareDetail, BiRefresh } from "react-icons/bi";
import formatTimestamp from "../../utils/date-formatter";

export default function AdminReviewsPage({ isDarkMode = false }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchReviews = (status = activeFilter) => {
    setLoading(true);
    const endpoint = status === "all" ? "/reviews/admin/all" : `/reviews/admin/all?status=${status}`;
    api.get(endpoint)
      .then((res) => {
        setReviews(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch admin reviews:", err);
        toast.error("Failed to load reviews.");
        setReviews([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReviews(activeFilter);
  }, [activeFilter]);

  const handleUpdateStatus = (id, newStatus) => {
    api.put(`/reviews/admin/${id}/status`, { status: newStatus })
      .then(() => {
        toast.success(`Review status set to ${newStatus}`);
        setReviews((prev) =>
          prev.map((r) => (r._id === id || r.id === id ? { ...r, status: newStatus } : r))
        );
      })
      .catch((err) => {
        console.error("Error updating review status:", err);
        toast.error("Failed to update status");
      });
  };

  const handleDeleteReview = (id) => {
    if (!window.confirm("Are you sure you want to delete this review permanently?")) return;

    api.delete(`/reviews/admin/${id}`)
      .then(() => {
        toast.success("Review deleted successfully");
        setReviews((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting review:", err);
        toast.error("Failed to delete review");
      });
  };

  const totalReviews = reviews.length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  return (
    <div className="w-full space-y-6">

      {/* Top Header Card */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl border transition-colors ${
        isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 text-slate-800 shadow-sm'
      }`}>
        <div>
          <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>
            <BiMessageSquareDetail className="text-amber-500" /> Customer Reviews Management
          </h1>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            Review, approve, reject, or delete feedback submitted by shoppers.
          </p>
        </div>

        <button
          onClick={() => fetchReviews(activeFilter)}
          className={`inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-xl text-xs transition-colors w-fit ${
            isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          <BiRefresh size={18} /> Refresh List
        </button>
      </div>

      {/* Filter Tabs & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className={`flex items-center gap-2 p-1.5 rounded-2xl border transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200 shadow-sm'
        }`}>
          {["all", "approved", "pending", "rejected"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${activeFilter === tab
                ? "bg-amber-600 text-white shadow-md font-bold"
                : isDarkMode
                  ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                  : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
          <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
            Total: <strong>{totalReviews}</strong>
          </span>
          <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
            Approved: <strong>{approvedCount}</strong>
          </span>
          <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
            Pending: <strong>{pendingCount}</strong>
          </span>
          <span className={`px-3 py-1.5 rounded-xl border ${isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-700 border-red-200'}`}>
            Rejected: <strong>{rejectedCount}</strong>
          </span>
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="w-full py-16 flex justify-center items-center">
          <LoadingScreen />
        </div>
      ) : reviews.length === 0 ? (
        <div className={`rounded-2xl p-12 text-center border transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <BiMessageSquareDetail size={48} className={`mx-auto mb-3 ${isDarkMode ? 'text-slate-600' : 'text-gray-300'}`} />
          <h3 className={`text-base font-bold ${isDarkMode ? 'text-slate-200' : 'text-gray-700'}`}>No reviews found</h3>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>There are no reviews matching the selected filter.</p>
        </div>
      ) : (
        <div className={`rounded-2xl border transition-colors overflow-hidden ${
          isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${
                  isDarkMode ? 'bg-slate-800/60 border-slate-800 text-slate-400' : 'bg-gray-50 border-gray-100 text-gray-500'
                }`}>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Review Content</th>
                  <th className="p-4">Product</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y text-sm ${isDarkMode ? 'divide-slate-800 text-slate-200' : 'divide-gray-100 text-gray-700'}`}>
                {reviews.map((rev) => {
                  const revId = rev._id || rev.id;
                  return (
                    <tr key={revId} className={`transition-colors ${isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-gray-50/50'}`}>

                      {/* Customer Info */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={rev.userImage || "/default-profile.png"}
                            alt={rev.userName}
                            className={`w-9 h-9 rounded-full object-cover border ${
                              isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-gray-100'
                            }`}
                            onError={(e) => { e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(rev.userName || "User"); }}
                          />
                          <div>
                            <p className={`font-semibold text-xs ${isDarkMode ? 'text-slate-100' : 'text-gray-900'}`}>{rev.userName || "Anonymous"}</p>
                            <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>{rev.userEmail}</p>
                          </div>
                        </div>
                      </td>

                      {/* Rating */}
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <BiStar
                              key={i}
                              size={16}
                              className={i < rev.rating ? "fill-amber-400 text-amber-400" : isDarkMode ? "text-slate-700" : "text-gray-300"}
                            />
                          ))}
                          <span className={`font-bold text-xs ml-1 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{rev.rating}.0</span>
                        </div>
                      </td>

                      {/* Title & Comment */}
                      <td className="p-4 max-w-xs">
                        {rev.title && (
                          <h4 className={`font-bold text-xs truncate mb-0.5 ${isDarkMode ? 'text-slate-200' : 'text-gray-800'}`}>{rev.title}</h4>
                        )}
                        <p className={`text-xs line-clamp-2 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{rev.comment}</p>
                      </td>

                      {/* Product */}
                      <td className="p-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-lg border inline-block max-w-[150px] truncate ${
                          isDarkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                          {rev.productName || "General Store"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <select
                          value={rev.status}
                          onChange={(e) => handleUpdateStatus(revId, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-bold capitalize border outline-none cursor-pointer transition-all ${
                            rev.status === "approved"
                              ? isDarkMode ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                              : rev.status === "pending"
                                ? isDarkMode ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20" : "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100"
                                : isDarkMode ? "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20" : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                        >
                          <option value="approved" className={isDarkMode ? "bg-slate-900 text-white font-semibold" : "bg-white text-gray-800 font-semibold"}>Approved</option>
                          <option value="pending" className={isDarkMode ? "bg-slate-900 text-white font-semibold" : "bg-white text-gray-800 font-semibold"}>Pending</option>
                          <option value="rejected" className={isDarkMode ? "bg-slate-900 text-white font-semibold" : "bg-white text-gray-800 font-semibold"}>Rejected</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className={`p-4 text-xs whitespace-nowrap ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                        {(() => {
                          try {
                            return formatTimestamp(rev.createdAt);
                          } catch {
                            return new Date(rev.createdAt).toLocaleDateString();
                          }
                        })()}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {rev.status !== "approved" && (
                            <button
                              onClick={() => handleUpdateStatus(revId, "approved")}
                              title="Approve Review"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDarkMode ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                              }`}
                            >
                              <BiCheckCircle size={18} />
                            </button>
                          )}
                          {rev.status !== "rejected" && (
                            <button
                              onClick={() => handleUpdateStatus(revId, "rejected")}
                              title="Reject Review"
                              className={`p-1.5 rounded-lg transition-colors ${
                                isDarkMode ? 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20' : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                              }`}
                            >
                              <BiXCircle size={18} />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(revId)}
                            title="Delete Review"
                            className={`p-1.5 rounded-lg transition-colors ${
                              isDarkMode ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                          >
                            <BiTrash size={18} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
