import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const userName = localStorage.getItem("userName") || "User";

  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      const role = localStorage.getItem("userRole") || "user";
      setIsAuthenticated(auth);
      setUserRole(role);
    };

    checkAuth();
    window.addEventListener("authChange", checkAuth);
    return () => {
      window.removeEventListener("authChange", checkAuth);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserRole("");
    window.dispatchEvent(new Event("authChange"));
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully",
    });
    navigate("/auth?mode=login");
  };

  const commonLinks = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/marketplace" },
    { name: "About Us", path: "/about" },
  ];

  const userLinks = [{ name: "Find Dentist", path: "/consultation" }];
  const doctorLinks = [{ name: "My Appointments", path: "/doctor-portal" }];
  const adminLinks = [{ name: "Dashboard", path: "/admin-portal" }];

  let activeLinks = [...commonLinks];
  if (isAuthenticated) {
    if (userRole === "doctor") activeLinks.splice(1, 0, ...doctorLinks);
    else if (userRole === "admin") activeLinks.unshift(...adminLinks);
    else activeLinks.splice(1, 0, ...userLinks);
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 backdrop-blur-md transition-all duration-300 shadow-sm",
        scrolled || isOpen ? "bg-white/80 py-4" : "bg-transparent py-6"
      )}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-3xl font-bold no-underline"
        >
          <img
            src="/logo.png"
            alt="SocioDent Logo"
            className="h-14 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {activeLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={cn(
                "text-base font-medium no-underline transition-colors hover:text-black",
                location.pathname === link.path
                  ? "text-[#0e5d9f]"
                  : "text-gray-700"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-2 cursor-pointer p-2 text-gray-700 hover:text-black">
                  <UserCircle size={20} />
                  <span className="text-sm font-medium">{userName}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* Only show "My Profile" for users */}
                {userRole === "user" && (
                  <DropdownMenuItem onClick={() => navigate("/my-profile")}>
                    <UserCircle className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth?mode=login" className="button-text">
                Log in
              </Link>
              <Link to="/signup" className="button-primary py-2">
                Sign up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="lg:hidden text-gray-700 hover:text-black">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="text-lg font-semibold">Menu</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-4 mt-6">
              {activeLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-base font-medium",
                    location.pathname === link.path
                      ? "text-[#0e5d9f]"
                      : "text-gray-700"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {isAuthenticated ? (
                <>
                  {/* Only show "My Profile" for users */}
                  {userRole === "user" && (
                    <Link
                      to="/my-profile"
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-gray-700 hover:text-black no-underline"
                    >
                      <UserCircle size={20} />
                      <span className="text-sm font-medium">My Profile</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 text-gray-700 hover:text-black"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth?mode=login"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-black"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsOpen(false)}
                    className="text-gray-700 hover:text-black"
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
