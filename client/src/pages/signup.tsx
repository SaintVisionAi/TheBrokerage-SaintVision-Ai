import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, MessageSquare, TrendingUp, Sparkles, Shield, Zap, Clock } from "lucide-react";
import svgLogo from "../assets/logo.png";

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return !newErrors.username && !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/auth/signup", formData);
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
          setLocation("/client-portal");
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to create account";
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      
      {/* LEFT PANE - Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <img 
                src={svgLogo} 
                alt="Saint Vision Group AI Brokerage" 
                className="w-32 h-32 object-contain rounded-3xl border-2 border-yellow-500/40 shadow-2xl shadow-yellow-500/30 bg-gradient-to-br from-neutral-900 to-black p-2"
                data-testid="img-logo"
              />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
              Saint Vision Group
            </h1>
            <p className="text-gray-400">Create your account to get started</p>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Username Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Choose a username"
                className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                data-testid="input-username"
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-400 mt-1">{errors.username}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                data-testid="input-email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password (min 8 characters)"
                className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                data-testid="input-password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Create Account Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              data-testid="button-signup"
            >
              {isLoading ? (
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-gray-500">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <a href="/login">
              <Button
                type="button"
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black h-12 font-semibold"
                data-testid="link-login"
              >
                Sign In Instead
              </Button>
            </a>

          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By signing up, you agree to our{' '}
              <a href="/terms" className="text-yellow-500 hover:text-yellow-400" data-testid="link-terms">
                Terms
              </a>
              {' '}and{' '}
              <a href="/privacy" className="text-yellow-500 hover:text-yellow-400" data-testid="link-privacy">
                Privacy Policy
              </a>
            </p>
          </div>

        </div>
      </div>

      {/* RIGHT PANE - Platform Information */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-12 items-center justify-center relative overflow-hidden">
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:32px_32px]" />
        
        {/* Content */}
        <div className="relative z-10 max-w-lg">
          
          {/* Main Headline */}
          <div className="mb-8">
            <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
              Join The World's Most Advanced AI Brokerage
            </h2>
            <p className="text-xl text-yellow-400 mb-2">
              Get Started in Minutes
            </p>
            <p className="text-sm text-blue-200">
              Built on <span className="font-semibold text-blue-300">cookin.io</span> - Enterprise business & CRM automation
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
                  <h3 className="text-lg font-semibold text-white mb-1">Smart Document Processing</h3>
                  <p className="text-sm text-gray-400">AI-powered document management with instant extraction and intelligent organization.</p>
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
                  <h3 className="text-lg font-semibold text-white mb-1">Unified Communications</h3>
                  <p className="text-sm text-gray-400">Real-time messaging, video, and collaboration - all in one secure platform.</p>
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
                  <h3 className="text-lg font-semibold text-white mb-1">Predictive Analytics</h3>
                  <p className="text-sm text-gray-400">AI-driven insights, automated workflows, and real-time deal tracking.</p>
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
  );
}
