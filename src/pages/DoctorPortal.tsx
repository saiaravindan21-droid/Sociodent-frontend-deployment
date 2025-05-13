import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MessageSquare, FileText, Settings, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const DoctorPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [activeTab, setActiveTab] = useState('appointments');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get doctor name from localStorage
  const doctorName = localStorage.getItem("userName") || "";

  // Check authentication and role
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole') || '';
    setIsAuthenticated(authStatus);
    setUserRole(role);
    if (!authStatus || role !== 'doctor') {
      toast({
        title: "Access Denied",
        description: "You must be logged in as a doctor to access this page",
        variant: "destructive"
      });
      navigate('/auth?mode=login&role=doctor', { replace: true });
    }
  }, [navigate, toast]);

  if (!isAuthenticated || userRole !== 'doctor') {
    return null;
  }

  const tabs = [
    { id: 'appointments', name: 'Appointments', icon: <Calendar className="w-5 h-5 mr-2" /> },
    { id: 'patients', name: 'My Patients', icon: <Users className="w-5 h-5 mr-2" /> },
    { id: 'consultations', name: 'Virtual Consultations', icon: <MessageSquare className="w-5 h-5 mr-2" /> },
    { id: 'prescriptions', name: 'Prescriptions', icon: <FileText className="w-5 h-5 mr-2" /> },
    { id: 'records', name: 'Patient Records', icon: <ClipboardList className="w-5 h-5 mr-2" /> },
    { id: 'settings', name: 'Profile Settings', icon: <Settings className="w-5 h-5 mr-2" /> }
  ];

  // Mock data
  const appointments = [
    { id: 1, patient: 'Sarah Johnson', time: '9:00 AM', date: 'Today', type: 'Check-up', status: 'confirmed' },
    { id: 2, patient: 'Michael Chen', time: '10:30 AM', date: 'Today', type: 'Root Canal', status: 'confirmed' },
    { id: 3, patient: 'Emily Rodriguez', time: '1:00 PM', date: 'Today', type: 'Consultation', status: 'confirmed' },
    { id: 4, patient: 'David Wilson', time: '3:30 PM', date: 'Today', type: 'Cleaning', status: 'confirmed' },
    { id: 5, patient: 'Lisa Thompson', time: '9:30 AM', date: 'Tomorrow', type: 'Check-up', status: 'confirmed' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* If you have a fixed Navbar, it should be above this main block */}
      <main className="flex-grow pt-24"> {/* pt-24 = padding-top: 6rem, ensures nothing overlaps */}
        <div className="container-custom py-8">
          <div className="mb-12">
            <h1 className="text-2xl font-bold text-sociodent-700 mb-2">
              Welcome Dr. {doctorName}
            </h1>
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Doctor Portal</h2>
            <p className="text-gray-600">Manage your appointments, patients, and consultations</p>
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-64 bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={cn(
                      "w-full flex items-center px-4 py-3 rounded-lg transition-colors",
                      activeTab === tab.id 
                        ? "bg-sociodent-100 text-sociodent-700" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            {/* Main Content */}
            <div className="flex-1 bg-white rounded-xl shadow-sm p-6">
              {activeTab === 'appointments' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Today's Appointments</h2>
                    {/* "+ Add Appointment" button removed */}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Patient</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Time</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Date</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                          <th className="px-4 py-3 text-left font-medium text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr key={appointment.id} className="border-b">
                            <td className="px-4 py-4">{appointment.patient}</td>
                            <td className="px-4 py-4">{appointment.time}</td>
                            <td className="px-4 py-4">{appointment.date}</td>
                            <td className="px-4 py-4">{appointment.type}</td>
                            <td className="px-4 py-4">
                              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex space-x-2">
                                <button className="text-sociodent-600 hover:text-sociodent-700">View</button>
                                <button className="text-gray-600 hover:text-gray-700">Edit</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {activeTab === 'patients' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">My Patients</h2>
                  <p className="text-gray-600">View and manage your patient list.</p>
                </div>
              )}
              {activeTab === 'consultations' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Virtual Consultations</h2>
                  <p className="text-gray-600">Manage your upcoming virtual appointments.</p>
                </div>
              )}
              {activeTab === 'prescriptions' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Prescriptions</h2>
                  <p className="text-gray-600">Create and manage patient prescriptions.</p>
                </div>
              )}
              {activeTab === 'records' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Patient Records</h2>
                  <p className="text-gray-600">Access and update patient medical records.</p>
                </div>
              )}
              {activeTab === 'settings' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>
                  <p className="text-gray-600">Update your profile information and preferences.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DoctorPortal;
