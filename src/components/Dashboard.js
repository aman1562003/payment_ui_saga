import { useEffect, useState } from 'react';
import { getSagas } from '../api/api';
import { LoadingSpinner } from './LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalAccounts: 0,
    totalTransactions: 0,
    totalVolume: 0,
  });
  const [sagas, setSagas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setStatsLoading(true);
        const res = await getSagas();
        setSagas(res.data);
        
        // Calculate stats
        setStats({
          totalAccounts: 12, // Mock data
          totalTransactions: res.data.length,
          totalVolume: res.data.reduce((sum, saga) => sum + (saga.amount || 0), 0),
        });
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
        setStatsLoading(false);
      }
    };

    loadData();
  }, []);

  const StatCard = ({ icon, label, value, trend, loading }) => (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-2">{label}</p>
          {loading ? (
            <div className="h-8 bg-slate-700 rounded animate-pulse"></div>
          ) : (
            <>
              <p className="text-3xl font-bold text-white">{value}</p>
              {trend && (
                <p className={`text-xs mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% from last month
                </p>
              )}
            </>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Here's your financial overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon="💳"
          label="Total Accounts"
          value={stats.totalAccounts}
          trend={5}
          loading={statsLoading}
        />
        <StatCard
          icon="💸"
          label="Transactions"
          value={stats.totalTransactions}
          trend={12}
          loading={statsLoading}
        />
        <StatCard
          icon="💰"
          label="Total Volume"
          value={`₹${stats.totalVolume.toLocaleString('en-IN')}`}
          trend={8}
          loading={statsLoading}
        />
      </div>

      {/* Recent Transactions */}
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Recent Saga Transactions</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" text="Loading transactions..." />
          </div>
        ) : sagas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">ID</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Amount</th>
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {sagas.slice(0, 5).map((saga, index) => (
                  <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-slate-300">{saga.id?.slice(0, 8)}...</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        saga.status === 'COMPLETED'
                          ? 'bg-green-900/30 text-green-400'
                          : saga.status === 'PENDING'
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}>
                        {saga.status || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300">₹{saga.amount?.toLocaleString('en-IN') || '0'}</td>
                    <td className="py-3 px-4 text-slate-400">{new Date(saga.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-center py-8">No transactions yet</p>
        )}
      </div>
    </div>
  );
}
