// Mock Data for Saga Dashboard Testing
// Copy this into your backend or use it to test the dashboard UI

export const mockSagaData = [
  {
    id: 1,
    transactionId: "550e8400-e29b-41d4-a716-446655440000",
    status: "COMPLETED",
    currentStep: "NOTIFICATION",
    amount: 1500.00,
    createdAt: "2024-01-15T10:30:00Z",
    error: null,
  },
  {
    id: 2,
    transactionId: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    status: "FAILED",
    currentStep: "LEDGER",
    amount: 2500.00,
    createdAt: "2024-01-15T10:25:30Z",
    error: "Insufficient funds in source account",
  },
  {
    id: 3,
    transactionId: "6ba7b811-9dad-11d1-80b4-00c04fd430c9",
    status: "PENDING",
    currentStep: "ACCOUNT",
    amount: 750.50,
    createdAt: "2024-01-15T10:20:15Z",
    error: null,
  },
  {
    id: 4,
    transactionId: "6ba7b812-9dad-11d1-80b4-00c04fd430ca",
    status: "COMPLETED",
    currentStep: "NOTIFICATION",
    amount: 3200.00,
    createdAt: "2024-01-15T10:15:45Z",
    error: null,
  },
  {
    id: 5,
    transactionId: "6ba7b813-9dad-11d1-80b4-00c04fd430cb",
    status: "PENDING",
    currentStep: "LEDGER",
    amount: 500.00,
    createdAt: "2024-01-15T10:10:20Z",
    error: null,
  },
  {
    id: 6,
    transactionId: "6ba7b814-9dad-11d1-80b4-00c04fd430cc",
    status: "FAILED",
    currentStep: "ACCOUNT",
    amount: 1000.00,
    createdAt: "2024-01-15T10:05:00Z",
    error: "Account locked",
  },
  {
    id: 7,
    transactionId: "6ba7b815-9dad-11d1-80b4-00c04fd430cd",
    status: "COMPLETED",
    currentStep: "NOTIFICATION",
    amount: 2000.00,
    createdAt: "2024-01-15T10:00:30Z",
    error: null,
  },
  {
    id: 8,
    transactionId: "6ba7b816-9dad-11d1-80b4-00c04fd430ce",
    status: "PENDING",
    currentStep: "ACCOUNT",
    amount: 800.00,
    createdAt: "2024-01-15T09:55:10Z",
    error: null,
  },
];

/**
 * Sample Response Format for /api/sagas endpoint
 * 
 * Expected API Response:
 */
export const sampleApiResponse = {
  data: mockSagaData,
  status: 200,
  message: "Sagas retrieved successfully",
};

/**
 * Test Data Generator
 * Use this to generate random saga data for load testing
 */
export const generateRandomSaga = (id) => {
  const statuses = ["COMPLETED", "FAILED", "PENDING"];
  const steps = ["ACCOUNT", "LEDGER", "NOTIFICATION"];
  const errors = [
    null,
    "Insufficient funds",
    "Account locked",
    "Network timeout",
    "Invalid recipient",
    "Daily limit exceeded",
  ];

  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomStep = steps[Math.floor(Math.random() * steps.length)];
  const hasError = randomStatus === "FAILED" && Math.random() > 0.3;
  const randomError = errors[Math.floor(Math.random() * errors.length)];

  return {
    id,
    transactionId: `transaction-${id}-${Date.now()}`,
    status: randomStatus,
    currentStep: randomStep,
    amount: Math.random() * 5000,
    createdAt: new Date(Date.now() - Math.random() * 3600000).toISOString(),
    error: hasError ? randomError : null,
  };
};

/**
 * Generate batch of test sagas
 */
export const generateMockSagas = (count = 20) => {
  return Array.from({ length: count }, (_, i) => generateRandomSaga(i + 1));
};

/**
 * Simulate API Response with delay
 */
export const mockGetSagas = (delayMs = 500) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: mockSagaData,
      });
    }, delayMs);
  });
};

/**
 * Filter mock data by status
 */
export const filterSagasByStatus = (status) => {
  if (status === "all") return mockSagaData;
  return mockSagaData.filter((saga) => saga.status === status);
};

/**
 * Statistics from mock data
 */
export const getMockStatistics = () => {
  const all = mockSagaData;
  const completed = all.filter((s) => s.status === "COMPLETED");
  const pending = all.filter((s) => s.status === "PENDING");
  const failed = all.filter((s) => s.status === "FAILED");
  const totalVolume = all.reduce((sum, s) => sum + s.amount, 0);

  return {
    total: all.length,
    completed: completed.length,
    pending: pending.length,
    failed: failed.length,
    volume: totalVolume,
    successRate: ((completed.length / all.length) * 100).toFixed(1),
  };
};

/**
 * Column Configuration for Table
 */
export const tableColumns = [
  {
    key: "transactionId",
    label: "Transaction ID",
    width: "20%",
  },
  {
    key: "status",
    label: "Status",
    width: "12%",
  },
  {
    key: "currentStep",
    label: "Current Step",
    width: "12%",
  },
  {
    key: "error",
    label: "Error",
    width: "25%",
  },
  {
    key: "amount",
    label: "Amount",
    width: "15%",
  },
  {
    key: "createdAt",
    label: "Created",
    width: "16%",
  },
];

/**
 * Status Badge Configuration
 */
export const statusConfig = {
  COMPLETED: {
    color: "green",
    icon: "✅",
    label: "Completed",
    badgeClass: "bg-green-900/40 text-green-300 border-green-700/60",
  },
  SUCCESS: {
    color: "green",
    icon: "✅",
    label: "Success",
    badgeClass: "bg-green-900/40 text-green-300 border-green-700/60",
  },
  FAILED: {
    color: "red",
    icon: "❌",
    label: "Failed",
    badgeClass: "bg-red-900/40 text-red-300 border-red-700/60",
  },
  PENDING: {
    color: "yellow",
    icon: "⏳",
    label: "Pending",
    badgeClass: "bg-yellow-900/40 text-yellow-300 border-yellow-700/60",
  },
};

/**
 * Step Badge Configuration
 */
export const stepConfig = {
  ACCOUNT: {
    icon: "💳",
    color: "bg-blue-600",
  },
  LEDGER: {
    icon: "📚",
    color: "bg-cyan-600",
  },
  NOTIFICATION: {
    icon: "🔔",
    color: "bg-purple-600",
  },
};

/**
 * Format functions for display
 */
export const formatters = {
  date: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },
  amount: (amount) => {
    return `$${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  },
  transactionId: (id) => {
    return id?.slice(0, 16) + (id?.length > 16 ? "..." : "");
  },
};

/**
 * Example Usage in Component:
 * 
 * import { mockGetSagas, generateMockSagas, getMockStatistics } from './mockData';
 * 
 * useEffect(() => {
 *   const loadData = async () => {
 *     try {
 *       const response = await mockGetSagas(500);
 *       setSagas(response.data);
 *       const stats = getMockStatistics();
 *       console.log('Statistics:', stats);
 *     } catch (error) {
 *       console.error('Error:', error);
 *     }
 *   };
 * 
 *   loadData();
 * }, []);
 */
