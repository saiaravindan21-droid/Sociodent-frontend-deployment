import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUserMd,
  FaUserShield,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaSyncAlt,
} from "react-icons/fa";
import AuthLayout from "@/components/auth/AuthLayout";
import SubmitButton from "@/components/auth/SubmitButton";

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const Auth = () => {
  const [loginTab, setLoginTab] = useState<"user" | "doctor" | "admin">("user");
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    name: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [captcha, setCaptcha] = useState(generateCaptcha());
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCaptchaRefresh = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaVerified(false);
  };

  const handleCaptchaVerify = () => {
    setCaptchaVerified(captchaInput.trim() === captcha.trim()); // Case-sensitive
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaVerified) return alert("Please verify the captcha!");

    const role = loginTab;
    const userName =
      form.name ||
      (loginMethod === "email"
        ? form.email.split("@")[0]
        : form.phone);

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", userName);

    window.dispatchEvent(new Event("authChange"));

    navigate("/");
  };

  return (
    <AuthLayout>
      <div className="flex flex-col items-center mb-6">
        <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
        <p className="text-gray-600 mb-2">
          Sign in to continue to your account
        </p>
      </div>

      <div className="flex justify-center mb-4 space-x-2">
        {["user", "doctor", "admin"].map((role) => (
          <button
            key={role}
            className={`flex-1 flex items-center justify-center px-2 py-2 rounded-lg ${
              loginTab === role
                ? "bg-sociodent-100 text-sociodent-700 font-bold"
                : "bg-gray-100 text-gray-500"
            }`}
            onClick={() => setLoginTab(role as typeof loginTab)}
          >
            {role === "user" && <FaUser className="mr-1" />}
            {role === "doctor" && <FaUserMd className="mr-1" />}
            {role === "admin" && <FaUserShield className="mr-1" />}
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex mb-4">
        {["email", "phone"].map((method) => (
          <button
            key={method}
            className={`flex-1 py-2 border ${
              loginMethod === method
                ? "bg-white border-sociodent-500 text-sociodent-600 font-bold"
                : "bg-gray-50 border-gray-300 text-gray-500"
            } ${method === "email" ? "rounded-l-lg" : "rounded-r-lg"}`}
            onClick={() => setLoginMethod(method as typeof loginMethod)}
          >
            {method === "email" ? "Email" : "Phone"}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Name */}
        <div>
          <label className="block text-gray-700 mb-2 text-sm font-medium">
            User Name
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <FaUser />
            </span>
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-sociodent-500"
              placeholder="Enter your name"
              required
            />
          </div>
        </div>

        {/* Email */}
        {loginMethod === "email" && (
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FaEnvelope />
              </span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-sociodent-500"
                placeholder="name@example.com"
                required
              />
            </div>
          </div>
        )}

        {/* Phone */}
        {loginMethod === "phone" && (
          <div>
            <label className="block text-gray-700 mb-2 text-sm font-medium">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-400">
                <FaPhone />
              </span>
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-sociodent-500"
                placeholder="Enter your phone"
                required
              />
            </div>
          </div>
        )}

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-gray-700 text-sm font-medium">
              Password
            </label>
            <a href="#" className="text-sociodent-500 text-xs hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-sociodent-500"
              placeholder="Password"
              required
            />
            <span
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((s) => !s)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        {/* CAPTCHA */}
        <div className="bg-gray-50 border rounded-md p-3">
          <label className="block text-gray-700 mb-1 text-sm font-medium">
            Verify you're human
          </label>
          <div className="flex items-center mb-2">
            <div className="flex-1 flex items-center justify-between px-3 py-2 bg-white border rounded font-mono tracking-widest text-lg select-none">
              <span>{captcha}</span>
              <span
                className="ml-2 text-sociodent-500 cursor-pointer"
                onClick={handleCaptchaRefresh}
                title="Refresh Captcha"
              >
                <FaSyncAlt />
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              className="flex-1 px-3 py-2 border rounded-l focus:ring-2 focus:ring-sociodent-500"
              placeholder="Enter the code above"
              value={captchaInput}
              onChange={(e) => {
                setCaptchaInput(e.target.value);
                setCaptchaVerified(false);
              }}
              required
            />
            <button
              type="button"
              className={`px-4 py-2 rounded-r ${
                captchaVerified ? "bg-green-500" : "bg-sociodent-500"
              } text-white`}
              onClick={handleCaptchaVerify}
              disabled={captchaVerified}
            >
              {captchaVerified ? "Verified" : "Verify"}
            </button>
          </div>
        </div>

        <SubmitButton
          type="submit"
          className={`w-full py-3 mt-2 rounded-full text-white font-bold text-lg ${
            loginTab === "user"
              ? "bg-red-400 hover:bg-red-500"
              : loginTab === "doctor"
              ? "bg-sociodent-500 hover:bg-sociodent-600"
              : "bg-gray-700 hover:bg-gray-800"
          } transition`}
        >
          Sign In as {loginTab.charAt(0).toUpperCase() + loginTab.slice(1)}
        </SubmitButton>
      </form>
    </AuthLayout>
  );
};

export default Auth;
