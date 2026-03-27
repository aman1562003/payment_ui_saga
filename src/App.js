import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { getSagas } from "./api/api";
import Layout from "./components/Layout";
import SignIn from "./components/SignIn";
import DashboardPage from "./components/DashboardPage";
import ProfilePage from "./components/ProfilePage";
import Home from "./components/Home";

function App() {
  const [userPhone, setUserPhone] = useState(localStorage.getItem("userPhone"));
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData") || "null")
  );
  const [darkMode, setDarkMode] = useState(true); 

  useEffect(() => {
    const handleStorageChange = () => {
      const phone = localStorage.getItem("userPhone");
      const data = JSON.parse(localStorage.getItem("userData") || "null");
      setUserPhone(phone);
      setUserData(data);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogin = (phone, data) => {
    localStorage.setItem("userPhone", phone);
    localStorage.setItem("userData", JSON.stringify(data));
    setUserPhone(phone);   // ← updates state in same tab
    setUserData(data);
  };

  const handleLogout = () => {
    localStorage.removeItem("userPhone");
    localStorage.removeItem("userData");
    setUserPhone(null);   // ← clears React state
    setUserData(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ element }) => {
    return userPhone ? element : <Navigate to="/" replace />;
  };


  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={userPhone ? <Navigate to="/dashboard" replace /> : <SignIn onLogin={handleLogin} />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute
              element={
                <Layout userPhone={userPhone} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode}>
                  <DashboardPage userPhone={userPhone} darkMode={darkMode} />
                </Layout>
              }
            />
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute
              element={
                <Layout userPhone={userPhone} onLogout={handleLogout} darkMode={darkMode} setDarkMode={setDarkMode}>
                  <ProfilePage userPhone={userPhone} userData={userData} darkMode={darkMode} />
                </Layout>
              }
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;