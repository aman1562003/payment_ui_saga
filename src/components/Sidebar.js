import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Transfer', path: '/transfer', icon: '💸' },
    { name: 'Accounts', path: '/accounts', icon: '🧾' },
    { name: 'Saga Dashboard', path: '/saga-dashboard', icon: '🚀' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div
      className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-slate-900 border-r border-slate-800 h-screen fixed left-0 top-16 transition-all duration-300 overflow-hidden flex flex-col`}
    >
      {/* Logo Section */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {isOpen && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                S
              </span>
              <span className={`${!isOpen && 'hidden'} text-sm font-bold text-slate-100`}>
                Saga
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && <span className="font-medium">{item.name}</span>}
          </button>
        ))}
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-center py-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
          title={isOpen ? 'Collapse' : 'Expand'}
        >
          {isOpen ? '◀' : '▶'}
        </button>
      </div>
    </div>
  );
}
