import { useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import {
  BiEnvelope,
  BiPhone,
  BiMap,
  BiTime,
  BiSend,
  BiMessageCheck,
  BiQuestionMark,
} from "react-icons/bi";

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    api.post("/contacts", formData)
      .then((res) => {
        toast.success(res.data.message || "Thank you for reaching out! Our team will get back to you shortly.");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setSubmitting(false);
      })
      .catch((err) => {
        console.error("Error submitting contact message:", err);
        toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
        setSubmitting(false);
      });
  };


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* HERO HEADER */}
      <section className="w-full bg-slate-900 text-white py-16 px-6 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center space-y-4 relative z-10">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/20">
            We're Here To Help
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Contact Our Support Team
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Have questions regarding custom computer builds, product warranties, or order shipping? Reach out to us anytime!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-12">
        {/* CONTACT INFO CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-2xl">
              <BiMap />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Visit Our Store</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              123 Innovation Way, Commerce Suite 400, NY 10001
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl">
              <BiPhone />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Call Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              +1 (800) 555-COURS <br />
              +1 (800) 555-4266
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-2xl">
              <BiEnvelope />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Email Us</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              support@i-computers.com <br />
              sales@i-computers.com
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center text-2xl">
              <BiTime />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Working Hours</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Mon - Sat: 9:00 AM - 8:00 PM <br />
              Sunday: Closed
            </p>
          </div>
        </div>

        {/* MAIN FORM & SIDE DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Send Us a Message</h2>
              <p className="text-xs text-slate-500">
                Fill in the details below and our customer care representative will respond within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  name="subject"
                  placeholder="e.g. Order Inquiry / Warranty Question"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-slate-50/50"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <BiSend size={18} />
                {submitting ? "Sending Message..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* Frequently Asked Questions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                Quick Answers
              </span>
              <h3 className="text-xl font-bold">Frequently Asked Questions</h3>

              <div className="space-y-4 text-xs pt-2">
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <BiQuestionMark /> What is the estimated shipping time?
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Standard shipping takes 2-4 business days. Express shipping arrives within 24-48 hours.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <BiQuestionMark /> Do products come with official warranty?
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    Yes! All brand-new items come with a 1-year manufacturer warranty and free technical support.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <BiQuestionMark /> How can I track my order status?
                  </h4>
                  <p className="text-slate-300 leading-relaxed">
                    You can track your active orders under the <strong>My Orders</strong> section in your profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
