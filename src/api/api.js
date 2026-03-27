import axios from "axios";

// 🎯 BACKEND SERVICES
const USER_SERVICE = process.env.REACT_APP_USER_SERVICE || "http://localhost:8085";
const ORCHESTRATOR = process.env.REACT_APP_API_URL || "http://localhost:8080";

// ============================================
// 🧑 USER SERVICE APIs (Port 8085)
// ============================================

/**
 * Create a new user
 * Auto-creates associated account
 * POST /users/create
 * Body: { phone, email }
 */
export const createUser = (data) =>
  axios.post(`${USER_SERVICE}/users/create`, data);

/**
 * Get user by phone (to check if user exists)
 * GET /users/phone/{phone}
 */
export const getUserByPhone = (phone) =>
  axios.get(`${USER_SERVICE}/users/phone/${phone}`);

// ============================================
// 💰 ACCOUNT SERVICE APIs (via Orchestrator)
// ============================================

/**
 * Add money to account (Top-up)
 * Requires: phone, amount, currency
 */
export const addMoney = (data) =>
  axios.post(`${ORCHESTRATOR}/api/accounts/add-money`, data);

/**
 * Get account details (Debug/optional)
 */
export const getAccount = (accountId) =>
  axios.get(`${ORCHESTRATOR}/api/accounts/${accountId}`);

/**
 * Get all accounts (Mock - for UI demo)
 * Backend returns paginated accounts
 */
export const getAccounts = () =>
  axios.get(`${ORCHESTRATOR}/api/accounts`);

// ============================================
// 💸 PAYMENT SERVICE APIs (via Orchestrator)
// ============================================

/**
 * Transfer money between accounts
 * Main payment endpoint
 * 
 * Body:
 * {
 *   "fromPhone": "9999999991",
 *   "toPhone": "9999999992",
 *   "amount": 1000,
 *   "currency": "INR"
 * }
 * 
 * Query params:
 * ?failLedger=true  → Simulate ledger failure (shows compensation)
 */
export const transfer = (data, fail) =>
  axios.post(
    `${ORCHESTRATOR}/api/payments/transfer${fail ? "?failLedger=true" : ""}`,
    data
  );

// ============================================
// 📊 SAGA TRACKING APIs (via Orchestrator)
// ============================================

/**
 * Get all saga transactions
 * Shows transaction history with status:
 * - PENDING
 * - COMPLETED
 * - COMPENSATED (rolled back)
 * - FAILED
 */
export const getSagas = () =>
  axios.get(`${ORCHESTRATOR}/api/sagas`);

/**
 * Get saga by ID
 */
export const getSagaById = (sagaId) =>
  axios.get(`${ORCHESTRATOR}/api/sagas/${sagaId}`);


export const getAccountByPhone = (phone) =>
  axios.get(`${ORCHESTRATOR}/api/accounts/phoneid/${phone}`);

export const getSagaDetailsByPhone = (phone) =>
  axios.get(`${ORCHESTRATOR}/api/sagas/details-by/${phone}`);