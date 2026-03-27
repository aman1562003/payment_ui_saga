import { useEffect, useState } from 'react';
import { getSagas } from '../api/api';
import { LoadingSpinner } from './LoadingSpinner';
import { Toast } from './Toast';

export default function SagaDashboard() {
  const [sagas, setSagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSagas = async () => {
      try {
        setError(null);
        const res = await getSagas();
        setSagas(res.data || []);
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error loading sagas:', error);
        setError('Failed to load transactions');
        setToast({ message: 'Failed to load transactions', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    // Initial load
    loadSagas();

    // Auto-refresh every 2 seconds
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadSagas, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const filteredSagas = sagas.filter(saga => {
    if (filter === 'all') return true;
    return saga.status === filter;
  });

  const getStatusBadge = (status) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide';
    
    switch (status) {
      case 'COMPLETED':
      case 'SUCCESS':
        return `${baseClasses} bg-green-900/40 text-green-300 border border-green-700/60`;
      case 'FAILED':
        return `${baseClasses} bg-red-900/40 text-red-300 border border-red-700/60`;
      case 'PENDING':
        return `${baseClasses} bg-yellow-900/40 text-yellow-300 border border-yellow-700/60`;
      default:
        return `${baseClasses} bg-slate-700/40 text-slate-300 border border-slate-600/60`;
    }
  };

  const getStepBadge = (step) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-semibold text-white';
    
    switch (step) {
      case 'ACCOUNT':
        return `${baseClasses} bg-blue-600`;
      case 'LEDGER':
        return `${baseClasses} bg-cyan-600`;
      case 'NOTIFICATION':
        return `${baseClasses} bg-purple-600`;
      default:
        return `${baseClasses} bg-slate-600`;
    }
  };

  const StatsPill = ({ icon, label, count, color }) => (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-${color}-900/20 border border-${color}-700/50`}>
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-xs text-slate-500">{label}</p>
        <p className={`text-lg font-bold text-${color}-400`}>{count}</p>
      </div>
    </div>
  );

  const stats = {
    total: sagas.length,
    success: sagas.filter(s => s.status === 'COMPLETED' || s.status === 'SUCCESS').length,
    pending: sagas.filter(s => s.status === 'PENDING').length,
    failed: sagas.filter(s => s.status === 'FAILED').length,
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Saga Dashboard</h1>
          <p className="text-slate-400">Real-time distributed transaction monitoring</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className={`${autoRefresh ? 'animate-pulse text-green-400' : ''}`}>
            🔄 Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Statistics Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsPill icon="📊" label="Total" count={stats.total} color="slate" />
        <StatsPill icon="✅" label="Success" count={stats.success} color="green" />
        <StatsPill icon="⏳" label="Pending" count={stats.pending} color="yellow" />
        <StatsPill icon="❌" label="Failed" count={stats.failed} color="red" />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'PENDING', 'COMPLETED', 'FAILED'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                filter === status
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* Auto-refresh Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              autoRefresh
                ? 'bg-green-900/30 text-green-400 border border-green-700/50'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            <span>{autoRefresh ? '⏸' : '▶'}</span>
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shadow-xl">
        {loading && sagas.length === 0 ? (
          <div className="p-12">
            <div className="flex justify-center">
              <LoadingSpinner size="lg" text="Loading transactions..." />
            </div>
          </div>
        ) : filteredSagas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              {/* Table Header */}
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/50">
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Transaction ID</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Status</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Current Step</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Error</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Amount</th>
                  <th className="text-left py-4 px-6 text-slate-300 font-semibold">Created</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredSagas.map((saga, index) => (
                  <tr
                    key={index}
                    className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors duration-150"
                  >
                    {/* Transaction ID */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="text-white font-mono text-xs lg:text-sm">
                          {saga.transactionId?.slice(0, 16)}
                        </span>
                        {saga.transactionId?.length > 16 && (
                          <span className="text-slate-600 font-mono text-xs">
                            {saga.transactionId?.slice(16, 32)}...
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(saga.status)}>
                        {saga.status || 'UNKNOWN'}
                      </span>
                    </td>

                    {/* Current Step */}
                    <td className="py-4 px-6">
                      <span className={getStepBadge(saga.currentStep)}>
                        {saga.currentStep || '—'}
                      </span>
                    </td>

                    {/* Error Message */}
                    <td className="py-4 px-6">
                      {saga.error ? (
                        <div className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">⚠️</span>
                          <span className="text-red-300 text-xs max-w-xs">
                            {saga.error}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs">—</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 text-slate-200 font-semibold">
                      {saga.amount ? `₹${saga.amount.toLocaleString('en-IN')}` : '—'}
                    </td>

                    {/* Created Date */}
                    <td className="py-4 px-6 text-slate-400 text-xs whitespace-nowrap">
                      {saga.createdAt
                        ? new Date(saga.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-slate-400">No transactions found</p>
            <p className="text-slate-600 text-sm mt-2">
              {filter !== 'all' ? `No ${filter.toLowerCase()} transactions yet` : 'Start by creating a transaction'}
            </p>
          </div>
        )}
      </div>

      {/* Summary Footer */}
      {filteredSagas.length > 0 && (
        <div className="mt-4 text-right text-xs text-slate-500">
          Showing {filteredSagas.length} of {sagas.length} transaction{sagas.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}