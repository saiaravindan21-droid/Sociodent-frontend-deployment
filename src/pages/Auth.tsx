import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { auth, db } from "@/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { ref, get } from "firebase/database";
import AuthLayout from "@/components/auth/AuthLayout";
import SubmitButton from "@/components/auth/SubmitButton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

const generateCaptcha = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
};

const Auth = () => {
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "";
  const mode = searchParams.get("mode") || "login";
  const { login } = useAuth();

  const [loginTab, setLoginTab] = useState("user");
  const [loginMethod, setLoginMethod] = useState("email");
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
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage("");
  };

  const handleCaptchaRefresh = () => {
    setCaptcha(generateCaptcha());
    setCaptchaInput("");
    setCaptchaVerified(false);
  };

  const handleCaptchaVerify = () => {
    const isVerified = captchaInput.trim() === captcha.trim();
    setCaptchaVerified(isVerified);
    if (!isVerified) {
      toast({
        title: "Error",
        description: "Captcha verification failed",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    if (!captchaVerified) {
      toast({
        title: "Error",
        description: "Please verify the captcha first",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      let emailToUse = form.email;
      if (loginTab !== "admin" && loginMethod === "phone") {
        emailToUse = `${form.phone}@sociodent.com`;
      }

      console.log(`Attempting login with email: ${emailToUse}, mode: ${loginTab}`);

      // Sign in with Firebase authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailToUse,
        form.password
      );
      
      // For testing/development - handle special cases first
      if (emailToUse === "saiaravindanstudiesonly@gmail.com" && loginTab === "admin") {
        login({
          uid: userCredential.user.uid,
          role: "admin",
          name: "Test Admin",
          email: userCredential.user.email || undefined,
        });

        toast({
          title: "Admin Login Successful",
          description: "Welcome back, Test Admin",
        });

        navigate("/admin-portal");
        return;
      }

      // Use try/catch for database operations - to handle permission denied gracefully
      try {
        // Try to get user data from the database based on loginTab
        let userData = null;
        let userRole = "user";
        let userName = "";
        
        if (loginTab === "admin") {
          // Try admin collection first
          const adminRef = ref(db, "admin");
          const adminSnapshot = await get(adminRef);
          const adminData = adminSnapshot.exists() ? adminSnapshot.val() : null;
          
          // Check if user is admin
          if (adminData && (
            adminData.email === emailToUse || 
            adminData.uid === userCredential.user.uid
          )) {
            userRole = "admin";
            userName = adminData.fullName || "Admin";
            userData = adminData;
          } else {
            // Try users collection with admin role
            const userRef = ref(db, `users/${userCredential.user.uid}`);
            const userSnapshot = await get(userRef);
            
            if (userSnapshot.exists() && userSnapshot.val().role === "admin") {
              userRole = "admin";
              userName = userSnapshot.val().fullName || "Admin";
              userData = userSnapshot.val();
            } else {
              throw new Error("You don't have admin privileges");
            }
          }
        } else if (loginTab === "doctor") {
          // Try doctors collection first
          const doctorRef = ref(db, `doctors/${userCredential.user.uid}`);
          const doctorSnapshot = await get(doctorRef);
          
          if (doctorSnapshot.exists()) {
            userRole = "doctor";
            userName = doctorSnapshot.val().fullName || "Doctor";
            userData = doctorSnapshot.val();
          } else {
            // Try users collection with doctor role
            const userRef = ref(db, `users/${userCredential.user.uid}`);
            const userSnapshot = await get(userRef);
            
            if (userSnapshot.exists() && userSnapshot.val().role === "doctor") {
              userRole = "doctor";
              userName = userSnapshot.val().fullName || "Doctor";
              userData = userSnapshot.val();
            } else {
              throw new Error("No doctor account found with these credentials");
            }
          }
        } else {
          // Regular user login
          const userRef = ref(db, `users/${userCredential.user.uid}`);
          const userSnapshot = await get(userRef);
          
          if (userSnapshot.exists()) {
            userRole = userSnapshot.val().role || "user";
            userName = userSnapshot.val().fullName || "User";
            userData = userSnapshot.val();
          } else {
            throw new Error("No user account found");
          }
        }
        
        // If username provided, verify it matches
        if (form.name && userData && userData.fullName) {
          const enteredName = form.name.trim().toLowerCase();
          const storedName = userData.fullName.trim().toLowerCase();
          
          if (enteredName !== storedName) {
            // Logout the user since authentication succeeded but name check failed
            await signOut(auth);
            throw new Error("Username does not match our records");
          }
        }
        
        // Login succeeded - store user data
        login({
          uid: userCredential.user.uid,
          role: userRole,
          name: userName,
          email: userCredential.user.email || undefined,
        });

        // Success toast
        toast({
          title: "Login Successful",
          description: `Welcome back, ${userName}`,
        });

        // Redirect based on role
        if (redirectTo === "admin" && userRole === "admin") {
          navigate("/admin-portal");
        } else if (userRole === "admin") {
          navigate("/admin-portal");
        } else if (userRole === "doctor") {
          navigate("/doctor-portal");
        } else {
          navigate("/");
        }
        
      } catch (dbError: any) {
        // Handle database permission issues or other DB errors
        console.error("Database error:", dbError);
        
        // Sign out the user since we couldn't verify their role
        await signOut(auth);
        
        // Determine if this is a permission error
        const isPermissionError = dbError.message?.includes("permission_denied") || 
                                 dbError.code === "PERMISSION_DENIED";
        
        if (isPermissionError) {
          setErrorMessage("Permission denied. Please contact support or try another login type.");
          toast({
            title: "Permission Error",
            description: "Your account exists but database access was denied. This may be a temporary issue.",
            variant: "destructive",
          });
        } else {
          setErrorMessage(dbError.message || "Validation failed");
          toast({
            title: "Login Failed",
            description: dbError.message || "Failed to validate your account",
            variant: "destructive",
          });
        }
      }
      
    } catch (err: any) {
      console.error("Authentication error:", err);
      
      let errorMsg = "Enter valid credentials";
      if (err.code === "auth/user-not-found") {
        errorMsg = "No account found with this email";
      } else if (err.code === "auth/wrong-password") {
        errorMsg = "Incorrect password";
      } else if (err.code === "auth/invalid-credential") {
        errorMsg = "Invalid login credentials";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Try again later";
      } else if (err.message) {
        errorMsg = err.message;
      }
      
      setErrorMessage(errorMsg);
      toast({
        title: "Login Failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setForm({
      email: "",
      phone: "",
      password: "",
      name: "",
    });
    setCaptchaVerified(false);
    setCaptchaInput("");
    setCaptcha(generateCaptcha());
    setErrorMessage("");
  }, [loginTab, loginMethod]);

  useEffect(() => {
    if (redirectTo === "admin") {
      setLoginTab("admin");
    }
  }, [redirectTo]);

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
            onClick={() => setLoginTab(role)}
            type="button"
          >
            {role === "user" && <FaUser className="mr-1" />}
            {role === "doctor" && <FaUserMd className="mr-1" />}
            {role === "admin" && <FaUserShield className="mr-1" />}
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </button>
        ))}
      </div>

      {errorMessage && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 text-red-600 rounded text-center">
          {errorMessage}
        </div>
      )}

      {loginTab !== "admin" && (
        <div className="flex mb-4">
          {["email", "phone"].map((method) => (
            <button
              key={method}
              className={`flex-1 py-2 border ${
                loginMethod === method
                  ? "bg-white border-sociodent-500 text-sociodent-600 font-bold"
                  : "bg-gray-50 border-gray-300 text-gray-500"
              } ${method === "email" ? "rounded-l-lg" : "rounded-r-lg"}`}
              onClick={() => setLoginMethod(method)}
              type="button"
            >
              {method === "email" ? "Email" : "Phone"}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {loginTab !== "admin" && (
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
        )}

        {(loginTab === "admin" || loginMethod === "email") && (
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
                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-sociodent-500 ${
                  loginTab === "admin" ? "bg-gray-50" : ""
                }`}
                placeholder={
                  loginTab === "admin"
                    ? "Enter admin email"
                    : "name@example.com"
                }
                required
              />
            </div>
          </div>
        )}

        {loginTab !== "admin" && loginMethod === "phone" && (
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

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-gray-700 text-sm font-medium">
              Password
            </label>
            <a
              href="/forgot-password"
              className="text-sociodent-500 text-xs hover:underline"
            >
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
              placeholder="Enter your password"
              required
            />
            <span
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {loginTab === "admin" && (
            <p className="text-xs text-gray-500 mt-1">
              Admin password is case sensitive
            </p>
          )}
        </div>

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
          disabled={isLoading || !captchaVerified}
          isLoading={isLoading}
        >
          Sign In
        </SubmitButton>

        {mode === "login" && (
          <p className="text-sm text-gray-600 text-center mt-4">
            Don't have an account?{" "}
            <a href="/register" className="text-sociodent-600 hover:underline">
              Sign up now
            </a>
          </p>
        )}
      </form>
    </AuthLayout>
  );
};

export default Auth;
