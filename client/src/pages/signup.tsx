import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChartLine, Mail, Lock, Eye, EyeOff, User, Building } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "Passwords do not match. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Account Created Successfully!",
        description: "Welcome to DataLens. Let's get started!",
        variant: "default",
      });
      setLocation("/dashboard");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen marbled-bg flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center justify-center space-x-2 mb-8 cursor-pointer group">
            <div className="w-12 h-12 sfs-button rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] smooth-transition group-hover:scale-110">
              <ChartLine className="text-[#0D0D0D] font-bold" size={24} />
            </div>
            <h1 className="text-3xl font-bold gradient-gold-text drop-shadow-[0_4px_8px_rgba(212,175,55,0.3)]">
              DataLens
            </h1>
          </div>
        </Link>

        {/* Signup Card */}
        <div className="sfs-card p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold gradient-gold-text mb-2">
              Create Your Account
            </h2>
            <p className="text-[#cbbf9b]">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-[#FFD700]">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9a8f80]" size={18} />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-10 bg-[rgba(212,175,55,0.08)] border-2 border-[rgba(212,175,55,0.3)] text-[#e9e6df] placeholder:text-[#9a8f80] focus:border-[#FFD700] smooth-transition"
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-[#FFD700]">
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9a8f80]" size={18} />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10 bg-[rgba(212,175,55,0.08)] border-2 border-[rgba(212,175,55,0.3)] text-[#e9e6df] placeholder:text-[#9a8f80] focus:border-[#FFD700] smooth-transition"
                  required
                />
              </div>
            </div>

            {/* Company Input */}
            <div className="space-y-2">
              <label htmlFor="company" className="text-sm font-medium text-[#FFD700]">
                Company Name (Optional)
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9a8f80]" size={18} />
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your Company"
                  value={formData.company}
                  onChange={handleChange}
                  className="pl-10 bg-[rgba(212,175,55,0.08)] border-2 border-[rgba(212,175,55,0.3)] text-[#e9e6df] placeholder:text-[#9a8f80] focus:border-[#FFD700] smooth-transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-[#FFD700]">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9a8f80]" size={18} />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-[rgba(212,175,55,0.08)] border-2 border-[rgba(212,175,55,0.3)] text-[#e9e6df] placeholder:text-[#9a8f80] focus:border-[#FFD700] smooth-transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9a8f80] hover:text-[#FFD700] smooth-transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#FFD700]">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#9a8f80]" size={18} />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-10 pr-10 bg-[rgba(212,175,55,0.08)] border-2 border-[rgba(212,175,55,0.3)] text-[#e9e6df] placeholder:text-[#9a8f80] focus:border-[#FFD700] smooth-transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#9a8f80] hover:text-[#FFD700] smooth-transition"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="w-4 h-4 mt-0.5 rounded border-[#FFD700] bg-[rgba(212,175,55,0.08)] text-[#FFD700] focus:ring-[#FFD700]"
                required
              />
              <label htmlFor="terms" className="text-sm text-[#cbbf9b]">
                I agree to the{" "}
                <a href="#" className="text-[#FFD700] hover:text-[#ffdd00] smooth-transition">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-[#FFD700] hover:text-[#ffdd00] smooth-transition">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full gradient-gold text-[#0D0D0D] font-bold py-6 hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] smooth-transition"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[rgba(212,175,55,0.3)]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[rgba(45,31,26,0.9)] text-[#9a8f80]">
                Or sign up with
              </span>
            </div>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="border-2 border-[rgba(212,175,55,0.3)] text-[#e9e6df] hover:bg-[rgba(212,175,55,0.1)] hover:border-[#FFD700] smooth-transition"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button
              variant="outline"
              className="border-2 border-[rgba(212,175,55,0.3)] text-[#e9e6df] hover:bg-[rgba(212,175,55,0.1)] hover:border-[#FFD700] smooth-transition"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-[#cbbf9b]">
            Already have an account?{" "}
            <Link href="/login">
              <a className="text-[#FFD700] hover:text-[#ffdd00] font-semibold smooth-transition">
                Sign in
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
