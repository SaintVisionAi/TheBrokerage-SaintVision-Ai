import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, MessageSquare, TrendingUp, Sparkles, Shield, Zap, Clock, Mail, ArrowLeft, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import GlobalHeader from "@/components/layout/global-header";
import GlobalFooter from "@/components/layout/global-footer";
import svgLogo from "../assets/logo.png";

export default function Auth() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchParams] = useLocation();
  
  // Get mode from URL params, default to signin
  const mode = new URLSearchParams(searchParams.split("?")[1]).get("mode") || "signin";
  
  // Sign In State
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signInErrors, setSignInErrors] = useState({ email: "", password: "" });
  const [signInLoading, setSignInLoading] = useState(false);

  // Sign Up State
  const [signUpData, setSignUpData] = useState({ username: "", email: "", password: "" });
  const [signUpErrors, setSignUpErrors] = useState({ username: "", email: "", password: "" });
  const [signUpLoading, setSignUpLoading] = useState(false);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // Show password toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { email: "", password: "" };
    if (!signInData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signInData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!signInData.password) {
      newErrors.password = "Password is required";
    }

    setSignInErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setSignInLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", signInData);
      const data = await res.json();

      if (data.success) {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }
        toast({
          title: "Login successful!",
          description: `Welcome back, ${data.user.username || data.user.email}`,
        });
        await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
        setLocation("/dashboard");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Failed to login",
        variant: "destructive",
      });
    } finally {
      setSignInLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { username: "", email: "", password: "" };
    if (!signUpData.username.trim()) {
      newErrors.username = "Username is required";
    }
    if (!signUpData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!signUpData.password) {
      newErrors.password = "Password is required";
    } else if (signUpData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setSignUpErrors(newErrors);
    if (newErrors.username || newErrors.email || newErrors.password) return;

    setSignUpLoading(true);
    try {
      const res = await apiRequest("POST", "/api/auth/signup", signUpData);
      const data = await res.json();

      if (data.success) {
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        toast({
          title: "Account created successfully!",
          description: "Welcome to Saint Vision Group",
        });
        const role = data.user.role;
        if (role === "admin" || role === "broker") {
          setLocation("/dashboard");
        } else {
          setLocation("/client-hub");
        }
      }
    } catch (error: any) {
      toast({
        title: "Signup failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setSignUpLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");
    setForgotLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail })
      });

      const data = await response.json();

      if (response.ok) {
        setForgotSent(true);
      } else {
        setForgotError(data.error || "Failed to send reset email");
      }
    } catch (err) {
      setForgotError("An error occurred. Please try again.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <>
      <GlobalHeader />
      <div className="min-h-screen bg-black flex flex-col">
        
        {/* Main Content */}
        <div className="flex-1 flex">
          
          {/* LEFT PANE - Auth Forms */}
          <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
            <div className="w-full max-w-md">
              
              {/* Logo & Title */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center mb-4">
                  <img 
                    src={svgLogo} 
                    alt="Saint Vision Group AI Brokerage" 
                    className="w-32 h-32 object-contain rounded-3xl border-2 border-yellow-500/40 shadow-2xl shadow-yellow-500/30 bg-gradient-to-br from-neutral-900 to-black p-2"
                  />
                </div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
                  Saint Vision Group
                </h1>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-8 bg-neutral-900 rounded-lg p-1">
                <button
                  onClick={() => setLocation("/auth?mode=signin")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${mode === "signin" ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setLocation("/auth?mode=signup")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${mode === "signup" ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setLocation("/auth?mode=forgot")}
                  className={`flex-1 py-2 px-4 rounded-md font-semibold transition-all ${mode === "forgot" ? "bg-yellow-500 text-black" : "text-gray-400 hover:text-white"}`}
                >
                  Forgot?
                </button>
              </div>

              {/* SIGN IN FORM */}
              {mode === "signin" && (
                <form onSubmit={handleSignIn} className="space-y-5">
                  <p className="text-gray-400 text-sm text-center mb-6">Sign in to your account</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={signInData.email}
                      onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                      disabled={signInLoading}
                    />
                    {signInErrors.email && (
                      <p className="text-sm text-red-400 mt-1">{signInErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={signInData.password}
                      onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                      placeholder="Enter your password"
                      className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                      disabled={signInLoading}
                    />
                    {signInErrors.password && (
                      <p className="text-sm text-red-400 mt-1">{signInErrors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={signInLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {signInLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing In...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-6">
                    <p>
                      By signing in, you agree to our{' '}
                      <a href="/support" className="text-yellow-500 hover:text-yellow-400">
                        Terms
                      </a>
                      {' '}and{' '}
                      <a href="/support" className="text-yellow-500 hover:text-yellow-400">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </form>
              )}

              {/* SIGN UP FORM */}
              {mode === "signup" && (
                <form onSubmit={handleSignUp} className="space-y-5">
                  <p className="text-gray-400 text-sm text-center mb-6">Create your account to get started</p>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <Input
                      type="text"
                      value={signUpData.username}
                      onChange={(e) => setSignUpData({ ...signUpData, username: e.target.value })}
                      placeholder="Choose a username"
                      className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                      disabled={signUpLoading}
                    />
                    {signUpErrors.username && (
                      <p className="text-sm text-red-400 mt-1">{signUpErrors.username}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      value={signUpData.email}
                      onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                      placeholder="Enter your email"
                      className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                      disabled={signUpLoading}
                    />
                    {signUpErrors.email && (
                      <p className="text-sm text-red-400 mt-1">{signUpErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={signUpData.password}
                      onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                      placeholder="Create a password (min 8 characters)"
                      className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                      disabled={signUpLoading}
                    />
                    {signUpErrors.password && (
                      <p className="text-sm text-red-400 mt-1">{signUpErrors.password}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={signUpLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {signUpLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>

                  <div className="text-center text-sm text-gray-500 mt-6">
                    <p>
                      By signing up, you agree to our{' '}
                      <a href="/support" className="text-yellow-500 hover:text-yellow-400">
                        Terms
                      </a>
                      {' '}and{' '}
                      <a href="/support" className="text-yellow-500 hover:text-yellow-400">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </form>
              )}

              {/* FORGOT PASSWORD FORM */}
              {mode === "forgot" && !forgotSent && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-gray-400 text-sm text-center mb-6">Enter your email and we'll send you a link to reset your password</p>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-gray-300 font-medium text-sm">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      className="bg-neutral-900 border-neutral-700 focus:border-yellow-500 focus:ring-yellow-500 h-12 text-white"
                    />
                  </div>

                  {forgotError && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
                      {forgotError}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg h-12"
                  >
                    {forgotLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                </form>
              )}

              {/* FORGOT PASSWORD SENT */}
              {mode === "forgot" && forgotSent && (
                <div className="text-center space-y-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                    <p className="text-gray-400">We've sent password reset instructions to <strong>{forgotEmail}</strong></p>
                  </div>
                  <div className="bg-blue-500/10 border border-blue-500/50 rounded-lg p-4">
                    <p className="text-blue-400 text-sm">
                      📧 Check your inbox for the password reset link. It expires in 1 hour.
                    </p>
                  </div>
                  <Button 
                    onClick={() => setForgotSent(false)}
                    variant="outline"
                    className="w-full border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    Send Again
                  </Button>
                </div>
              )}

            </div>
          </div>

          {/* RIGHT PANE - Platform Information */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-12 items-center justify-center relative overflow-hidden">
            
            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-blue-900/90 to-purple-900/90" />
            
            {/* Content */}
            <div className="relative z-10 max-w-lg">
              
              {/* Main Headline */}
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                  Your Complete AI-Powered Brokerage Platform
                </h2>
                <p className="text-xl text-yellow-400 mb-2">
                  Investment | Real Estate | Lending | M&A
                </p>
                <p className="text-sm text-blue-200">
                  Powered by <span className="font-semibold text-blue-300">cookin.io</span> - Enterprise business & CRM automation
                </p>
              </div>

              {/* Features Grid */}
              <div className="space-y-4 mb-10">
                
                {/* Document Management */}
                <div className="bg-white/5 backdrop-blur-sm border border-neutral-700 rounded-xl p-5 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <FileText className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">Document Management</h3>
                      <p className="text-sm text-gray-400">Upload, organize, and share files securely. AI-powered document processing and instant extraction.</p>
                    </div>
                  </div>
                </div>

                {/* Communications Hub */}
                <div className="bg-white/5 backdrop-blur-sm border border-neutral-700 rounded-xl p-5 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">Seamless Communications</h3>
                      <p className="text-sm text-gray-400">Real-time messaging, video calls, and collaboration tools. Keep all conversations in one place.</p>
                    </div>
                  </div>
                </div>

                {/* Business Intelligence */}
                <div className="bg-white/5 backdrop-blur-sm border border-neutral-700 rounded-xl p-5 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">Business Intelligence</h3>
                      <p className="text-sm text-gray-400">Track deals, analyze performance, manage pipelines. AI-powered insights and predictive analytics.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Stats/Social Proof */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Clock className="w-5 h-5 text-yellow-400 mr-1" />
                    <div className="text-3xl font-bold text-white">24/7</div>
                  </div>
                  <div className="text-xs text-gray-400">AI Support</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <Zap className="w-5 h-5 text-yellow-400 mr-1" />
                    <div className="text-3xl font-bold text-white">$5K-$50M</div>
                  </div>
                  <div className="text-xs text-gray-400">Deal Range</div>
                </div>
                <div>
                  <div className="flex items-center justify-center mb-2">
                    <TrendingUp className="w-5 h-5 text-yellow-400 mr-1" />
                    <div className="text-3xl font-bold text-white">4</div>
                  </div>
                  <div className="text-xs text-gray-400">Service Divisions</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
