import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaHistory,
  FaFileMedical,
  FaPills,
  FaCog,
  FaEdit,
  FaLock,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Sidebar item component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1 transition ${
      active
        ? "bg-[#e6f0fa] text-[#0e5d9f] font-semibold"
        : "hover:bg-gray-100 text-gray-700"
    }`}
  >
    <span className={`text-lg ${active ? "text-[#0e5d9f]" : ""}`}>{icon}</span>
    <span>{label}</span>
  </div>
);

const mockAppointments = [
  {
    id: 1,
    time: "10:00 AM",
    date: "2025-06-01",
    type: "Check-up",
    status: "confirmed",
  },
  {
    id: 2,
    time: "2:00 PM",
    date: "2025-06-03",
    type: "Cleaning",
    status: "pending",
  },
];

const statusColors = {
  confirmed: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-gray-200 text-gray-800",
};

const initialProfile = {
  fullName: "",
  email: "",
  phone: "",
  gender: "",
  city: "",
  state: "",
  pincode: "",
  age: "",
  disabilityType: "",
  category: "",
  medicalConditions: "",
  medications: "",
  modeOfCare: "",
};

const MyProfile = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [profile, setProfile] = useState(initialProfile);
  const [activeTab, setActiveTab] = useState("appointments");
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [profileError, setProfileError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("userRole") || "";
    setIsAuthenticated(authStatus);
    setUserRole(role);

    if (!authStatus || role !== "user") {
      navigate("/login", { replace: true });
    }

    const userProfile =
      JSON.parse(localStorage.getItem("userProfile") || "{}") || {};
    setProfile({ ...initialProfile, ...userProfile });
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const saveProfileChanges = () => {
    setProfileError("");
    setSuccessMessage("");

    // Basic validation
    if (!profile.fullName || !profile.email || !profile.phone) {
      setProfileError("Please fill in all required fields");
      return;
    }

    // Update in localStorage
    localStorage.setItem("userProfile", JSON.stringify(profile));
    localStorage.setItem("userName", profile.fullName);

    setSuccessMessage("Profile updated successfully!");
    setIsEditing(false);
    window.dispatchEvent(new Event("authChange"));
  };

  const handlePasswordChange = () => {
    setPasswordError("");
    setSuccessMessage("");

    if (!currentPassword) {
      setPasswordError("Please enter your current password");
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    // In a real app, you would verify current password with the server
    // and then update the password if verification succeeds
    // For this demo, we'll just simulate success

    setSuccessMessage("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowChangePassword(false);
  };

  if (!isAuthenticated || userRole !== "user") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7fafd] pt-24">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-6 flex flex-col mb-8 md:mb-0">
          <div className="mb-6 text-xl font-bold flex items-center gap-2 text-[#0e5d9f]">
            <FaUser className="text-[#0e5d9f]" /> Dashboard
          </div>
          <SidebarItem
            icon={<FaCalendarAlt />}
            label="Appointments"
            active={activeTab === "appointments"}
            onClick={() => setActiveTab("appointments")}
          />
          <SidebarItem
            icon={<FaHistory />}
            label="History"
            active={activeTab === "history"}
            onClick={() => setActiveTab("history")}
          />
          <SidebarItem
            icon={<FaFileMedical />}
            label="Medical Records"
            active={activeTab === "medical"}
            onClick={() => setActiveTab("medical")}
          />
          <SidebarItem
            icon={<FaPills />}
            label="Prescriptions"
            active={activeTab === "prescriptions"}
            onClick={() => setActiveTab("prescriptions")}
          />
          <SidebarItem
            icon={<FaCog />}
            label="Profile Settings"
            active={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-8">
          {/* Welcome Card */}
          <div className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-5">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-[#0e5d9f]">
                Welcome, {profile.fullName || "User"}
              </h1>
              <div className="text-gray-600">{profile.email}</div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === "appointments" && (
              <>
                <h2 className="text-xl font-semibold mb-4 text-[#0e5d9f]">
                  Your Appointments
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Time
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Type
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockAppointments.map((a) => (
                        <tr key={a.id} className="border-b">
                          <td className="px-4 py-4">{a.time}</td>
                          <td className="px-4 py-4">{a.date}</td>
                          <td className="px-4 py-4">{a.type}</td>
                          <td className="px-4 py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                statusColors[a.status] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-[#0e5d9f] hover:underline mr-2">
                              View
                            </button>
                            <button className="text-red-600 hover:underline">
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))}
                      {mockAppointments.length === 0 && (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-4 text-center text-gray-500"
                          >
                            No appointments found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeTab === "profile" && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#0e5d9f]">
                    Profile Information
                  </h2>
                  {!isEditing && !showChangePassword && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-3 py-1 bg-[#0e5d9f] text-white rounded hover:bg-[#0c4d84]"
                      >
                        <FaEdit /> Edit Profile
                      </button>
                      <button
                        onClick={() => setShowChangePassword(true)}
                        className="flex items-center gap-2 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700"
                      >
                        <FaLock /> Change Password
                      </button>
                    </div>
                  )}
                </div>

                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                    {successMessage}
                  </div>
                )}

                {!isEditing && !showChangePassword && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <b>Full Name:</b> {profile.fullName}
                    </div>
                    <div>
                      <b>Email:</b> {profile.email}
                    </div>
                    <div>
                      <b>Phone:</b> {profile.phone}
                    </div>
                    <div>
                      <b>Gender:</b> {profile.gender}
                    </div>
                    <div>
                      <b>City:</b> {profile.city}
                    </div>
                    <div>
                      <b>State:</b> {profile.state}
                    </div>
                    <div>
                      <b>Pincode:</b> {profile.pincode}
                    </div>
                    <div>
                      <b>Age:</b> {profile.age}
                    </div>
                    <div>
                      <b>Disability Type:</b> {profile.disabilityType}
                    </div>
                    <div>
                      <b>Category:</b> {profile.category}
                    </div>
                    <div>
                      <b>Medical Conditions:</b> {profile.medicalConditions}
                    </div>
                    <div>
                      <b>Mode Of Care:</b> {profile.modeOfCare}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <div>
                    {profileError && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {profileError}
                      </div>
                    )}
                    <form>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-1 font-medium">
                            Full Name*
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={profile.fullName}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Email*
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profile.email}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Phone*
                          </label>
                          <input
                            type="text"
                            name="phone"
                            value={profile.phone}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Gender
                          </label>
                          <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          >
                            <option value="">Select</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">City</label>
                          <input
                            type="text"
                            name="city"
                            value={profile.city}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">State</label>
                          <input
                            type="text"
                            name="state"
                            value={profile.state}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Pincode
                          </label>
                          <input
                            type="text"
                            name="pincode"
                            value={profile.pincode}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">Age</label>
                          <input
                            type="number"
                            name="age"
                            value={profile.age}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Disability Type
                          </label>
                          <input
                            type="text"
                            name="disabilityType"
                            value={profile.disabilityType}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block mb-1 font-medium">
                            Category
                          </label>
                          <input
                            type="text"
                            name="category"
                            value={profile.category}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block mb-1 font-medium">
                            Medical Conditions
                          </label>
                          <textarea
                            name="medicalConditions"
                            value={profile.medicalConditions}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                            rows={3}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block mb-1 font-medium">
                            Mode Of Care
                          </label>
                          <input
                            type="text"
                            name="modeOfCare"
                            value={profile.modeOfCare}
                            onChange={handleProfileChange}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2"
                        >
                          <FaTimes /> Cancel
                        </button>
                        <button
                          type="button"
                          onClick={saveProfileChanges}
                          className="px-4 py-2 bg-[#0e5d9f] text-white rounded hover:bg-[#0c4d84] flex items-center gap-2"
                        >
                          <FaCheck /> Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {showChangePassword && (
                  <div>
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                        {passwordError}
                      </div>
                    )}
                    <form className="max-w-md">
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">
                          Current Password*
                        </label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">
                          New Password*
                        </label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          required
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Must be at least 6 characters
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="block mb-1 font-medium">
                          Confirm New Password*
                        </label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full border border-gray-300 rounded px-3 py-2"
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowChangePassword(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2"
                        >
                          <FaTimes /> Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handlePasswordChange}
                          className="px-4 py-2 bg-[#0e5d9f] text-white rounded hover:bg-[#0c4d84] flex items-center gap-2"
                        >
                          <FaCheck /> Change Password
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="text-gray-500">
                Appointment history coming soon...
              </div>
            )}
            {activeTab === "medical" && (
              <div className="text-gray-500">
                Medical records coming soon...
              </div>
            )}
            {activeTab === "prescriptions" && (
              <div className="text-gray-500">
                Prescriptions coming soon...
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyProfile;