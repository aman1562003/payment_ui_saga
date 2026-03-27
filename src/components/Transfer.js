import { useEffect, useState } from "react";
import { transfer, getSagas } from "../api/api";
import { InlineSpinner } from "./LoadingSpinner";

export default function Transfer({ refresh }) {
  const [accounts, setAccounts] = useState([]);
  const [fromId, setFromId] = useState("");
  const [toId, setToId] = useState("");
  const [amount, setAmount] = useState("");
  const [fail, setFail] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Load accounts on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoadingAccounts(true);
      // For now, using mock data since accounts endpoint might not exist
      // In production, you would call an accounts endpoint
      const mockAccounts = [
        { id: "user1", name: "John Doe" },
        { id: "user2", name: "Jane Smith" },
        { id: "user3", name: "Bob Johnson" },
        { id: "user4", name: "Alice Williams" },
      ];
      setAccounts(mockAccounts);
    } catch (error) {
      console.error("Error loading accounts:", error);
      showToast("Failed to load accounts", "error");
    } finally {
      setLoadingAccounts(false);
    }
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!fromId) {
      newErrors.fromId = "Please select a source account";
    }

    if (!toId) {
      newErrors.toId = "Please select a destination account";
    }

    if (fromId === toId) {
      newErrors.toId = "Source and destination accounts cannot be the same";
    }

    if (!amount) {
      newErrors.amount = "Please enter an amount";
    } else if (Number(amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (Number(amount) > 1000000) {
      newErrors.amount = "Amount exceeds maximum limit (₹1,00,00,000)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTransfer = async () => {
    if (!validateForm()) {
      showToast("Please fix the errors below", "error");
      return;
    }

    setLoading(true);
    try {
      await transfer(
        {
          fromAccountId: fromId,
          toAccountId: toId,
          amount: Number(amount),
        },
        fail
      );

      showToast(
        fail
          ? "Transfer completed with simulated failure (for testing)"
          : "Transfer successful! 🎉",
        "success"
      );

      // Reset form
      setFromId("");
      setToId("");
      setAmount("");
      setFail(false);
      setErrors({});

      // Refresh dashboard if callback provided
      if (refresh) refresh();
    } catch (error) {
      console.error("Transfer failed:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Transfer failed. Please try again.";
      showToast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFromId("");
    setToId("");
    setAmount("");
    setFail(false);
    setErrors({});
  };

  const isFormValid = fromId && toId && amount && !loading;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Transfer Funds</h1>
        <p className="text-slate-400">Send money between accounts securely.</p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-3 animate-in fade-in ${
            toast.type === "success"
              ? "bg-green-900/30 border border-green-700 text-green-300"
              : "bg-red-900/30 border border-red-700 text-red-300"
          }`}
        >
          <span className="text-xl">
            {toast.type === "success" ? "✓" : "⚠️"}
          </span>
          <span>{toast.message}</span>
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 max-w-2xl">
        <div className="space-y-6">
          {/* From Account Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              From Account
            </label>
            <div className="relative">
              {loadingAccounts ? (
                <div className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-500 flex items-center gap-2">
                  <span className="animate-spin">🔄</span>
                  Loading accounts...
                </div>
              ) : (
                <select
                  value={fromId}
                  onChange={(e) => {
                    setFromId(e.target.value);
                    setErrors({ ...errors, fromId: "" });
                  }}
                  disabled={loading}
                  className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer disabled:opacity-50 ${
                    errors.fromId
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Select source account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.id})
                    </option>
                  ))}
                </select>
              )}
            </div>
            {errors.fromId && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.fromId}
              </p>
            )}
          </div>

          {/* To Account Dropdown */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              To Account
            </label>
            <div className="relative">
              {loadingAccounts ? (
                <div className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-500 flex items-center gap-2">
                  <span className="animate-spin">🔄</span>
                  Loading accounts...
                </div>
              ) : (
                <select
                  value={toId}
                  onChange={(e) => {
                    setToId(e.target.value);
                    setErrors({ ...errors, toId: "" });
                  }}
                  disabled={loading}
                  className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors appearance-none cursor-pointer disabled:opacity-50 ${
                    errors.toId
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                >
                  <option value="">Select destination account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name} ({account.id})
                    </option>
                  ))}
                </select>
              )}
            </div>
            {errors.toId && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.toId}
              </p>
            )}
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-slate-400 font-semibold">
                ₹
              </span>
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setErrors({ ...errors, amount: "" });
                }}
                onBlur={() => validateForm()}
                disabled={loading}
                min="0"
                step="0.01"
                className={`w-full pl-8 pr-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-colors disabled:opacity-50 ${
                  errors.amount
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-slate-600 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-400 flex items-center gap-1">
                <span>⚠️</span> {errors.amount}
              </p>
            )}
            {amount && !errors.amount && (
              <p className="mt-1 text-xs text-green-400 flex items-center gap-1">
                <span>✓</span> Valid amount
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700 pt-4"></div>

          {/* Simulate Failure Checkbox */}
          <div className="flex items-center gap-3 p-3 bg-amber-900/20 border border-amber-700/50 rounded-lg">
            <input
              type="checkbox"
              id="fail-checkbox"
              checked={fail}
              onChange={() => setFail(!fail)}
              disabled={loading}
              className="w-4 h-4 cursor-pointer accent-amber-500"
            />
            <label
              htmlFor="fail-checkbox"
              className="text-sm text-amber-300 cursor-pointer flex-1"
            >
              🔥 Simulate Failure (Testing Only)
            </label>
            <span className="text-xs text-amber-400">Test Mode</span>
          </div>

          {/* Transaction Summary */}
          {fromId && toId && amount && (
            <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
              <p className="text-xs text-blue-300 mb-3 font-semibold">
                Transaction Summary
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-blue-200">
                  <span>From:</span>
                  <span className="font-mono">
                    {accounts.find((a) => a.id === fromId)?.name}
                  </span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>To:</span>
                  <span className="font-mono">
                    {accounts.find((a) => a.id === toId)?.name}
                  </span>
                </div>
                <div className="border-t border-blue-700/50 pt-2 mt-2 flex justify-between text-blue-100 font-semibold">
                  <span>Amount:</span>
                  <span>₹{Number(amount).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleTransfer}
              disabled={!isFormValid}
              className={`flex-1 font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                isFormValid
                  ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 cursor-pointer"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed opacity-50"
              }`}
            >
              {loading ? (
                <>
                  <InlineSpinner />
                  Processing...
                </>
              ) : (
                <>
                  <span>💸</span>
                  Transfer
                </>
              )}
            </button>
            <button
              onClick={clearForm}
              disabled={loading}
              className="px-6 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed text-slate-300 font-medium py-3 rounded-lg transition-colors"
            >
              Clear
            </button>
          </div>

          {/* Info Message */}
          <p className="text-xs text-slate-500 text-center pt-2">
            Ensure sufficient funds in source account before transferring
          </p>
        </div>
      </div>
    </div>
  );
}