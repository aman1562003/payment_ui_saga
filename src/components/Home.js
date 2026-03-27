import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="max-w-2xl text-center px-4">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="text-6xl mb-4 animate-bounce">💰</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Saga <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">FinTech</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8">
            Professional Distributed Transaction Orchestration Platform
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-blue-600 transition-colors">
            <span className="text-4xl mb-3 block">🚀</span>
            <h3 className="text-lg font-bold text-white mb-2">Fast Transactions</h3>
            <p className="text-slate-400 text-sm">Lightning-fast distributed payments with guaranteed ACID properties</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-cyan-600 transition-colors">
            <span className="text-4xl mb-3 block">🔒</span>
            <h3 className="text-lg font-bold text-white mb-2">Secure & Reliable</h3>
            <p className="text-slate-400 text-sm">Enterprise-grade security with saga pattern for distributed transactions</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-green-600 transition-colors">
            <span className="text-4xl mb-3 block">📊</span>
            <h3 className="text-lg font-bold text-white mb-2">Real-time Monitoring</h3>
            <p className="text-slate-400 text-sm">Live dashboard tracking all transaction states and orchestration steps</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-purple-600 transition-colors">
            <span className="text-4xl mb-3 block">⚙️</span>
            <h3 className="text-lg font-bold text-white mb-2">Easy Management</h3>
            <p className="text-slate-400 text-sm">Intuitive interface for account management and fund transfers</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-8 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50"
          >
            Go to Dashboard →
          </button>
          <button
            onClick={() => navigate('/accounts')}
            className="border-2 border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Create an Account
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            Powered by Saga Pattern • Built with React & TailwindCSS
          </p>
        </div>
      </div>
    </div>
  );
}
