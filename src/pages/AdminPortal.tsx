import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, BarChart, ShoppingBag, Settings, Database, Shield, FileText, Check, X, BadgeHelp, Search, ChevronDown, ChevronUp, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { ref as dbRef, onValue, update } from 'firebase/database';
import { db, storage } from '@/firebase';
import { getDownloadURL, listAll, ref as storageRef, getMetadata, StorageReference } from 'firebase/storage';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  joinDate: string;
  status?: string;
  age?: string;
  gender?: string;
  phone?: string;
  state?: string;
  city?: string;
  pincode?: string;
  category?: string;
  disabilityType?: string;
  disabilityOther?: string;
  medicalConditions?: string[];
  medicalOther?: string;
  medications?: string;
  allergies?: string;
  modeOfCare?: string;
  dentalHistory?: string;
  behavioralChallenges?: string;
  licenseNumber?: string;
  specialization?: string;
  createdAt?: number;
};

type DoctorVerification = {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  submittedDate: string;
  status: string;
};

type Report = {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  fileName: string;
  fileUrl: string;
  uploadDate: string;
  fileType: string;
  fileCategory?: string;
};

type Stat = {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
};

const AdminPortal = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [verificationRequests, setVerificationRequests] = useState<DoctorVerification[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'ascending' | 'descending' } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check authentication and role
  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole') || '';
    
    setIsAuthenticated(authStatus);
    setUserRole(role);
    
    if (!authStatus || role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You must be logged in as an admin to access this page",
        variant: "destructive"
      });
      navigate('/auth?mode=login&role=admin', { replace: true });
    }
  }, [navigate, toast]);

  // Fetch users from Firebase
  useEffect(() => {
    if (isAuthenticated && userRole === 'admin') {
      const usersRef = dbRef(db, 'users');
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usersArray = Object.keys(data).map(key => {
            const user = data[key];
            return {
              id: key,
              name: user.fullName || "N/A",
              email: user.email || "N/A",
              role: user.role || "user",
              joinDate: user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A",
              status: user.status || "active",
              age: user.age,
              gender: user.gender,
              phone: user.phone,
              state: user.state,
              city: user.city,
              pincode: user.pincode,
              category: user.category,
              disabilityType: user.disabilityType,
              disabilityOther: user.disabilityOther,
              medicalConditions: user.medicalConditions || [],
              medicalOther: user.medicalOther,
              medications: user.medications,
              allergies: user.allergies,
              modeOfCare: user.modeOfCare,
              dentalHistory: user.dentalHistory,
              behavioralChallenges: user.behavioralChallenges,
              licenseNumber: user.licenseNumber,
              specialization: user.specialization,
              createdAt: user.createdAt,
              ...user,
            };
          });
          
          setUsers(usersArray);
          setFilteredUsers(usersArray);
          
          // Set verification requests (pending doctors)
          const pendingDoctors = usersArray
            .filter(user => user.role === 'doctor' && user.status === 'pending')
            .map(user => ({
              id: user.id,
              name: user.name,
              email: user.email,
              specialization: user.specialization || "N/A",
              licenseNumber: user.licenseNumber || "N/A",
              submittedDate: user.joinDate,
              status: user.status || "pending"
            }));
          
          setVerificationRequests(pendingDoctors);
          setLoading(false);
        } else {
          setUsers([]);
          setFilteredUsers([]);
          setVerificationRequests([]);
          setLoading(false);
        }
      });
    }
  }, [isAuthenticated, userRole]);

  // Fetch reports from Firebase Storage
  useEffect(() => {
    if (isAuthenticated && userRole === 'admin') {
      const fetchReports = async () => {
        try {
          const reportsRef = storageRef(storage, 'reports');
          const files = await listAll(reportsRef);
          
          const reportsData = await Promise.all(
            files.items.map(async (fileRef: StorageReference) => {
              try {
                const [url, metadata] = await Promise.all([
                  getDownloadURL(fileRef),
                  getMetadata(fileRef) // Properly call getMetadata as a function
                ]);
                
                return {
                  id: fileRef.name,
                  userId: metadata.customMetadata?.userId || 'unknown',
                  userName: metadata.customMetadata?.userName || 'Unknown',
                  userEmail: metadata.customMetadata?.userEmail || 'unknown@example.com',
                  fileName: fileRef.name,
                  fileUrl: url,
                  uploadDate: new Date(metadata.timeCreated).toLocaleDateString(),
                  fileType: fileRef.name.split('.').pop()?.toUpperCase() || 'FILE',
                  fileCategory: metadata.customMetadata?.category || 'document'
                };
              } catch (error) {
                console.error(`Error processing file ${fileRef.name}:`, error);
                return null;
              }
            })
          );
          
          setReports(reportsData.filter(Boolean) as Report[]);
        } catch (error) {
          console.error('Error fetching reports:', error);
          toast({
            title: "Error",
            description: "Failed to load reports",
            variant: "destructive"
          });
        }
      };
      
      fetchReports();
    }
  }, [isAuthenticated, userRole, toast]);

  // Filter users based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.city && user.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.state && user.state.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  // Sort users
  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    const sortedUsers = [...filteredUsers].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'ascending' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    setFilteredUsers(sortedUsers);
  };

  // Get sort indicator
  const getSortIndicator = (key: keyof User) => {
    if (!sortConfig || sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  // Update user status
  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const userRef = dbRef(db, `users/${userId}`);
      await update(userRef, { 
        status: newStatus,
        updatedAt: Date.now()
      });
      
      toast({
        title: "Status Updated",
        description: `User status has been updated to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive"
      });
    }
  };

  // Handle view user details
  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user);
    setViewMode('details');
  };

  // Handle back to list view
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  // Handle download report
  const handleDownloadReport = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats data based on actual users
  const stats = [
    { 
      title: 'Total Users', 
      value: users.length.toString(),
      change: '+12%',
      changeType: 'positive' as const
    },
    { 
      title: 'Admins', 
      value: users.filter(u => u.role === 'admin').length.toString(),
      change: '+5%',
      changeType: 'positive' as const
    },
    { 
      title: 'Doctors', 
      value: users.filter(u => u.role === 'doctor').length.toString(),
      change: '+8%',
      changeType: 'positive' as const
    },
    { 
      title: 'Active', 
      value: users.filter(u => u.status === 'active').length.toString(),
      change: '+3%',
      changeType: 'positive' as const
    }
  ];

  const handleApproveDoctor = (id: string) => {
    setSelectedDoctorId(id);
    setShowApproveDialog(true);
  };

  const handleRejectDoctor = (id: string) => {
    setSelectedDoctorId(id);
    setShowRejectDialog(true);
  };

  const confirmApproveDoctor = () => {
    if (selectedDoctorId) {
      updateUserStatus(selectedDoctorId, 'approved');
    }
    setShowApproveDialog(false);
    setSelectedDoctorId(null);
  };

  const confirmRejectDoctor = () => {
    if (selectedDoctorId) {
      updateUserStatus(selectedDoctorId, 'rejected');
    }
    setShowRejectDialog(false);
    setSelectedDoctorId(null);
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: <BarChart className="w-5 h-5 mr-2" /> },
    { id: 'users', name: 'User Management', icon: <Users className="w-5 h-5 mr-2" /> },
    { id: 'doctors', name: 'Doctors', icon: <BadgeHelp className="w-5 h-5 mr-2" /> },
    { id: 'verifications', name: 'Doctor Verifications', icon: <FileText className="w-5 h-5 mr-2" /> },
    { id: 'reports', name: 'Reports', icon: <FileText className="w-5 h-5 mr-2" /> },
    { id: 'settings', name: 'Settings', icon: <Settings className="w-5 h-5 mr-2" /> }
  ];

  // Render user details view
  const renderUserDetails = () => {
    if (!selectedUser) return null;

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <button 
          onClick={handleBackToList}
          className="mb-4 flex items-center text-[#1669AE] hover:text-[#135a94]"
        >
          <ChevronDown className="transform rotate-90 mr-1" size={16} />
          Back to Users
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Basic Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-lg">Basic Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
              <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
              <p><span className="font-medium">Role:</span> {selectedUser.role}</p>
              <p><span className="font-medium">Join Date:</span> {selectedUser.joinDate}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={cn(
                  "ml-2 px-2 py-1 rounded-full text-xs",
                  selectedUser.status === 'active' ? "bg-green-100 text-green-800" : 
                  selectedUser.status === 'pending' ? "bg-yellow-100 text-yellow-800" : 
                  selectedUser.status === 'suspended' ? "bg-red-100 text-red-800" : 
                  "bg-gray-100 text-gray-800"
                )}>
                  {selectedUser.status ? selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1) : 'Active'}
                </span>
              </p>
              <p><span className="font-medium">Age:</span> {selectedUser.age || 'N/A'}</p>
              <p><span className="font-medium">Gender:</span> {selectedUser.gender || 'N/A'}</p>
              <p><span className="font-medium">Phone:</span> {selectedUser.phone || 'N/A'}</p>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-lg">Location Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">State:</span> {selectedUser.state || 'N/A'}</p>
              <p><span className="font-medium">City:</span> {selectedUser.city || 'N/A'}</p>
              <p><span className="font-medium">Pincode:</span> {selectedUser.pincode || 'N/A'}</p>
            </div>
          </div>

          {/* Medical Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3 text-lg">Medical Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Category:</span> {selectedUser.category || 'N/A'}</p>
              <p><span className="font-medium">Disability:</span> 
                {selectedUser.disabilityType 
                  ? `${selectedUser.disabilityType}${selectedUser.disabilityOther ? ` (${selectedUser.disabilityOther})` : ''}`
                  : 'N/A'}
              </p>
              <p><span className="font-medium">Medical Conditions:</span> 
                {selectedUser.medicalConditions && selectedUser.medicalConditions.length > 0 
                  ? selectedUser.medicalConditions.join(', ') 
                  : 'N/A'}
                {selectedUser.medicalOther && ` (${selectedUser.medicalOther})`}
              </p>
              <p><span className="font-medium">Medications:</span> {selectedUser.medications || 'N/A'}</p>
              <p><span className="font-medium">Allergies:</span> {selectedUser.allergies || 'N/A'}</p>
              <p><span className="font-medium">Dental History:</span> {selectedUser.dentalHistory || 'N/A'}</p>
              <p><span className="font-medium">Behavioral Challenges:</span> {selectedUser.behavioralChallenges || 'N/A'}</p>
              <p><span className="font-medium">Preferred Mode of Care:</span> {selectedUser.modeOfCare || 'N/A'}</p>
            </div>
          </div>

          {/* Doctor Specific Info */}
          {selectedUser.role === 'doctor' && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 text-lg">Professional Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">License Number:</span> {selectedUser.licenseNumber || 'N/A'}</p>
                <p><span className="font-medium">Specialization:</span> {selectedUser.specialization || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render content only if authenticated and correct role
  if (!isAuthenticated || userRole !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Access Denied. Please log in as admin.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow pt-20 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 bg-white rounded-xl shadow-sm p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={cn(
                      "w-full flex items-center px-4 py-3 rounded-lg transition-colors",
                      activeTab === tab.id 
                        ? "bg-[#1669AE] bg-opacity-10 text-[#1669AE]" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setViewMode('list');
                      setSelectedUser(null);
                    }}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
            
            {/* Main Content */}
            <div className="flex-1 space-y-8">
              {viewMode === 'details' ? (
                renderUserDetails()
              ) : (
                <>
                  {activeTab === 'dashboard' && (
                    <>
                      {/* Stats Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                          <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                            <p className="text-gray-500 text-sm">{stat.title}</p>
                            <div className="flex items-end justify-between mt-2">
                              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                              <span className={cn(
                                "text-sm",
                                stat.changeType === 'positive' ? "text-green-600" : "text-red-600"
                              )}>
                                {stat.change}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Recent Users */}
                      <div className="bg-white rounded-xl shadow-sm p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-semibold">Recent Users</h2>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Search className="absolute left-2 top-2.5 text-gray-400 w-4 h-4" />
                              <input
                                type="text"
                                className="pl-8 pr-3 py-2 border rounded-md text-sm"
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                              />
                            </div>
                            <button 
                              className="text-[#1669AE] hover:text-[#135a94] text-sm font-medium"
                              onClick={() => setActiveTab('users')}
                            >
                              View All
                            </button>
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Role</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Join Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredUsers.slice(0, 5).map((user) => (
                                <tr key={user.id} className="border-b">
                                  <td className="px-4 py-4">{user.name}</td>
                                  <td className="px-4 py-4">{user.email}</td>
                                  <td className="px-4 py-4">
                                    <span className={cn(
                                      "px-2 py-1 rounded-full text-xs",
                                      user.role === 'doctor' ? "bg-[#1669AE] bg-opacity-10 text-[#1669AE]" : 
                                      user.role === 'admin' ? "bg-purple-100 text-purple-800" : 
                                      "bg-gray-100 text-gray-800"
                                    )}>
                                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">{user.joinDate}</td>
                                  <td className="px-4 py-4">
                                    <span className={cn(
                                      "px-2 py-1 rounded-full text-xs",
                                      user.status === 'active' ? "bg-green-100 text-green-800" : 
                                      user.status === 'pending' ? "bg-yellow-100 text-yellow-800" : 
                                      user.status === 'suspended' ? "bg-red-100 text-red-800" : 
                                      "bg-gray-100 text-gray-800"
                                    )}>
                                      {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                              {filteredUsers.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="text-center py-6 text-gray-500">
                                    No users found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {activeTab === 'users' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">User Management</h2>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input
                              type="text"
                              placeholder="Search users..."
                              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1669AE] focus:border-transparent"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                          </div>
                          <button
                            className="ml-2 text-xs px-3 py-1 rounded bg-[#1669AE] bg-opacity-10 text-[#1669AE]"
                            onClick={() => requestSort('name')}
                          >
                            Sort by Name {getSortIndicator('name')}
                          </button>
                          <button
                            className="ml-2 text-xs px-3 py-1 rounded bg-[#1669AE] bg-opacity-10 text-[#1669AE]"
                            onClick={() => requestSort('email')}
                          >
                            Sort by Email {getSortIndicator('email')}
                          </button>
                          <button
                            className="ml-2 text-xs px-3 py-1 rounded bg-[#1669AE] bg-opacity-10 text-[#1669AE]"
                            onClick={() => requestSort('role')}
                          >
                            Sort by Role {getSortIndicator('role')}
                          </button>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50">
                              <th 
                                className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer"
                                onClick={() => requestSort('name')}
                              >
                                <div className="flex items-center">
                                  Name
                                  {getSortIndicator('name')}
                                </div>
                              </th>
                              <th 
                                className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer"
                                onClick={() => requestSort('email')}
                              >
                                <div className="flex items-center">
                                  Email
                                  {getSortIndicator('email')}
                                </div>
                              </th>
                              <th 
                                className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer"
                                onClick={() => requestSort('role')}
                              >
                                <div className="flex items-center">
                                  Role
                                  {getSortIndicator('role')}
                                </div>
                              </th>
                              <th 
                                className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer"
                                onClick={() => requestSort('joinDate')}
                              >
                                <div className="flex items-center">
                                  Join Date
                                  {getSortIndicator('joinDate')}
                                </div>
                              </th>
                              <th 
                                className="px-4 py-3 text-left font-medium text-gray-700 cursor-pointer"
                                onClick={() => requestSort('status')}
                              >
                                <div className="flex items-center">
                                  Status
                                  {getSortIndicator('status')}
                                </div>
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loading ? (
                              <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">Loading users...</td>
                              </tr>
                            ) : filteredUsers.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="text-center py-8 text-gray-500">No users found matching your search.</td>
                              </tr>
                            ) : (
                              filteredUsers.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-4">{user.name}</td>
                                  <td className="px-4 py-4">{user.email}</td>
                                  <td className="px-4 py-4">
                                    <span className={cn(
                                      "px-2 py-1 rounded-full text-xs",
                                      user.role === 'doctor' ? "bg-[#1669AE] bg-opacity-10 text-[#1669AE]" : 
                                      user.role === 'admin' ? "bg-purple-100 text-purple-800" : 
                                      "bg-gray-100 text-gray-800"
                                    )}>
                                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">{user.joinDate}</td>
                                  <td className="px-4 py-4">
                                    <span className={cn(
                                      "px-2 py-1 rounded-full text-xs",
                                      user.status === 'active' ? "bg-green-100 text-green-800" : 
                                      user.status === 'pending' ? "bg-yellow-100 text-yellow-800" : 
                                      user.status === 'suspended' ? "bg-red-100 text-red-800" : 
                                      "bg-gray-100 text-gray-800"
                                    )}>
                                      {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Active'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4 flex items-center gap-2">
                                    <button
                                      onClick={() => handleViewUserDetails(user)}
                                      className="text-[#1669AE] hover:text-[#135a94] text-sm font-medium"
                                    >
                                      View
                                    </button>
                                    {user.status === 'active' ? (
                                      <button
                                        onClick={() => updateUserStatus(user.id, 'suspended')}
                                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                                      >
                                        Suspend
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() => updateUserStatus(user.id, 'active')}
                                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                                      >
                                        Activate
                                      </button>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                  
                  {activeTab === 'doctors' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4">Doctors</h2>
                      <p className="text-gray-500">Doctor management coming soon.</p>
                    </div>
                  )}
                  
                  {activeTab === 'verifications' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Doctor Verifications</h2>
                        <div className="text-sm text-gray-500">
                          {verificationRequests.length} pending requests
                        </div>
                      </div>
                      
                      {verificationRequests.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
                          <p className="mt-1 text-sm text-gray-500">All doctor verification requests have been processed.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Specialization</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">License</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Submitted</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {verificationRequests.map((request) => (
                                <tr key={request.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-4">{request.name}</td>
                                  <td className="px-4 py-4">{request.email}</td>
                                  <td className="px-4 py-4">{request.specialization}</td>
                                  <td className="px-4 py-4">{request.licenseNumber}</td>
                                  <td className="px-4 py-4">{request.submittedDate}</td>
                                  <td className="px-4 py-4 flex items-center gap-2">
                                    <button
                                      onClick={() => handleApproveDoctor(request.id)}
                                      className="flex items-center text-green-600 hover:text-green-800 text-sm font-medium"
                                    >
                                      <Check className="mr-1" size={14} /> Approve
                                    </button>
                                    <button
                                      onClick={() => handleRejectDoctor(request.id)}
                                      className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                                    >
                                      <X className="mr-1" size={14} /> Reject
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'reports' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Uploaded Reports</h2>
                        <div className="text-sm text-gray-500">
                          {reports.length} files uploaded
                        </div>
                      </div>
                      
                      {reports.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                          <FileText className="mx-auto h-12 w-12 text-gray-400" />
                          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                          <p className="mt-1 text-sm text-gray-500">When users upload files, they will appear here.</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left font-medium text-gray-700">User</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Email</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">File Name</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Type</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Upload Date</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-700">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reports.map((report) => (
                                <tr key={report.id} className="border-b hover:bg-gray-50">
                                  <td className="px-4 py-4">{report.userName}</td>
                                  <td className="px-4 py-4">{report.userEmail}</td>
                                  <td className="px-4 py-4">{report.fileName}</td>
                                                                    <td className="px-4 py-4">
                                    <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                                      {report.fileType}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">
                                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">
                                      {report.fileCategory || 'Document'}
                                    </span>
                                  </td>
                                  <td className="px-4 py-4">{report.uploadDate}</td>
                                  <td className="px-4 py-4">
                                    <button
                                      onClick={() => handleDownloadReport(report.fileUrl, report.fileName)}
                                      className="flex items-center text-[#1669AE] hover:text-[#135a94] text-sm font-medium"
                                    >
                                      <Download className="mr-1" size={14} /> Download
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {activeTab === 'settings' && (
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold mb-4">Settings</h2>
                      <p className="text-gray-500">Settings feature coming soon.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Approve Confirmation Dialog */}
      <AlertDialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Approval</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this doctor? This action will grant them full access to the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmApproveDoctor}
              className="bg-[#1669AE] hover:bg-[#135a94]"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this doctor's application? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmRejectDoctor}
              className="bg-red-600 hover:bg-red-700"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminPortal;