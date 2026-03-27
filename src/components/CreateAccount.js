import { useState } from "react";
import { createAccount } from "../api/api";

export default function CreateAccount() {
  const [userId, setUserId] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    if (!userId || !balance) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await createAccount({
        userId,
        initialBalance: Number(balance),
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setUserId("");
      setBalance("");
    } catch (error) {
      console.error("Account creation failed:", error);
      alert("Failed to create account. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
        <p className="text-slate-400">Create a new financial account.</p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-2xl">
        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-700 rounded-lg text-green-400 flex items-center gap-2">
            <span>✓</span> Account created successfully!
          </div>
        )}

        <div className="space-y-4">
          {/* User ID */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              User ID
            </label>
            <input
              type="text"
              placeholder="Enter unique user ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            />
          </div>

          {/* Initial Balance */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Initial Balance
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-slate-400">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                disabled={loading}
                className="w-full pl-8 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              onClick={handleCreate}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition-all duration-200 shadow-lg shadow-green-500/30 hover:shadow-green-500/50"
            >
              {loading ? "Creating..." : "🧾 Create Account"}
            </button>
            <button
              onClick={() => {
                setUserId("");
                setBalance("");
              }}
              disabled={loading}
              className="px-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 font-medium py-3 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}