import React, { useEffect, useState } from "react";
import { transfer, getSagaDetailsByPhone } from "../api/api";
import { Toast } from "./Toast";

// Parses "TransferRequest[fromPhone=99999, toPhone=88888, amount=1000, currency=INR]"
const parsePayload = (payload) => {
    if (!payload) return { fromPhone: null, toPhone: null, amount: null };
    const get = (key) => {
        const match = payload.match(new RegExp(`${key}=([^,\\]]+)`));
        return match ? match[1].trim() : null;
    };
    return {
        fromPhone: get("fromPhone") || get("fromAccountId"),
        toPhone: get("toPhone") || get("toAccountId"),
        amount: get("amount"),
    };
};

export default function Dashboard({ userPhone, darkMode }) {
    const [toPhone, setToPhone] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [sagas, setSagas] = useState([]);
    const [toast, setToast] = useState(null);
    const [testFail, setTestFail] = useState(false);

    const visibleSagas = sagas.filter((saga) => {
        const { fromPhone, toPhone } = parsePayload(saga.requestPayload);
        const status = (saga.status || "").toUpperCase();

        const isSender = fromPhone === userPhone;
        const isReceiver = toPhone === userPhone;

        // ❌ Not related to user
        if (!isSender && !isReceiver) return false;

        // ✅ Receiver: ONLY show completed credits
        if (isReceiver) {
            return status === "COMPLETED";
        }

        // ✅ Sender: show everything
        return true;
    });

    useEffect(() => {
        loadSagas();
        const interval = setInterval(loadSagas, 5000);
        return () => clearInterval(interval);
    }, []);

    const loadSagas = async () => {
        try {
            const res = await getSagaDetailsByPhone(userPhone);
            setSagas(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Error loading sagas:", error);
        }
    };

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setToast(null);
        try {
            if (!toPhone || !amount) {
                setToast({ type: "error", message: "All fields required" });
                setLoading(false);
                return;
            }
            if (parseFloat(amount) <= 0) {
                setToast({ type: "error", message: "Amount must be greater than 0" });
                setLoading(false);
                return;
            }
            const payload = { fromPhone: userPhone, toPhone, amount: parseFloat(amount), currency: "INR" };
            await transfer(payload, testFail);
            setToast({ type: "success", message: testFail ? "Failure test initiated 🔄" : "Transfer successful! 🎉" });
            setToPhone("");
            setAmount("");
            setTestFail(false);
            setTimeout(loadSagas, 1000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || "Transfer failed. Please try again.";
            setToast({ type: "error", message: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const getStatusClasses = (status) => {
        const s = (status || "").toUpperCase();
        if (s === "COMPLETED") return { pill: "bg-green-900 text-green-400", dot: "bg-green-400", label: "Completed" };
        if (s === "COMPENSATED") return { pill: "bg-yellow-900 text-yellow-400", dot: "bg-yellow-400", label: "Compensated" };
        if (s === "PENDING") return { pill: "bg-blue-900 text-blue-400", dot: "bg-blue-400", label: "Pending" };
        return { pill: "bg-red-900 text-red-400", dot: "bg-red-400", label: "Failed" };
    };

    // Compute stats
    const totalVolume = visibleSagas
        .filter(s => s.status === "COMPLETED")
        .reduce((sum, s) => {
            const { amount } = parsePayload(s.requestPayload);
            return sum + (parseFloat(amount) || 0);
        }, 0);

    const completed = visibleSagas.filter(s => (s.status || "").toUpperCase() === "COMPLETED").length;

    const failed = visibleSagas.filter(s =>
        ["FAILED", "COMPENSATED"].includes((s.status || "").toUpperCase())
    ).length;

    const stats = [
        { label: "Total Transactions", value: visibleSagas.length, icon: "⟳", color: "text-blue-400", iconBg: "bg-blue-950 border-blue-900" },
        { label: "Completed", value: completed, icon: "✓", color: "text-green-400", iconBg: "bg-green-950 border-green-900" },
        { label: "Failed / Rolled Back", value: failed, icon: "✕", color: "text-red-400", iconBg: "bg-red-950 border-red-900" },
        { label: "Total Volume", value: `₹${totalVolume.toLocaleString("en-IN")}`, icon: "₹", color: "text-purple-400", iconBg: "bg-purple-950 border-purple-900" },
    ];

    // Theme
    const bg = darkMode ? "bg-slate-950" : "bg-slate-100";
    const card = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-sm";
    const title = darkMode ? "text-slate-100" : "text-slate-900";
    const sub = darkMode ? "text-slate-500" : "text-slate-500";
    const statCard = darkMode ? "bg-slate-900 border-slate-800 hover:border-slate-600" : "bg-white border-slate-200 hover:border-slate-400 shadow-sm";
    const inputWrap = darkMode ? "bg-slate-950 border-slate-800 focus-within:border-blue-600" : "bg-slate-50 border-slate-300 focus-within:border-blue-500";
    const inputTx = darkMode ? "text-slate-200 placeholder-slate-600" : "text-slate-800 placeholder-slate-400";
    const readonlyF = darkMode ? "bg-slate-950 border-slate-800" : "bg-slate-100 border-slate-200";
    const txRow = darkMode ? "hover:bg-slate-800" : "hover:bg-slate-50";
    const txPhone = darkMode ? "text-slate-300" : "text-slate-700";
    const txMeta = darkMode ? "text-slate-600" : "text-slate-400";
    const txAmt = darkMode ? "text-slate-200" : "text-slate-800";
    const refreshBtn = darkMode
        ? "text-slate-500 border-slate-800 hover:border-blue-700 hover:text-blue-400"
        : "text-slate-500 border-slate-300 hover:border-blue-500 hover:text-blue-600";
    const toggleOff = darkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-500";
    const errorTx = darkMode ? "text-red-400" : "text-red-600";
    const errorBg = darkMode ? "bg-red-950 border-red-900" : "bg-red-50 border-red-200";

    return (
        <div className={`min-h-screen ${bg} p-6 space-y-6 transition-colors duration-300`}>
            {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`border rounded-xl p-5 hover:-translate-y-0.5 transition-all ${statCard}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className={`text-xs font-semibold uppercase tracking-widest mb-2 ${sub}`}>{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                            <div className={`w-9 h-9 rounded-lg border flex items-center justify-center text-sm font-bold ${stat.color} ${stat.iconBg}`}>
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Main Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

                {/* Transfer Form */}
                <div className={`lg:col-span-2 border rounded-xl p-6 ${card}`}>
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h2 className={`text-lg font-bold tracking-tight ${title}`}>Send Money</h2>
                            <p className={`text-xs mt-0.5 ${sub}`}>Instant transfer via SAGA orchestration</p>
                        </div>
                        <span className="text-xs font-bold tracking-widest text-blue-400 bg-blue-950 border border-blue-900 rounded-md px-2 py-1">
                            SAGA
                        </span>
                    </div>

                    <form onSubmit={handleTransfer} className="space-y-4">
                        {/* From */}
                        <div className="space-y-1.5">
                            <label className={`text-xs font-bold uppercase tracking-widest ${sub}`}>From</label>
                            <div className={`flex items-center gap-3 px-4 py-3 border rounded-lg ${readonlyF}`}>
                                <span>📱</span>
                                <span className={`flex-1 text-sm font-mono ${sub}`}>{userPhone}</span>
                                <span className="text-xs font-semibold text-green-400 bg-green-950 px-2 py-0.5 rounded-full">✓ Verified</span>
                            </div>
                        </div>

                        {/* To Phone */}
                        <div className="space-y-1.5">
                            <label className={`text-xs font-bold uppercase tracking-widest ${sub}`}>To Phone</label>
                            <div className={`flex items-center border rounded-lg overflow-hidden transition-colors ${inputWrap}`}>
                                <span className="px-3">📲</span>
                                <input
                                    type="tel"
                                    placeholder="9999999992"
                                    value={toPhone}
                                    onChange={e => setToPhone(e.target.value)}
                                    required
                                    className={`flex-1 py-3 pr-3 bg-transparent text-sm outline-none font-mono ${inputTx}`}
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div className="space-y-1.5">
                            <label className={`text-xs font-bold uppercase tracking-widest ${sub}`}>Amount</label>
                            <div className={`flex items-center border rounded-lg overflow-hidden transition-colors ${inputWrap}`}>
                                <span className={`px-3 font-bold ${sub}`}>₹</span>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    min="0"
                                    step="0.01"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    required
                                    className={`flex-1 py-3 bg-transparent text-sm outline-none font-mono ${inputTx}`}
                                />
                                <span className={`px-3 text-xs font-bold tracking-widest ${sub}`}>INR</span>
                            </div>
                        </div>

                        {/* Simulate Failure Toggle */}
                        <div
                            onClick={() => setTestFail(!testFail)}
                            className={`flex items-center justify-between px-4 py-3 rounded-lg border cursor-pointer transition-all ${testFail ? "bg-yellow-950 border-yellow-800" : `${toggleOff} hover:border-slate-600`
                                }`}
                        >
                            <div>
                                <p className={`text-sm font-semibold ${testFail ? "text-yellow-400" : sub}`}>⚠ Simulate Failure</p>
                                <p className={`text-xs mt-0.5 ${sub}`}>Triggers SAGA compensation rollback</p>
                            </div>
                            <div className={`relative w-10 h-5 rounded-full transition-colors flex-shrink-0 ${testFail ? "bg-yellow-500" : "bg-slate-700"}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${testFail ? "left-5 bg-white" : "left-0.5 bg-slate-400"}`} />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 rounded-lg text-sm font-bold text-white flex items-center justify-center gap-2 transition-all ${loading ? "bg-slate-600 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900"
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
                            ) : "Send Money →"}
                        </button>
                    </form>
                </div>

                {/* Transaction History */}
                <div className={`lg:col-span-3 border rounded-xl p-6 ${card}`}>
                    <div className="flex items-start justify-between mb-5">
                        <div>
                            <h2 className={`text-lg font-bold tracking-tight ${title}`}>Transaction History</h2>
                            <p className={`text-xs mt-0.5 ${sub}`}>{sagas.length} total transactions</p>
                        </div>
                        <button
                            onClick={loadSagas}
                            className={`text-xs font-semibold border rounded-lg px-3 py-1.5 transition-colors ${refreshBtn}`}
                        >
                            ↻ Refresh
                        </button>
                    </div>

                    {sagas.length === 0 ? (
                        <div className={`flex flex-col items-center justify-center py-16 ${sub}`}>
                            <span className="text-4xl mb-3">📭</span>
                            <p className="text-sm">No transactions yet</p>
                        </div>
                    ) : (
                        <div className="space-y-1 max-h-96 overflow-y-auto">
                            {visibleSagas
                                .slice()
                                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                                .map((saga, idx) => {
                                    const cfg = getStatusClasses(saga.status);
                                    const { fromPhone, toPhone: toP, amount: amt } = parsePayload(saga.requestPayload);

                                    const status = (saga.status || "").toUpperCase();
                                    const isSender = fromPhone === userPhone;
                                    const isReceiver = toP === userPhone;

                                    // ✅ CORE FIX: hide failed/compensated for receiver
                                    if (isReceiver && status !== "COMPLETED") {
                                        return null;
                                    }

                                    const isSent = isSender;

                                    return (
                                        <div key={saga.transactionId || idx} className={`flex items-start gap-3 px-3 py-3 rounded-lg transition-colors ${txRow}`}>

                                            {/* Status dot */}
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${cfg.dot}`} />

                                            {/* Details */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1.5 mb-0.5">

                                                    {/* Sent / Received badge */}
                                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded mr-1 ${isSent
                                                        ? "bg-orange-950 text-orange-400 border border-orange-900"
                                                        : "bg-green-950 text-green-400 border border-green-900"
                                                        }`}>
                                                        {isSent ? "↑ SENT" : "↓ RECV"}
                                                    </span>

                                                    <span className={`text-sm font-semibold font-mono ${txPhone}`}>
                                                        {fromPhone || "—"}
                                                    </span>
                                                    <span className={`text-xs ${sub}`}>→</span>
                                                    <span className={`text-sm font-semibold font-mono ${txPhone}`}>
                                                        {toP || "—"}
                                                    </span>
                                                </div>

                                                <p className={`text-xs truncate ${txMeta}`}>
                                                    {saga.transactionId ? saga.transactionId.slice(0, 14) + "..." : "—"}
                                                    {saga.createdAt &&
                                                        ` · ${new Date(saga.createdAt).toLocaleString("en-IN", {
                                                            dateStyle: "short",
                                                            timeStyle: "short",
                                                        })}`}
                                                </p>

                                                {saga.errorMessage && isSender && (   // ✅ show error only to sender
                                                    <p className={`text-xs mt-1 truncate px-2 py-0.5 rounded border ${errorBg} ${errorTx}`}>
                                                        {saga.errorMessage}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Amount + Status */}
                                            <div className="text-right flex-shrink-0">
                                                <p className={`text-sm font-bold mb-1 font-mono ${isSent ? "text-orange-400" : "text-green-400"}`}>
                                                    {isSent ? "-" : "+"}₹{amt ? parseFloat(amt).toLocaleString("en-IN") : "0"}
                                                </p>

                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${cfg.pill}`}>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}