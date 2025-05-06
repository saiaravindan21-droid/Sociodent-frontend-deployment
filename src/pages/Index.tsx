import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import Testimonials from "@/components/Testimonials";
import { MapPin, Calendar, Star } from "lucide-react";
import { featuredDentists } from "@/data/homepageData";

const HomePage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication state on component mount
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("isAuthenticated") === "true");
    };

    checkAuth();

    // Listen for changes in localStorage (e.g., after login or logout)
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <main>
        <HeroSection />
        <FeaturesSection />

        {/* Featured Dentists */}
        <section className="py-20 bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="reveal-on-scroll inline-block px-3 py-1 mb-6 bg-sociodent-100 text-sociodent-700 rounded-full text-sm font-medium">
                Meet Our Top Dentists
              </span>
              <h2 className="reveal-on-scroll text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Experienced & Caring Dental Professionals
              </h2>
              <p className="reveal-on-scroll text-lg text-gray-600 max-w-2xl mx-auto">
                Our specialists are here to provide quality dental care with
                expertise in home care and special needs dentistry
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDentists.map((dentist, index) => (
                <div
                  key={dentist.id}
                  className="reveal-on-scroll glass-card rounded-2xl overflow-hidden card-hover transition-all duration-300"
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative aspect-square">
                    <img
                      src={dentist.image}
                      alt={`Dr. ${dentist.name}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center">
                      <Star className="text-yellow-400 w-4 h-4 mr-1" />
                      <span>{dentist.rating.toFixed(1)}</span>
                      <span className="text-gray-500 text-xs ml-1">
                        ({dentist.reviewCount})
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-lg text-gray-900">
                      Dr. {dentist.name}
                    </h3>
                    <p className="text-sociodent-600 text-sm mb-3">
                      {dentist.specialty}
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600 text-sm">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{dentist.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600 text-sm">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{dentist.availability}</span>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-gray-100">
                      <Link
                        to={`/consultation?dentist=${dentist.id}`}
                        className="button-primary w-full py-2 text-center text-sm"
                      >
                        Book Appointment
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Testimonials />

        {/* Get Started Section */}
        <section className="py-20 bg-white">
          <div className="container-custom">
            <div className="text-center mb-12">
              <span className="reveal-on-scroll inline-block px-3 py-1 mb-6 bg-sociodent-100 text-sociodent-700 rounded-full text-sm font-medium">
                Get Started
              </span>
              <h2 className="reveal-on-scroll text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Ready to Transform Your Smile?
              </h2>
              <p className="reveal-on-scroll text-lg text-gray-600 max-w-2xl mx-auto">
                Take the first step towards a healthier, more confident smile
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/consultation"
                className="reveal-on-scroll button-primary bg-sociodent-600 hover:bg-sociodent-700 text-white px-8 py-3 rounded-lg"
              >
                Book a Consultation
              </Link>
              {!isAuthenticated && (
                <>
                  <Link
                    to="/signup"
                    className="reveal-on-scroll button-secondary bg-white text-sociodent-600 border border-sociodent-600 hover:bg-sociodent-50 px-8 py-3 rounded-lg"
                    style={{ transitionDelay: "150ms" }}
                  >
                    Create Account
                  </Link>
                  <Link
                    to="/auth"
                    className="reveal-on-scroll button-secondary bg-white text-sociodent-600 border border-sociodent-600 hover:bg-sociodent-50 px-8 py-3 rounded-lg"
                    style={{ transitionDelay: "200ms" }}
                  >
                    Login
                  </Link>
                </>
              )}
              <Link
                to="/marketplace"
                className="reveal-on-scroll button-secondary bg-white text-sociodent-600 border border-sociodent-600 hover:bg-sociodent-50 px-8 py-3 rounded-lg"
                style={{ transitionDelay: "300ms" }}
              >
                Shop Products
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;