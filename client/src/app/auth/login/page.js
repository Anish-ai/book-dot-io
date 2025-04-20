// src/app/auth/login/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LockClosedIcon, 
  EnvelopeIcon, 
  ArrowRightIcon,
  BookOpenIcon 
} from "@heroicons/react/24/outline";
import { login } from "@app/utils/auth";
import Link from "next/link";
import Button from "@/app/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      console.log("Logging in with email:", email, "and password:", password);
      const { role } = await login({ email, password });
      router.push(role === "admin" ? "/admin/departments" : "/bookings/my");
    } catch (err) {
      setError(err.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row">
      {/* Left side - Artwork/Banner for larger screens */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] relative overflow-hidden justify-center items-center">
        <div className="relative z-10 text-white text-center px-8">
          <BookOpenIcon className="h-20 w-20 mx-auto mb-6 animate-fadeIn" />
          <h1 className="text-4xl font-bold mb-4 animate-fadeInDown">Book.io</h1>
          <p className="text-xl mb-6 text-white/80 max-w-md animate-fadeInUp delay-100">
            The smart way to manage room bookings across your campus
          </p>
          <div className="flex justify-center gap-4 animate-fadeInUp delay-200">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl font-bold">Easy</span>
              <span className="text-white/70">Booking</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl font-bold">Smart</span>
              <span className="text-white/70">Scheduling</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex flex-col items-center">
              <span className="text-2xl font-bold">Instant</span>
              <span className="text-white/70">Access</span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fadeInUp">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-8">
            <BookOpenIcon className="h-16 w-16 mx-auto text-[var(--primary)]" />
            <h1 className="text-3xl font-bold text-[var(--foreground)] mt-2">Book.io</h1>
          </div>
          
          <div className="bg-[var(--card)] rounded-2xl shadow-xl p-8 border border-[var(--border)]">
            <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent"></div>
            
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-[var(--foreground)]">Welcome Back</h2>
                <p className="text-[var(--muted)]">Sign in to manage your bookings</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="bg-[var(--destructive-light)]/20 text-[var(--destructive)] p-3 rounded-lg text-sm border border-[var(--destructive-light)]">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-[var(--foreground)] mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-[var(--muted)]" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
                      placeholder="     Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-[var(--foreground)]"
                    >
                      Password
                    </label>
                    <a href="#" className="text-sm text-[var(--primary)] hover:text-[var(--primary-hover)]">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-[var(--muted)]" />
                    </div>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary-light)] focus:border-[var(--primary)] bg-[var(--background)]"
                      placeholder="     Enter your password"
                      required
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3"
                  >
                    {isLoading ? (
                      <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
                    ) : (
                      <div className="flex items-center justify-center">
                        Sign In
                        <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              <div className="text-center text-sm text-[var(--muted)] pt-4 border-t border-[var(--border)]">
                Don't have an account?{" "}
                <Link
                  href="/"
                  className="text-[var(--primary)] hover:text-[var(--primary-hover)] font-semibold"
                >
                  Contact admin
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-[var(--muted)] text-sm">
            <p>&copy; {new Date().getFullYear()} Book.io. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
