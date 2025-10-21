import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, MessageSquare, TrendingUp, Sparkles, Shield, Zap, Clock } from "lucide-react";
import svgLogo from "../assets/logo.png";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const res = await apiRequest("POST", "/api/auth/login", formData);
      const data = await res.json();

      if (data.success) {
        console.log('[LOGIN] Login successful, user:', data.user);
        console.log('[LOGIN] Token:', data.token);

        // Store JWT token in localStorage for subsequent requests
        if (data.token) {
          localStorage.setItem('authToken', data.token);
          console.log('[LOGIN] Token stored in localStorage');
        }

        toast({
          title: "Login successful!",
          description: `Welcome back, ${data.user.username || data.user.email}`,
        });

        // Refetch auth user to populate role and ensure state is synced
        console.log('[LOGIN] Refetching auth user...');
        await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
        console.log('[LOGIN] Auth user refetched');

        console.log('[LOGIN] Navigating to /dashboard');
        // Redirect to dashboard - the ProtectedDashboard component will handle role-based routing
        setLocation("/dashboard");
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Failed to login";
      toast({
        title: "Login failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      
      {/* LEFT PANE - Login Form */}
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
            <p className="text-gray-400">Sign in to your account</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
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
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <a 
                  href="/forgot-password" 
                  className="text-sm text-yellow-500 hover:text-yellow-400 transition-colors"
                  data-testid="link-forgot-password"
                >
                  Forgot?
                </a>
              </div>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full bg-neutral-900 border-neutral-700 text-white placeholder-gray-500 focus:border-yellow-500 focus:ring-yellow-500 h-12"
                data-testid="input-password"
                disabled={isLoading}
              />
              {errors.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              data-testid="button-login"
            >
              {isLoading ? (
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

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-gray-500">New to Saint Vision Group?</span>
              </div>
            </div>

            {/* Sign Up Link */}
            <a href="/signup">
              <Button
                type="button"
                variant="outline"
                className="w-full border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black h-12 font-semibold"
                data-testid="link-signup"
              >
                Create Account
              </Button>
            </a>

          </form>

          {/* Footer Links */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              By signing in, you agree to our{' '}
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
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-12 items-center justify-center relative overflow-hidden" style={{
        backgroundImage: 'url(https://cdn.builder.io/api/v1/image/assets%2F2c553a9d8cf24e6eae81a4a63962c5a4%2F446d6f0fa2c34f478f99f49fc6ba7f85?format=webp&width=1200)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        
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
  );
}
