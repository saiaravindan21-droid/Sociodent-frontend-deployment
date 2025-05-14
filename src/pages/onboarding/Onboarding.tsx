import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepCategory from "@/pages/onboarding/StepCategory";
import StepDisability from "@/pages/onboarding/StepDisability";
import StepMedical from "@/pages/onboarding/StepMedical";
import StepPreferences from "@/pages/onboarding/StepPreferences";
import StepConsent from "@/pages/onboarding/StepConsent";
import StepOptional from "@/pages/onboarding/StepOptional";
import { FaUser, FaUserMd } from "react-icons/fa";

// South Indian states and cities
const STATES_WITH_CITIES: Record<string, string[]> = {
  "Andhra Pradesh": [
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Kurnool", "Rajahmundry", "Tirupati", "Kakinada", "Kadapa", "Anantapur"
  ],
  "Karnataka": [
    "Bengaluru", "Mysuru", "Mangalore", "Hubballi", "Belagavi", "Kalaburagi", "Davanagere", "Ballari", "Shivamogga", "Tumakuru"
  ],
  "Kerala": [
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Kollam", "Thrissur", "Alappuzha", "Palakkad", "Malappuram", "Kottayam", "Kannur"
  ],
  "Tamil Nadu": [
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Vellore", "Erode", "Thoothukudi", "Dindigul"
  ],
  "Telangana": [
    "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar", "Nalgonda", "Adilabad", "Suryapet"
  ],
  "Puducherry": [
    "Puducherry", "Karaikal", "Mahe", "Yanam"
  ]
};
const STATES = Object.keys(STATES_WITH_CITIES);

// Doctor Specializations
const specializations = [
  "Public Health Dentistry",
  "Conservative Dentistry and Endodontics",
  "Oral and Maxillofacial Pathology",
  "Oral and Maxillofacial Surgery",
  "Oral and Maxillofacial Radiology",
  "Orthodontics and Dentofacial Orthopedics",
  "Pediatric and Preventive Dentistry",
  "Periodontics and Implantology",
  "Maxillofacial Prosthodontics and Implantology",
  "General Dentistry"
];

// Initial form data for all roles
const initialData = {
  fullName: "",
  age: "",
  gender: "",
  phone: "",
  city: "",
  state: "",
  pincode: "",
  category: "",
  disabilityType: "",
  disabilityOther: "",
  medicalConditions: [],
  medicalOther: "",
  medications: "",
  allergies: "",
  modeOfCare: "",
  consent: false,
  terms: false,
  email: "",
  dentalHistory: "",
  behavioralChallenges: "",
  previousRecords: null,
  profilePhoto: null,
  // Doctor-specific
  licenseNumber: "",
  specialization: "",
  password: "",
};

// Steps per role
const userSteps = [
  "BasicInfo",
  "Category",
  "Disability",
  "Medical",
  "Preferences",
  "Consent",
  "Optional",
];
// For doctor, now only one step: credentials
const doctorSteps = ["Credentials"];

// Utility classes
const tabClasses = (active: boolean) =>
  `flex-1 py-3 font-semibold text-base transition-colors duration-150 flex items-center justify-center gap-2
   ${active
     ? "bg-[#e6f0fa] text-[#1976d2] border-b-4 border-[#1976d2]"
     : "bg-[#f5f7fa] text-[#222] border-b-4 border-transparent"
   }`;

const inputClasses =
  "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#1976d2] text-base mb-4";
const labelClasses = "block mb-1 font-medium text-gray-700";
const boxClasses =
  "max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md mt-32 mb-8";
const logo = (
  <img src="/logo.png" alt="SocioDent" className="h-12 mx-auto mb-4" />
);
const nextButtonClasses =
  "w-full py-2 rounded-lg bg-[#1976d2] text-white font-bold text-lg transition-colors duration-150 hover:bg-[#125ea2]";
const finishButtonClasses =
  "w-full py-2 rounded-lg bg-[#F44336] text-white font-bold text-lg transition-colors duration-150 hover:bg-[#d32f2f] mt-4";

// Validation helpers
const isPhoneValid = (phone: string) => /^\d{10}$/.test(phone);
const isEmailValid = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordValid = (password: string) =>
  /^(?=.*[\d!@#$%^&*]).{6,}$/.test(password);

// User Step 0: Basic Info
const renderUserBasicInfo = (
  formData: any,
  updateFormData: any,
  nextStep: any,
  errors: any,
  setErrors: any
) => {
  const validate = () => {
    const newErrors: any = {};
    if (!formData.fullName) newErrors.fullName = "Full Name required";
    if (!formData.age) newErrors.age = "Age required";
    if (!formData.gender) newErrors.gender = "Gender required";
    if (!formData.phone || !isPhoneValid(formData.phone))
      newErrors.phone = "10-digit phone required";
    if (!formData.email || !isEmailValid(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.password || !isPasswordValid(formData.password))
      newErrors.password =
        "Min 6 chars, 1 number or special character required";
    if (!formData.state) newErrors.state = "State required";
    if (!formData.city) newErrors.city = "City required";
    if (!formData.pincode) newErrors.pincode = "Pincode required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (validate()) nextStep();
      }}
    >
      <div className="mb-2 text-center text-2xl font-bold text-gray-800">Sign Up</div>
      <div className="mb-6 text-center text-gray-500 text-base">
        Step 1 of 7: Basic Info
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Full Name</label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Full Name"
          value={formData.fullName}
          onChange={e => updateFormData({ fullName: e.target.value })}
        />
        {errors.fullName && <div className="text-red-500 text-xs">{errors.fullName}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Age</label>
        <input
          type="number"
          className={inputClasses}
          placeholder="Age"
          value={formData.age}
          min={1}
          max={120}
          onChange={e => updateFormData({ age: e.target.value })}
        />
        {errors.age && <div className="text-red-500 text-xs">{errors.age}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Gender</label>
        <select
          className={inputClasses}
          value={formData.gender}
          onChange={e => updateFormData({ gender: e.target.value })}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && <div className="text-red-500 text-xs">{errors.gender}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Phone Number</label>
        <input
          type="text"
          className={inputClasses}
          placeholder="10-digit Phone Number"
          value={formData.phone}
          maxLength={10}
          pattern="\d{10}"
          onChange={e => {
            if (/^\d{0,10}$/.test(e.target.value)) updateFormData({ phone: e.target.value });
          }}
        />
        {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Email</label>
        <input
          type="email"
          className={inputClasses}
          placeholder="Email"
          value={formData.email}
          onChange={e => updateFormData({ email: e.target.value })}
        />
        {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Password</label>
        <input
          type="password"
          className={inputClasses}
          placeholder="Password"
          value={formData.password}
          onChange={e => updateFormData({ password: e.target.value })}
        />
        {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
        <div className="text-xs text-gray-500">
          Minimum 6 characters, at least one number or special character
        </div>
      </div>
      <div className="mb-4">
        <label className={labelClasses}>State</label>
        <select
          className={inputClasses}
          value={formData.state}
          onChange={e => {
            updateFormData({ state: e.target.value, city: "" });
          }}
        >
          <option value="">Select State</option>
          {STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
        {errors.state && <div className="text-red-500 text-xs">{errors.state}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>City</label>
        <select
          className={inputClasses}
          value={formData.city}
          onChange={e => updateFormData({ city: e.target.value })}
          disabled={!formData.state}
        >
          <option value="">Select City</option>
          {formData.state &&
            STATES_WITH_CITIES[formData.state]?.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
        </select>
        {errors.city && <div className="text-red-500 text-xs">{errors.city}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Pincode</label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Pincode"
          value={formData.pincode}
          maxLength={6}
          onChange={e => updateFormData({ pincode: e.target.value })}
        />
        {errors.pincode && <div className="text-red-500 text-xs">{errors.pincode}</div>}
      </div>
      <button
        type="submit"
        className={nextButtonClasses}
      >
        Next
      </button>
    </form>
  );
};

// Doctor Step: Credentials (with specialization dropdown, only step)
const renderDoctorCredentials = (
  formData: any,
  updateFormData: any,
  handleSubmit: any,
  errors: any,
  setErrors: any
) => {
  const validate = () => {
    const newErrors: any = {};
    if (!formData.fullName) newErrors.fullName = "Full Name required";
    if (!formData.email || !isEmailValid(formData.email))
      newErrors.email = "Valid email required";
    if (!formData.password || !isPasswordValid(formData.password))
      newErrors.password =
        "Min 6 chars, 1 number or special character required";
    if (!formData.licenseNumber) newErrors.licenseNumber = "License required";
    if (!formData.specialization)
      newErrors.specialization = "Specialization required";
    if (!formData.phone || !isPhoneValid(formData.phone))
      newErrors.phone = "10-digit phone required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        if (validate()) handleSubmit();
      }}
    >
      <div className="mb-2 text-center text-2xl font-bold text-gray-800">Sign Up</div>
      <div className="mb-6 text-center text-gray-500 text-base">
        Doctor Registration
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Full Name</label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Full Name"
          value={formData.fullName}
          onChange={e => updateFormData({ fullName: e.target.value })}
        />
        {errors.fullName && <div className="text-red-500 text-xs">{errors.fullName}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Email</label>
        <input
          type="email"
          className={inputClasses}
          placeholder="Email"
          value={formData.email}
          onChange={e => updateFormData({ email: e.target.value })}
        />
        {errors.email && <div className="text-red-500 text-xs">{errors.email}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Password</label>
        <input
          type="password"
          className={inputClasses}
          placeholder="Password"
          value={formData.password}
          onChange={e => updateFormData({ password: e.target.value })}
        />
        {errors.password && <div className="text-red-500 text-xs">{errors.password}</div>}
        <div className="text-xs text-gray-500">
          Minimum 6 characters, at least one number or special character
        </div>
      </div>
      <div className="mb-4">
        <label className={labelClasses}>License Number</label>
        <input
          type="text"
          className={inputClasses}
          placeholder="License Number"
          value={formData.licenseNumber}
          onChange={e => updateFormData({ licenseNumber: e.target.value })}
        />
        {errors.licenseNumber && <div className="text-red-500 text-xs">{errors.licenseNumber}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Specialization</label>
        <select
          className={inputClasses}
          value={formData.specialization}
          onChange={e => updateFormData({ specialization: e.target.value })}
        >
          <option value="">Select Specialization</option>
          {specializations.map(spec => (
            <option key={spec} value={spec}>{spec}</option>
          ))}
        </select>
        {errors.specialization && <div className="text-red-500 text-xs">{errors.specialization}</div>}
      </div>
      <div className="mb-4">
        <label className={labelClasses}>Phone Number</label>
        <input
          type="text"
          className={inputClasses}
          placeholder="10-digit Phone Number"
          value={formData.phone}
          maxLength={10}
          pattern="\d{10}"
          onChange={e => {
            if (/^\d{0,10}$/.test(e.target.value)) updateFormData({ phone: e.target.value });
          }}
        />
        {errors.phone && <div className="text-red-500 text-xs">{errors.phone}</div>}
      </div>
      <button
        type="submit"
        className={nextButtonClasses}
      >
        Register
      </button>
    </form>
  );
};

// --- Main Onboarding Component ---
const Onboarding: React.FC = () => {
  const [role, setRole] = useState<"user" | "doctor">("user");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const getSteps = () => (role === "doctor" ? doctorSteps : userSteps);

  const nextStep = () => setStep((s) => Math.min(s + 1, getSteps().length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const updateFormData = (data: Partial<typeof initialData>) =>
    setFormData((prev) => ({ ...prev, ...data }));

  const handleSubmit = () => {
    alert(`Registration complete as ${role}!`);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userName", formData.fullName || "User");
    localStorage.setItem("userRole", role);
    localStorage.setItem("userProfile", JSON.stringify(formData));
    window.dispatchEvent(new Event("authChange"));
    navigate("/");
  };

  // Step render logic
  const renderStep = () => {
    if (role === "user") {
      if (step === 0)
        return renderUserBasicInfo(formData, updateFormData, nextStep, errors, setErrors);
      if (step === 1)
        return (
          <StepCategory
            data={formData}
            updateData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      if (step === 2)
        return (
          <StepDisability
            data={formData}
            updateData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      if (step === 3)
        return (
          <StepMedical
            data={formData}
            updateData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      if (step === 4)
        return (
          <StepPreferences
            data={formData}
            updateData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      if (step === 5)
        return (
          <StepConsent
            data={formData}
            updateData={updateFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
        );
      if (step === 6)
        return (
          <StepOptional
            data={formData}
            updateData={updateFormData}
            prevStep={prevStep}
            onSubmit={handleSubmit}
          />
        );
    }
    if (role === "doctor") {
      // Only credentials step, submit on register
      if (step === 0)
        return renderDoctorCredentials(formData, updateFormData, handleSubmit, errors, setErrors);
    }
    return null;
  };

  return (
    <div className={boxClasses}>
      {logo}
      <div className="flex justify-center mb-6">
        <button
          className={tabClasses(role === "user") + " rounded-l-lg"}
          onClick={() => {
            setRole("user");
            setStep(0);
            setErrors({});
          }}
        >
          <FaUser /> User
        </button>
        <button
          className={tabClasses(role === "doctor") + " rounded-r-lg"}
          onClick={() => {
            setRole("doctor");
            setStep(0);
            setErrors({});
          }}
        >
          <FaUserMd /> Doctor
        </button>
      </div>
      {renderStep()}
    </div>
  );
};

export default Onboarding;
