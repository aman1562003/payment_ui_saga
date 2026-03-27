import { useNavigate, Link } from 'react-router-dom';

export default function Navbar({ userPhone, onLogout, darkMode, setDarkMode }) {
  return (
    <nav className={`${darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200"} border-b px-6 py-4 flex items-center justify-between`}>
      
      {/* Left — Logo */}
      <span className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
        💳 PayFlow
      </span>

      {/* Center — Nav Links */}
      <div className="flex items-center gap-6">
        <a href="/dashboard" className={`text-sm font-medium ${darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"} transition`}>
          Dashboard
        </a>
        <a href="/profile" className={`text-sm font-medium ${darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900"} transition`}>
          Profile
        </a>
      </div>

      {/* Right — Phone + Logout + Toggle */}
      <div className="flex items-center gap-3">
        <span className={`text-sm ${darkMode ? "text-slate-500" : "text-slate-400"}`}>
          📱 {userPhone}
        </span>
        <button
          onClick={onLogout}
          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-sm font-semibold rounded-lg transition"
        >
          Logout
        </button>
        {/* Toggle — rightmost */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
            darkMode
              ? "bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500"
              : "bg-slate-100 border-slate-300 text-slate-700 hover:border-slate-400"
          }`}
        >
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </div>

    </nav>
  );
}