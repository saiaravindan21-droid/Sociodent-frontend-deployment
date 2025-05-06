// src/pages/Profile.tsx

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserCircle, LogOut } from "lucide-react";

const Profile: React.FC = () => {
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage (or your auth context)
    const name = localStorage.getItem("userName") || "User";
    setUserName(name);
    // If you store email or other info, get it here:
    const profile = localStorage.getItem("userProfile");
    if (profile) {
      try {
        const parsed = JSON.parse(profile);
        setUserEmail(parsed.email || "");
      } catch {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userProfile");
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar will be rendered at the top by App.tsx */}
      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 mt-16">
          <div className="flex flex-col items-center">
            <div
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <UserCircle className="w-20 h-20 text-blue-500" />
              <div className="mt-2 text-xl font-bold">{userName}</div>
              <div className="text-gray-500">{userEmail}</div>
              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                  <div className="p-4">
                    <div className="font-semibold">{userName}</div>
                    <div className="text-xs text-gray-500">{userEmail}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold mb-2">Welcome to SocioDent!</h2>
            <p className="text-gray-600">
              This is your profile page. Use the menu at the top right to access your profile info or log out.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
