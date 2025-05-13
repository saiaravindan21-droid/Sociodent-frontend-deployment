import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaCalendarAlt,
  FaHistory,
  FaFileMedical,
  FaPills,
  FaCog,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Sidebar item component
const SidebarItem = ({ icon, label, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer mb-1 transition ${
      active
        ? "bg-blue-100 text-blue-700 font-semibold"
        : "hover:bg-gray-100 text-gray-700"
    }`}
  >
    <span className="text-lg">{icon}</span>
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
  const navigate = useNavigate();

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    const role = localStorage.getItem("userRole") || "";
    setIsAuthenticated(authStatus);
    setUserRole(role);

    if (!authStatus || role !== "user") {
      navigate("/login", { replace: true }); // <- simplified redirect
    }

    const userProfile =
      JSON.parse(localStorage.getItem("userProfile") || "{}") || {};
    setProfile({ ...initialProfile, ...userProfile });
  }, [navigate]);

  if (!isAuthenticated || userRole !== "user") {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7fafd] pt-24">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white rounded-xl shadow-sm p-6 flex flex-col mb-8 md:mb-0">
          <div className="mb-6 text-xl font-bold text-blue-700 flex items-center gap-2">
            <FaUser className="text-blue-500" /> Dashboard
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
              <h1 className="text-2xl font-bold text-blue-900 mb-1">
                Welcome, {profile.fullName || "User"}
              </h1>
              <div className="text-gray-600">{profile.email}</div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            {activeTab === "appointments" && (
              <>
                <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Time</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-700">Action</th>
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
                                statusColors[a.status] || "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            <button className="text-blue-600 hover:underline mr-2">
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
                          <td colSpan={5} className="px-4 py-4 text-center text-gray-500">
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
              <>
                <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><b>Full Name:</b> {profile.fullName}</div>
                  <div><b>Email:</b> {profile.email}</div>
                  <div><b>Phone:</b> {profile.phone}</div>
                  <div><b>Gender:</b> {profile.gender}</div>
                  <div><b>City:</b> {profile.city}</div>
                  <div><b>State:</b> {profile.state}</div>
                  <div><b>Pincode:</b> {profile.pincode}</div>
                  <div><b>Age:</b> {profile.age}</div>
                  <div><b>Disability Type:</b> {profile.disabilityType}</div>
                  <div><b>Category:</b> {profile.category}</div>
                  <div><b>Medical Conditions:</b> {profile.medicalConditions}</div>
                  {/* <div><b>Medications:</b> {profile.medications}</div> */}
                  <div><b>Mode Of Care:</b> {profile.modeOfCare}</div>
                </div>
              </>
            )}

            {activeTab === "history" && (
              <div className="text-gray-500">Appointment history coming soon...</div>
            )}
            {activeTab === "medical" && (
              <div className="text-gray-500">Medical records coming soon...</div>
            )}
            {activeTab === "prescriptions" && (
              <div className="text-gray-500">Prescriptions coming soon...</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MyProfile;
