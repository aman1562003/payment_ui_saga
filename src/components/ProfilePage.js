import React, { useEffect, useState } from "react";
import { getUserByPhone, addMoney, getAccountByPhone } from "../api/api";
import { Toast } from "./Toast";

export default function Profile({ userPhone, userData, darkMode }) {
  const [user, setUser] = useState(userData || {});
  const [balance, setBalance] = useState(0);
  const [topupAmount, setTopupAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState(null);
  const [loadingBalance, setLoadingBalance] = useState(true);

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadUserData = async () => {
    try {
      setLoadingBalance(true);
      const res = await getUserByPhone(userPhone);
      setUser(res.data);
      const balres = await getAccountByPhone(userPhone);
      setBalance(balres.data.balance);
    } catch (error) {
      console.error("Error loading user data:", error);
      setToastMsg({ type: "error", message: "Failed to load user data" });
    } finally {
      setLoadingBalance(false);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToastMsg(null);
    try {
      if (!topupAmount || parseFloat(topupAmount) <= 0) {
        setToastMsg({ type: "error", message: "Enter a valid amount" });
        setLoading(false);
        return;
      }
      const res = await addMoney({
        phone: userPhone,
        amount: parseFloat(topupAmount),
        currency: "INR",
      });
      setToastMsg({ type: "success", message: `₹${topupAmount} added successfully! 🎉` });
      if (res.data?.balance) {
        setBalance(res.data.balance);
      } else if (res.data?.account?.balance) {
        setBalance(res.data.account.balance);
      } else {
        setBalance(prev => prev + parseFloat(topupAmount));
      }
      setTopupAmount("");
      setTimeout(loadUserData, 500);
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || "Topup failed.";
      setToastMsg({ type: "error", message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  // Theme helpers
  const card   = darkMode ? "bg-slate-900 border border-slate-800"       : "bg-white border border-slate-200 shadow-sm";
  const label  = darkMode ? "text-slate-500"                              : "text-slate-500";
  const value  = darkMode ? "text-slate-100"                              : "text-slate-800";
  const field  = darkMode ? "bg-slate-950 border-slate-800 text-slate-400": "bg-slate-50 border-slate-200 text-slate-600";
  const input  = darkMode ? "bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-600 focus:border-blue-600"
                          : "bg-white border-slate-300 text-slate-800 placeholder-slate-400 focus:border-blue-500";
  const qBtn   = darkMode ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-blue-600 hover:text-blue-400"
                          : "bg-slate-100 border-slate-200 text-slate-600 hover:border-blue-400 hover:text-blue-600";

  return (
    <div className="max-w-2xl mx-auto space-y-5 py-2">
      {toastMsg && (
        <Toast type={toastMsg.type} message={toastMsg.message} onClose={() => setToastMsg(null)} />
      )}

      {/* ── User Info Card ── */}
      <div className={`${card} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className={`text-xl font-bold tracking-tight ${value}`}>My Profile</h1>
            <p className={`text-xs mt-0.5 ${label}`}>Account details</p>
          </div>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${darkMode ? "bg-slate-800" : "bg-slate-100"}`}>
            👤
          </div>
        </div>

        <div className="space-y-3">
          {/* Phone */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${field}`}>
            <span>📱</span>
            <div>
              <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${label}`}>Phone</p>
              <p className={`text-sm font-mono font-semibold ${value}`}>{userPhone}</p>
            </div>
          </div>

          {/* Email */}
          {user.email && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${field}`}>
              <span>📧</span>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${label}`}>Email</p>
                <p className={`text-sm font-semibold ${value}`}>{user.email}</p>
              </div>
            </div>
          )}

          {/* User ID */}
          {user.userId && (
            <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${field}`}>
              <span>🔑</span>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest mb-0.5 ${label}`}>User ID</p>
                <p className={`text-xs font-mono ${label}`}>{user.userId}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Balance Card ── */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
        <p className="text-xs font-semibold uppercase tracking-widest opacity-70 mb-3">Current Balance</p>
        {loadingBalance ? (
          <div className="flex items-center gap-3">
            <svg className="animate-spin w-5 h-5 opacity-60" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-lg opacity-60">Loading balance...</span>
          </div>
        ) : (
          <p className="text-5xl font-bold tracking-tight">
            ₹{balance.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
          </p>
        )}
        <p className="text-xs opacity-50 mt-3">Available for transfers</p>
      </div>

      {/* ── Add Money Card ── */}
      <div className={`${card} rounded-xl p-6`}>
        <div className="mb-5">
          <h2 className={`text-lg font-bold tracking-tight ${value}`}>Add Money</h2>
          <p className={`text-xs mt-0.5 ${label}`}>Top up your account balance</p>
        </div>

        <form onSubmit={handleTopup} className="space-y-4">
          <div className="space-y-1.5">
            <label className={`text-xs font-bold uppercase tracking-widest ${label}`}>
              Topup Amount
            </label>
            <div className={`flex items-center border rounded-lg overflow-hidden focus-within:border-blue-600 transition-colors ${darkMode ? "bg-slate-950 border-slate-800" : "bg-white border-slate-300"}`}>
              <span className={`px-3 font-bold ${label}`}>₹</span>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="1"
                value={topupAmount}
                onChange={e => setTopupAmount(e.target.value)}
                required
                className={`flex-1 py-3 pr-3 bg-transparent outline-none text-sm font-mono ${darkMode ? "text-slate-200 placeholder-slate-600" : "text-slate-800 placeholder-slate-400"}`}
              />
              <span className={`px-3 text-xs font-bold tracking-widest ${label}`}>INR</span>
            </div>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {[500, 1000, 5000, 10000].map(amt => (
              <button
                key={amt}
                type="button"
                onClick={() => setTopupAmount(amt.toString())}
                className={`py-2 text-sm font-semibold rounded-lg border transition ${qBtn} ${
                  topupAmount === amt.toString()
                    ? "border-blue-600 text-blue-400 bg-blue-950"
                    : ""
                }`}
              >
                ₹{amt.toLocaleString("en-IN")}
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all ${
              loading
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Processing...
              </>
            ) : (
              "Add Money →"
            )}
          </button>
        </form>
      </div>

      {/* Account ID (if available) */}
      {user.accountId && (
        <div className={`${card} rounded-xl px-4 py-3 flex items-center gap-3`}>
          <span className="text-blue-400">🏦</span>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-widest ${label}`}>Account ID</p>
            <p className={`text-xs font-mono mt-0.5 ${label}`}>{user.accountId}</p>
          </div>
        </div>
      )}
    </div>
  );
}