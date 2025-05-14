import React, { useState } from "react";

const StepBasicInfo = ({ data, updateData, nextStep }) => {
  const [local, setLocal] = useState({
    fullName: data.fullName || "",
    age: data.age || "",
    gender: data.gender || "",
    phone: data.phone || "",
    city: data.city || "",
    state: data.state || "",
    pincode: data.pincode || "",
  });

  const handleChange = (e) => {
    setLocal({ ...local, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    updateData(local);
    nextStep();
  };

  return (
    <form onSubmit={handleNext} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Basic Demographic Information</h2>
      <input name="fullName" placeholder="Full Name" value={local.fullName} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <input name="age" placeholder="Age" type="number" value={local.age} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <select name="gender" value={local.gender} onChange={handleChange} required className="w-full border rounded px-3 py-2">
        <option value="">Select Gender</option>
        <option>Male</option>
        <option>Female</option>
        <option>Other</option>
      </select>
      <input name="phone" placeholder="Phone Number" value={local.phone} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <input name="city" placeholder="City" value={local.city} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <input name="state" placeholder="State" value={local.state} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <input name="pincode" placeholder="Pincode" value={local.pincode} onChange={handleChange} required className="w-full border rounded px-3 py-2" />
      <button
  type="submit"
  className="w-full px-6 py-2 rounded text-white font-semibold hover:brightness-90 transition"
  style={{ backgroundColor: "#0e5d9f" }}
>
  Next
</button>

    </form>
  );
};

export default StepBasicInfo;
