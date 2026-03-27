import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout({ userPhone, onLogout, darkMode, setDarkMode, children }) {
  return (
    <div className={`flex flex-col h-screen ${darkMode ? "bg-slate-950" : "bg-slate-100"}`}>
      <Navbar userPhone={userPhone} onLogout={onLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
      <main className="flex-1 overflow-auto pt-6 pb-6">
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
