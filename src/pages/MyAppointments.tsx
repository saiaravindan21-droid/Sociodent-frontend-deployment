import React, { useState } from 'react';
import { Calendar, User, Mail, Phone, MapPin, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MyAppointments = () => {
  // Mock user data - in a real app, this would come from your auth/user context
  const [userData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    avatar: '/path/to/avatar.jpg', // Replace with actual avatar path
  });

  // Mock appointments data - in a real app, this would come from an API
  const [appointments] = useState([
    {
      id: 1,
      doctor: {
        name: 'Dr. Sarah Johnson',
        image: '/doc-img/sarah-johnson.jpg',
        specialization: 'Virtual Consultation',
      },
      date: '2023-09-15',
      time: '10:30 AM',
      type: 'Regular check-up and cleaning',
      status: 'confirmed',
    },
    {
      id: 2,
      doctor: {
        name: 'Dr. Michael Chen',
        image: '/doc-img/michael-chen.jpg',
        specialization: 'Clinic Consultation',
      },
      date: '2023-10-03',
      time: '2:00 PM',
      type: 'Wisdom tooth evaluation',
      status: 'pending',
    },
  ]);

  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const handleReschedule = (appointmentId) => {
    // Rescheduling logic
    console.log('Rescheduling appointment:', appointmentId);
  };

  const handleCancel = (appointmentId) => {
    // Cancellation logic
    console.log('Cancelling appointment:', appointmentId);
  };

  const handleBookNewAppointment = () => {
    navigate('/book-appointment');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Welcome Banner */}
      <div className="bg-sociodent-600 text-white">
        <div className="container-custom py-8">
          <div className="flex items-center gap-4">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">Welcome, {userData.name}</h1>
              <p className="text-sociodent-100">Manage your appointments and orders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Personal Information Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-900">{userData.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-900">{userData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-900">{userData.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{userData.address}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleEditProfile}
                className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-sociodent-100 text-sociodent-600 rounded-lg hover:bg-sociodent-200 transition-colors"
              >
                <Settings className="w-4 h-4" />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Appointments Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Your Dental Appointments</h2>
                <button
                  onClick={handleBookNewAppointment}
                  className="button-primary py-2"
                >
                  Book New Appointment
                </button>
              </div>

              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={appointment.doctor.image}
                        alt={appointment.doctor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold">{appointment.doctor.name}</h3>
                        <p className="text-gray-500">{appointment.doctor.specialization}</p>
                        <p className="text-sm text-gray-600">{appointment.type}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{appointment.date}</span>
                        <span>{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            appointment.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </span>
                        <button
                          onClick={() => handleReschedule(appointment.id)}
                          className="text-sociodent-600 hover:text-sociodent-700 text-sm"
                        >
                          Reschedule
                        </button>
                        <button
                          onClick={() => handleCancel(appointment.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {appointments.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No appointments scheduled. Book your first appointment now!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAppointments;