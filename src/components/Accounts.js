import { useState, useEffect } from "react";
import { createUser, getAccounts, addMoney } from "../api/api";
import { LoadingSpinner, InlineSpinner } from "./LoadingSpinner";
import { Toast } from "./Toast";

/**
 * Accounts Component - UPI-like Payment System
 * 
 * This component demonstrates the microservices payment flow:
 * 1. Create users (phone + email) → Auto-creates account via orchestrator
 * 2. Add money (Top-up) to accounts
 * 3. View all accounts with balances
 */
export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showCreateUserForm, setShowCreateUserForm] = useState(false);
  const [showAddMoneyForm, setShowAddMoneyForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // Create User Form State
  const [createUserForm, setCreateUserForm] = useState({
    phone: "",
    email: "",
  });

  // Add Money Form State
  const [addMoneyForm, setAddMoneyForm] = useState({
    phone: "",
    amount: "",
  });

  // Load accounts on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  // ============================================
  // Load Accounts
  // ============================================
  const loadAccounts = async () => {
    setLoading(true);
    try {
      const response = await getAccounts();
      setAccounts(response.data || []);
    } catch (error) {
      console.error("Failed to load accounts:", error);
      showToast("Failed to load accounts", "error");
      // Mock data for demo
      setAccounts([
        {
          phone: "9999999991",
          name: "John Doe",
          balance: 50000,
          currency: "INR",
          status: "Active",
          email: "john@test.com",
          createdAt: "2024-01-15",
        },
        {
          phone: "9999999992",
          name: "Jane Smith",
          balance: 125000,
          currency: "INR",
          status: "Active",
          email: "jane@test.com",
          createdAt: "2024-01-10",
        },
        {
          phone: "9999999993",
          name: "Bob Johnson",
          balance: 87500,
          currency: "INR",
          status: "Active",
          email: "bob@test.com",
          createdAt: "2024-01-20",
        },
        {
          phone: "9999999994",
          name: "Alice Williams",
          balance: 152000,
          currency: "INR",
          status: "Active",
          email: "alice@test.com",
          createdAt: "2024-01-05",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // ============================================
  // Create User (UPI-like)
  // ============================================
  const validateCreateUserForm = () => {
    const newErrors = {};

    if (!createUserForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(createUserForm.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!createUserForm.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createUserForm.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    if (!validateCreateUserForm()) {
      return;
    }

    setCreating(true);
    try {
      await createUser({
        phone: createUserForm.phone,
        email: createUserForm.email,
      });

      showToast("User created! Account auto-created. 🎉", "success");
      setCreateUserForm({ phone: "", email: "" });
      setShowCreateUserForm(false);
      setErrors({});

      // Reload accounts
      await loadAccounts();
    } catch (error) {
      console.error("Failed to create user:", error);
      showToast(
        error.response?.data?.message || "Failed to create user",
        "error"
      );
    } finally {
      setCreating(false);
    }
  };

  // ============================================
  // Add Money (Top-up)
  // ============================================
  const validateAddMoneyForm = () => {
    const newErrors = {};

    if (!addMoneyForm.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(addMoneyForm.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!addMoneyForm.amount) {
      newErrors.amount = "Amount is required";
    } else if (Number(addMoneyForm.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    } else if (Number(addMoneyForm.amount) > 10000000) {
      newErrors.amount = "Amount cannot exceed ₹1,00,00,000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();

    if (!validateAddMoneyForm()) {
      return;
    }

    setCreating(true);
    try {
      await addMoney({
        phone: addMoneyForm.phone,
        amount: Number(addMoneyForm.amount),
        currency: "INR",
      });

      showToast("Money added successfully! 💰", "success");
      setAddMoneyForm({ phone: "", amount: "" });
      setShowAddMoneyForm(false);
      setErrors({});

      // Reload accounts
      await loadAccounts();
    } catch (error) {
      console.error("Failed to add money:", error);
      showToast(error.response?.data?.message || "Failed to add money", "error");
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    if (form === "createUser") {
      setCreateUserForm((prev) => ({ ...prev, [name]: value }));
    } else if (form === "addMoney") {
      setAddMoneyForm((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ============================================
  // Helper Functions
  // ============================================
  const formatCurrency = (amount) => {
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Calculate statistics
  const totalAccounts = accounts.length;
  const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
  const averageBalance = totalAccounts > 0 ? totalBalance / totalAccounts : 0;

  // ============================================
  // Render
  // ============================================
  return (
    <div className="min-h-screen bg-slate-950 p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-white">💰 Accounts</h1>
          <div className="flex gap-2">
            <button
              onClick={loadAccounts}
              disabled={loading}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              🔄 Refresh
            </button>
            <button
              onClick={() => setShowCreateUserForm(!showCreateUserForm)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-colors font-medium"
            >
              + Create User
            </button>
            <button
              onClick={() => setShowAddMoneyForm(!showAddMoneyForm)}
              className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg transition-colors font-medium"
            >
              + Add Money
            </button>
          </div>
        </div>
        <p className="text-slate-400">Manage UPI-like accounts powered by Saga microservices</p>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Create User Form */}
      {showCreateUserForm && (
        <div className="mb-8 bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-white mb-6">Create New User</h2>
          <form onSubmit={handleCreateUser} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-white font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={createUserForm.phone}
                onChange={(e) => handleInputChange(e, "createUser")}
                placeholder="e.g., 9999999991"
                maxLength="10"
                className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.phone ? "border-red-500" : "border-slate-600"
                }`}
                disabled={creating}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={createUserForm.email}
                onChange={(e) => handleInputChange(e, "createUser")}
                placeholder="user@example.com"
                className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors ${
                  errors.email ? "border-red-500" : "border-slate-600"
                }`}
                disabled={creating}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <InlineSpinner />
                    Creating...
                  </>
                ) : (
                  "Create User"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateUserForm(false);
                  setCreateUserForm({ phone: "", email: "" });
                  setErrors({});
                }}
                disabled={creating}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Money Form */}
      {showAddMoneyForm && (
        <div className="mb-8 bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-white mb-6">Add Money (Top-up)</h2>
          <form onSubmit={handleAddMoney} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-white font-medium mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={addMoneyForm.phone}
                onChange={(e) => handleInputChange(e, "addMoney")}
                placeholder="e.g., 9999999991"
                maxLength="10"
                className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors ${
                  errors.phone ? "border-red-500" : "border-slate-600"
                }`}
                disabled={creating}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="block text-white font-medium mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                name="amount"
                value={addMoneyForm.amount}
                onChange={(e) => handleInputChange(e, "addMoney")}
                placeholder="e.g., 5000"
                min="0"
                step="1"
                className={`w-full px-4 py-2 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-green-500 transition-colors ${
                  errors.amount ? "border-red-500" : "border-slate-600"
                }`}
                disabled={creating}
              />
              {errors.amount && (
                <p className="text-red-400 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={creating}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <InlineSpinner />
                    Adding...
                  </>
                ) : (
                  "Add Money"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddMoneyForm(false);
                  setAddMoneyForm({ phone: "", amount: "" });
                  setErrors({});
                }}
                disabled={creating}
                className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-900/40 to-blue-800/20 border border-blue-700/30 rounded-lg p-6">
          <p className="text-blue-400 text-sm font-medium mb-2">Total Accounts</p>
          <p className="text-3xl font-bold text-white">{totalAccounts}</p>
          <p className="text-blue-400/60 text-xs mt-2">Active accounts</p>
        </div>

        <div className="bg-gradient-to-br from-green-900/40 to-green-800/20 border border-green-700/30 rounded-lg p-6">
          <p className="text-green-400 text-sm font-medium mb-2">Total Balance</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(totalBalance)}</p>
          <p className="text-green-400/60 text-xs mt-2">Across all accounts</p>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-700/30 rounded-lg p-6">
          <p className="text-purple-400 text-sm font-medium mb-2">Average Balance</p>
          <p className="text-3xl font-bold text-white">{formatCurrency(averageBalance)}</p>
          <p className="text-purple-400/60 text-xs mt-2">Per account</p>
        </div>
      </div>

      {/* Accounts Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 h-64 animate-pulse"
            >
              <div className="h-6 bg-slate-700 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-slate-700 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-slate-700 rounded w-2/5"></div>
            </div>
          ))}
        </div>
      ) : accounts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.phone}
              className="bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              {/* Phone & Status */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-400 text-xs">Phone</p>
                  <p className="text-white font-bold text-lg">{account.phone}</p>
                </div>
                <span className="px-3 py-1 bg-green-900/30 border border-green-700 text-green-400 text-xs font-medium rounded-full">
                  {account.status || "Active"}
                </span>
              </div>

              {/* Name */}
              <div className="mb-4">
                <p className="text-slate-400 text-xs mb-1">Account Owner</p>
                <p className="text-white font-semibold">{account.name}</p>
              </div>

              {/* Balance */}
              <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-700/30 rounded-lg p-4 mb-4">
                <p className="text-blue-400 text-xs font-medium mb-1">Balance</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(account.balance || 0)}
                </p>
              </div>

              {/* Created Date */}
              <div className="border-t border-slate-700 pt-4">
                <p className="text-slate-400 text-xs">
                  Created {formatDate(account.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-block p-4 bg-slate-800 rounded-full mb-4">
            <span className="text-4xl">💼</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Accounts Yet</h3>
          <p className="text-slate-400 mb-6">Create your first user to get started</p>
          <button
            onClick={() => setShowCreateUserForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg transition-colors font-medium"
          >
            Create User
          </button>
        </div>
      )}
    </div>
  );
}
