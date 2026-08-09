import { useEffect, useRef, useState } from "react";
import api from "../utils/api";
import { BiBell, BiCheckCircle, BiMessageCheck, BiTimeFive, BiX } from "react-icons/bi";
import formatTimestamp from "../utils/date-formatter";

export default function NotificationBell() {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUserNotifications = () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    api
      .get("/contacts/my-messages")
      .then((res) => {
        setMessages(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user notifications:", err);
        setMessages([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUserNotifications();

    // Close dropdown on click outside
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const token = localStorage.getItem("token");
  if (!token) return null;

  const repliedMessages = messages.filter((m) => m.status === "replied");
  const unreadBadge = repliedMessages.length;

  return (
    <div ref={dropdownRef} className="relative inline-block">
      {/* Bell Icon Button */}
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchUserNotifications();
        }}
        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-gray-200 hover:text-amber-400 border border-slate-700/80 transition-all flex items-center justify-center relative shadow-sm"
        title="Notifications & Support Replies"
      >
        <BiBell size={22} />

        {/* Badge Count */}
        {unreadBadge > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex justify-center items-center shadow-lg border-2 border-slate-900 animate-pulse">
            {unreadBadge}
          </span>
        )}
      </button>

      {/* Notifications Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in zoom-in duration-200">
          
          {/* Panel Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BiMessageCheck className="text-amber-400 text-xl" />
              <h4 className="font-bold text-sm">Notifications & Admin Replies</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <BiX size={20} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400 font-medium">
                Loading notifications...
              </div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <BiBell size={36} className="mx-auto text-slate-300" />
                <p className="text-xs font-semibold text-slate-600">No notifications yet</p>
                <p className="text-[11px] text-slate-400">
                  When you submit a Contact Us inquiry, admin replies will appear here.
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id || msg.id}
                  className="p-3.5 space-y-2 hover:bg-slate-50 transition-colors rounded-xl"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[200px]">
                      {msg.subject || "General Inquiry"}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        msg.status === "replied"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                    "{msg.message}"
                  </p>

                  {/* ADMIN REPLY BOX */}
                  {msg.status === "replied" && msg.replyMessage ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl space-y-1 mt-1">
                      <div className="flex items-center justify-between text-[10px] text-emerald-800 font-bold">
                        <span className="flex items-center gap-1">
                          <BiCheckCircle className="text-emerald-600" /> Admin Response:
                        </span>
                        <span className="text-[9px] text-emerald-600 font-normal">
                          {msg.repliedAt
                            ? new Date(msg.repliedAt).toLocaleDateString()
                            : ""}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-emerald-950 leading-relaxed">
                        {msg.replyMessage}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[10px] text-yellow-600 font-semibold pt-1">
                      <BiTimeFive /> Waiting for admin response...
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
