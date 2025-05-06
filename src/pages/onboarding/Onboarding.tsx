import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StepCategory from "@/pages/onboarding/StepCategory";
import StepDisability from "@/pages/onboarding/StepDisability";
import StepMedical from "@/pages/onboarding/StepMedical";
import StepPreferences from "@/pages/onboarding/StepPreferences";
import StepConsent from "@/pages/onboarding/StepConsent";
import StepOptional from "@/pages/onboarding/StepOptional";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

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
  licenseNumber: "",
  specialization: "",
  adminCode: "",
  password: "",
};

const steps = [
  "Category",
  "Disability",
  "Medical",
  "Preferences",
  "Consent",
  "Optional",
];

const doctorSteps = [
  "Credentials",
  "Consent",
];

const adminSteps = [
  "Credentials",
  "Consent",
];

const tabClasses = (active: boolean) =>
  `flex-1 py-2 font-semibold text-base transition-colors duration-150
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

const Onboarding: React.FC = () => {
  const [role, setRole] = useState<"user" | "doctor" | "admin">("user");
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const navigate = useNavigate();

  const getSteps = () => {
    if (role === "doctor") return doctorSteps;
    if (role === "admin") return adminSteps;
    return steps;
  };

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

  const isPhoneValid = (phone: string) => /^\d{10}$/.test(phone);

  // User Step 0: Custom Basic Info
  const renderUserBasicInfo = () => (
    <form
      onSubmit={e => {
        e.preventDefault();
        nextStep();
      }}
    >
      <div className="mb-2 text-center text-2xl font-bold text-gray-800">Sign Up</div>
      <div className="mb-6 text-center text-gray-500 text-base">
        Step 1 of 7: Basic Info
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-regular fa-user mr-2 text-gray-400" />
          Full Name
        </label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Full Name"
          value={formData.fullName}
          onChange={e => updateFormData({ fullName: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-hashtag mr-2 text-gray-400" />
          Age
        </label>
        <input
          type="number"
          className={inputClasses}
          placeholder="Age"
          value={formData.age}
          min={1}
          max={120}
          onChange={e => updateFormData({ age: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-venus-mars mr-2 text-gray-400" />
          Gender
        </label>
        <select
          className={inputClasses}
          value={formData.gender}
          onChange={e => updateFormData({ gender: e.target.value })}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-phone mr-2 text-gray-400" />
          Phone Number
        </label>
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
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-building mr-2 text-gray-400" />
          City
        </label>
        <input
          type="text"
          className={inputClasses}
          placeholder="City"
          value={formData.city}
          onChange={e => updateFormData({ city: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-location-dot mr-2 text-gray-400" />
          State
        </label>
        <select
          className={inputClasses}
          value={formData.state}
          onChange={e => updateFormData({ state: e.target.value })}
          required
        >
          <option value="">Select State</option>
          {STATES.map(state => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-map-pin mr-2 text-gray-400" />
          Pincode
        </label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Pincode"
          value={formData.pincode}
          maxLength={6}
          onChange={e => updateFormData({ pincode: e.target.value })}
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-[#1976d2] text-white font-bold text-lg mt-2 transition-colors duration-150 hover:bg-[#125ea2]"
        disabled={!isPhoneValid(formData.phone)}
      >
        Next
      </button>
    </form>
  );

  // Doctor Step 0: Credentials
  const renderDoctorCredentials = () => (
    <form
      onSubmit={e => {
        e.preventDefault();
        nextStep();
      }}
    >
      <div className="mb-2 text-center text-2xl font-bold text-gray-800">Sign Up</div>
      <div className="mb-6 text-center text-gray-500 text-base">
        Step 1 of 2: Credentials
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-regular fa-user mr-2 text-gray-400" />
          Full Name
        </label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Full Name"
          value={formData.fullName}
          onChange={e => updateFormData({ fullName: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-envelope mr-2 text-gray-400" />
          Email
        </label>
        <input
          type="email"
          className={inputClasses}
          placeholder="Email"
          value={formData.email}
          onChange={e => updateFormData({ email: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-lock mr-2 text-gray-400" />
          Password
        </label>
        <input
          type="password"
          className={inputClasses}
          placeholder="Password"
          value={formData.password}
          onChange={e => updateFormData({ password: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-id-card mr-2 text-gray-400" />
          License Number
        </label>
        <input
          type="text"
          className={inputClasses}
          placeholder="License Number"
          value={formData.licenseNumber}
          onChange={e => updateFormData({ licenseNumber: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-stethoscope mr-2 text-gray-400" />
          Specialization
        </label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Specialization"
          value={formData.specialization}
          onChange={e => updateFormData({ specialization: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-phone mr-2 text-gray-400" />
          Phone Number
        </label>
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
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-[#1976d2] text-white font-bold text-lg mt-2 transition-colors duration-150 hover:bg-[#125ea2]"
        disabled={!isPhoneValid(formData.phone)}
      >
        Next
      </button>
    </form>
  );

  // Admin Step 0: Credentials
  const renderAdminCredentials = () => (
    <form
      onSubmit={e => {
        e.preventDefault();
        nextStep();
      }}
    >
      <div className="mb-2 text-center text-2xl font-bold text-gray-800">Sign Up</div>
      <div className="mb-6 text-center text-gray-500 text-base">
        Step 1 of 2: Credentials
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-regular fa-user mr-2 text-gray-400" />
          Full Name
        </label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Full Name"
          value={formData.fullName}
          onChange={e => updateFormData({ fullName: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-envelope mr-2 text-gray-400" />
          Email
        </label>
        <input
          type="email"
          className={inputClasses}
          placeholder="Email"
          value={formData.email}
          onChange={e => updateFormData({ email: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-lock mr-2 text-gray-400" />
          Password
        </label>
        <input
          type="password"
          className={inputClasses}
          placeholder="Password"
          value={formData.password}
          onChange={e => updateFormData({ password: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-id-badge mr-2 text-gray-400" />
          Admin Code
        </label>
        <input
          type="text"
          className={inputClasses}
          placeholder="Admin Code"
          value={formData.adminCode}
          onChange={e => updateFormData({ adminCode: e.target.value })}
          required
        />
      </div>
      <div className="mb-4">
        <label className={labelClasses}>
          <i className="fa-solid fa-phone mr-2 text-gray-400" />
          Phone Number
        </label>
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
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 rounded-lg bg-[#1976d2] text-white font-bold text-lg mt-2 transition-colors duration-150 hover:bg-[#125ea2]"
        disabled={!isPhoneValid(formData.phone)}
      >
        Next
      </button>
    </form>
  );

  // Render steps
  const renderStep = () => {
    if (role === "user") {
      if (step === 0) return renderUserBasicInfo();
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
      if (step === 0) return renderDoctorCredentials();
      if (step === 1)
        return (
          <div>
            <StepConsent
              data={formData}
              updateData={updateFormData}
              nextStep={handleSubmit}
              prevStep={prevStep}
            />
            <button
              className="w-full mt-4 py-2 rounded-lg bg-[#1976d2] text-white font-bold text-lg"
              onClick={handleSubmit}
            >
              Finish
            </button>
          </div>
        );
    }
    if (role === "admin") {
      if (step === 0) return renderAdminCredentials();
      if (step === 1)
        return (
          <div>
            <StepConsent
              data={formData}
              updateData={updateFormData}
              nextStep={handleSubmit}
              prevStep={prevStep}
            />
            <button
              className="w-full mt-4 py-2 rounded-lg bg-[#1976d2] text-white font-bold text-lg"
              onClick={handleSubmit}
            >
              Finish
            </button>
          </div>
        );
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
          }}
        >
          <i className="fa-solid fa-user mr-2" />
          User
        </button>
        <button
          className={tabClasses(role === "doctor")}
          onClick={() => {
            setRole("doctor");
            setStep(0);
          }}
        >
          <i className="fa-solid fa-user-doctor mr-2" />
          Doctor
        </button>
        <button
          className={tabClasses(role === "admin") + " rounded-r-lg"}
          onClick={() => {
            setRole("admin");
            setStep(0);
          }}
        >
          <i className="fa-solid fa-user-gear mr-2" />
          Admin
        </button>
      </div>
      {renderStep()}
    </div>
  );
};

export default Onboarding;