import { useEffect, useState } from "react";
import api from "../../utils/api";
import LoadingScreen from "../../components/loadingScreen";
import toast from "react-hot-toast";
import {
  BiEnvelope,
  BiTrash,
  BiReply,
  BiCheckCircle,
  BiTimeFive,
  BiRefresh,
  BiX,
  BiSend,
} from "react-icons/bi";
import formatTimestamp from "../../utils/date-formatter";

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  // Reply Modal State
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = (status = activeFilter) => {
    setLoading(true);
    const endpoint =
      status === "all"
        ? "/contacts/admin"
        : `/contacts/admin?status=${status}`;
    api
      .get(endpoint)
      .then((res) => {
        setMessages(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch contact messages:", err);
        toast.error("Failed to load messages.");
        setMessages([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMessages(activeFilter);
  }, [activeFilter]);

  const handleOpenReplyModal = (msg) => {
    setSelectedMessage(msg);
    setReplyText(msg.replyMessage || "");
  };

  const handleSendReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error("Please enter a reply message.");
      return;
    }

    setSendingReply(true);
    const msgId = selectedMessage._id || selectedMessage.id;

    api
      .post(`/contacts/admin/${msgId}/reply`, { replyMessage: replyText })
      .then((res) => {
        toast.success(res.data.message || `Reply sent to ${selectedMessage.email}!`);
        setSelectedMessage(null);
        setReplyText("");
        setSendingReply(false);

        // Update list locally
        setMessages((prev) =>
          prev.map((m) =>
            m._id === msgId || m.id === msgId
              ? {
                ...m,
                status: "replied",
                replyMessage: replyText.trim(),
                repliedAt: new Date(),
              }
              : m
          )
        );
      })
      .catch((err) => {
        console.error("Error sending reply:", err);
        toast.error(err.response?.data?.message || "Failed to send reply.");
        setSendingReply(false);
      });
  };

  const handleDeleteMessage = (id) => {
    if (!window.confirm("Are you sure you want to delete this contact message?"))
      return;

    api
      .delete(`/contacts/admin/${id}`)
      .then(() => {
        toast.success("Message deleted successfully.");
        setMessages((prev) => prev.filter((m) => m._id !== id && m.id !== id));
      })
      .catch((err) => {
        console.error("Error deleting message:", err);
        toast.error("Failed to delete message.");
      });
  };

  const totalCount = messages.length;
  const pendingCount = messages.filter((m) => m.status === "pending").length;
  const repliedCount = messages.filter((m) => m.status === "replied").length;

  return (
    <div className="w-full space-y-6">
      {/* Header Card */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BiEnvelope className="text-amber-500" /> Customer Contact Messages
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            View customer inquiries submitted from the Contact Us page and send email replies.
          </p>
        </div>

        <button
          onClick={() => fetchMessages(activeFilter)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors w-fit"
        >
          <BiRefresh size={18} /> Refresh List
        </button>
      </div>

      {/* Filter Tabs & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-200 shadow-sm">
          {["all", "pending", "replied"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${activeFilter === tab
                ? "bg-amber-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200">
            Total: <strong>{totalCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-yellow-50 text-yellow-700 border border-yellow-200">
            Pending: <strong>{pendingCount}</strong>
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            Replied: <strong>{repliedCount}</strong>
          </span>
        </div>
      </div>

      {/* Messages Grid / Table */}
      {loading ? (
        <div className="w-full py-16 flex justify-center items-center">
          <LoadingScreen />
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm space-y-2">
          <BiEnvelope size={48} className="mx-auto text-gray-300" />
          <h3 className="text-base font-bold text-gray-700">No contact messages</h3>
          <p className="text-xs text-gray-400">There are no messages under this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {messages.map((msg) => {
            const msgId = msg._id || msg.id;
            return (
              <div
                key={msgId}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 transition-all hover:border-amber-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                      {msg.name}
                      <span className="text-xs font-normal text-gray-400">({msg.email})</span>
                    </h3>
                    <p className="text-xs font-semibold text-amber-600 mt-0.5">
                      Subject: {msg.subject || "General Inquiry"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize ${msg.status === "replied"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {msg.status}
                    </span>

                    <span className="text-[11px] text-gray-400">
                      {(() => {
                        try {
                          return formatTimestamp(msg.createdAt);
                        } catch {
                          return new Date(msg.createdAt).toLocaleDateString();
                        }
                      })()}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-gray-50/70 p-4 rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed">
                  <p className="font-semibold text-gray-500 mb-1 text-[11px]">CUSTOMER MESSAGE:</p>
                  <p>{msg.message}</p>
                </div>

                {/* Existing Reply if available */}
                {msg.replyMessage && (
                  <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-950 space-y-1">
                    <p className="font-bold text-emerald-800 text-[11px] flex items-center gap-1">
                      <BiCheckCircle /> ADMIN REPLY SENT ({msg.repliedAt ? new Date(msg.repliedAt).toLocaleDateString() : 'Replied'}):
                    </p>
                    <p className="leading-relaxed">{msg.replyMessage}</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end items-center gap-2 pt-1">
                  <button
                    onClick={() => handleOpenReplyModal(msg)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs shadow-sm transition-colors"
                  >
                    <BiReply size={18} /> {msg.status === "replied" ? "Edit / Resend Reply" : "Reply to User"}
                  </button>

                  <button
                    onClick={() => handleDeleteMessage(msgId)}
                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-colors"
                    title="Delete Message"
                  >
                    <BiTrash size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REPLY MODAL */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Reply to {selectedMessage.name}</h3>
                <p className="text-xs text-gray-400">To: {selectedMessage.email}</p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <BiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSendReply} className="space-y-4">
              {/* Customer original message box preview */}
              <div className="p-3 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-100 space-y-1">
                <p className="font-semibold text-gray-500 text-[10px]">ORIGINAL INQUIRY:</p>
                <p className="line-clamp-3 italic">"{selectedMessage.message}"</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Your Response / Email Reply *
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Type your response to the user here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingReply}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-600 shadow-md transition-colors disabled:opacity-50"
                >
                  <BiSend size={16} />
                  {sendingReply ? "Sending..." : "Send Reply"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
