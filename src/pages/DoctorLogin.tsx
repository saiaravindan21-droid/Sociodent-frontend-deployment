// src/pages/DoctorLogin.tsx
import React, { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import SubmitButton from "@/components/auth/SubmitButton";
import FormFooter from "@/components/auth/FormFooter";

const DoctorLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    // handle doctor login logic
  };

  return (
    <AuthLayout title="Doctor Login">
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label className="block text-gray-700 mb-2 text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sociodent-500"
            required
          />
        </div>
        <div className="mb-8">
          <label className="block text-gray-700 mb-2 text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sociodent-500"
            required
          />
        </div>
        <SubmitButton type="submit">Login</SubmitButton>
      </form>
      <FormFooter mode="login" role="doctor" />
    </AuthLayout>
  );
};

export default DoctorLogin;
