import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getUserByPhone } from "../api/api";
import { Toast } from "./Toast";

export default function SignIn({ onLogin }) {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [step, setStep] = useState("phone");
  const [dark, setDark] = useState(true);

  const handlePhoneContinue = async (e) => {
    e.preventDefault();
    if (!phone || phone.trim().length !== 10) {
      setToast({ type: "error", message: "Enter a valid 10-digit phone number" });
      return;
    }
    setLoading(true);
    setToast(null);
    try {
      const userRes = await getUserByPhone(phone);
      onLogin(phone, userRes.data);
      setToast({ type: "success", message: "Welcome back! 🎉" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      if (err.response?.status === 404) {
        setStep("email");
      } else {
        setToast({ type: "error", message: "Something went wrong. Try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || email.trim() === "") {
      setToast({ type: "error", message: "Please enter your email" });
      return;
    }
    setLoading(true);
    setToast(null);
    try {
      const res = await createUser({ phone, email });
      onLogin(phone, res.data);
      setToast({ type: "success", message: "Account created! 🎉" });
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Registration failed";
      setToast({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep("phone");
    setEmail("");
    setToast(null);
  };

  // Theme tokens
  const page    = dark ? "bg-slate-950"   : "bg-slate-100";
  const card    = dark ? "bg-slate-900 border-slate-800"  : "bg-white border-slate-200";
  const title   = dark ? "text-slate-100" : "text-slate-900";
  const sub     = dark ? "text-slate-500" : "text-slate-500";
  const inputWrap = dark
    ? "bg-slate-950 border-slate-800 focus-within:border-blue-600"
    : "bg-slate-50 border-slate-300 focus-within:border-blue-500";
  const prefix  = dark ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-slate-100 border-slate-200 text-slate-500";
  const inputTx = dark ? "text-slate-200 placeholder-slate-600" : "text-slate-800 placeholder-slate-400";
  const hint    = dark ? "text-slate-600" : "text-slate-400";
  const demoBox = dark ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200";
  const demoTx  = dark ? "text-slate-500" : "text-slate-500";
  const footer  = dark ? "text-slate-700" : "text-slate-400";
  const noticeBox = dark ? "bg-blue-950 border-blue-900" : "bg-blue-50 border-blue-200";
  const noticeTx  = dark ? "text-slate-400" : "text-slate-600";
  const noticeVal = dark ? "text-slate-200" : "text-slate-800";
  const backBtn   = dark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-700";

  const SpinnerSVG = () => (
    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  return (
    <div className={`min-h-screen ${page} flex items-center justify-center p-4 transition-colors duration-300`}>
      {toast && (
        <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
      )}

      {/* Background glow */}
      {dark && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600 opacity-10 rounded-full blur-3xl" />
        </div>
      )}

      <div className="relative w-full max-w-sm">
        <div className={`border rounded-2xl p-8 shadow-2xl transition-colors duration-300 ${card}`}>

          {/* Card top row — Logo + Theme toggle */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex flex-col items-start gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  ₹
                </div>
                <h1 className={`text-2xl font-bold tracking-tight ${title}`}>PayFlow</h1>
              </div>
              <p className={`text-sm ${sub}`}>
                {step === "phone" ? "Sign in or create an account" : "Complete your registration"}
              </p>
            </div>

            {/* Moon / Sun toggle */}
            <button
              onClick={() => setDark(!dark)}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all border ${
                dark
                  ? "bg-slate-800 border-slate-700 hover:border-slate-500 text-yellow-300"
                  : "bg-slate-100 border-slate-200 hover:border-slate-400 text-slate-600"
              }`}
            >
              {dark ? (
                // Sun icon
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                // Moon icon
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* ── Step 1: Phone ── */}
          {step === "phone" && (
            <form onSubmit={handlePhoneContinue} className="space-y-4">
              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-widest ${sub}`}>
                  Phone Number
                </label>
                <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${inputWrap}`}>
                  <span className={`px-4 py-3.5 text-sm font-semibold border-r ${prefix}`}>
                    +91
                  </span>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="9999999991"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/, ""))}
                    required
                    autoFocus
                    className={`flex-1 px-4 py-3.5 bg-transparent text-sm outline-none font-mono tracking-wider ${inputTx}`}
                  />
                </div>
                <p className={`text-xs ${hint}`}>We'll check if you have an existing account</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all ${
                  loading ? "bg-slate-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900"
                }`}
              >
                {loading ? <><SpinnerSVG /> Checking...</> : "Continue →"}
              </button>

              <div className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg ${demoBox}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${hint}`}>Demo</span>
                <span className={`text-xs font-mono ${demoTx}`}>9999999991</span>
              </div>
            </form>
          )}

          {/* ── Step 2: Email ── */}
          {step === "email" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <button
                type="button"
                onClick={handleBack}
                className={`flex items-center gap-1 text-xs transition-colors mb-1 ${backBtn}`}
              >
                ← Back
              </button>

              <div className={`px-4 py-3 border rounded-xl ${noticeBox}`}>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">New Account</p>
                <p className={`text-sm ${noticeTx}`}>
                  No account for{" "}
                  <span className={`font-mono font-semibold ${noticeVal}`}>+91 {phone}</span>
                </p>
              </div>

              <div className="space-y-1.5">
                <label className={`text-xs font-bold uppercase tracking-widest ${sub}`}>
                  Email Address
                </label>
                <div className={`flex items-center border rounded-xl overflow-hidden transition-colors ${inputWrap}`}>
                  <span className={`px-4 ${hint}`}>📧</span>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                    className={`flex-1 px-2 py-3.5 bg-transparent text-sm outline-none ${inputTx}`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all ${
                  loading ? "bg-slate-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900"
                }`}
              >
                {loading ? <><SpinnerSVG /> Creating...</> : "Create Account →"}
              </button>

              <div className={`flex items-center gap-2 px-3 py-2.5 border rounded-lg ${demoBox}`}>
                <span className={`text-xs font-bold uppercase tracking-widest ${hint}`}>Demo</span>
                <span className={`text-xs font-mono ${demoTx}`}>user@test.com</span>
              </div>
            </form>
          )}

        </div>

        <p className={`text-center text-xs mt-6 ${footer}`}>
          Secured by SAGA Orchestration Pattern
        </p>
      </div>
    </div>
  );
}