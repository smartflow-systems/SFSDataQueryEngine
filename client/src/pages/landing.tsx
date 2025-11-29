import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  ChartLine,
  Sparkles,
  Database,
  BarChart3,
  Shield,
  Zap,
  Globe,
  TrendingUp,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Query Translation",
      description: "Transform natural language questions into optimized SQL queries using advanced AI technology"
    },
    {
      icon: Database,
      title: "Multi-Database Support",
      description: "Connect to PostgreSQL, MySQL, SQLite, and more. Manage multiple databases seamlessly"
    },
    {
      icon: BarChart3,
      title: "Advanced Visualizations",
      description: "Create stunning charts and dashboards from your data with interactive visualizations"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption, role-based access control, and audit logs for compliance"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized query execution with intelligent caching and performance recommendations"
    },
    {
      icon: Globe,
      title: "Export Anywhere",
      description: "Export your results to CSV, JSON, Excel, or integrate via our robust API"
    }
  ];

  const pricingPlans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individuals and small teams",
      features: [
        "Up to 3 database connections",
        "1,000 queries per month",
        "Basic visualizations",
        "CSV & JSON export",
        "Email support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$99",
      period: "/month",
      description: "For growing teams and businesses",
      features: [
        "Unlimited database connections",
        "Unlimited queries",
        "Advanced visualizations",
        "All export formats",
        "API access",
        "Priority support",
        "Custom dashboards"
      ],
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Everything in Professional",
        "Dedicated infrastructure",
        "SSO & SAML",
        "Advanced security features",
        "24/7 phone support",
        "Custom integrations",
        "SLA guarantee"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#e9e6df]">
      {/* Navigation */}
      <nav className="sfs-card border-b-[3px] border-[rgba(212,175,55,0.35)] px-6 py-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 sfs-button rounded-lg flex items-center justify-center shadow-lg">
              <ChartLine className="text-[#0D0D0D] font-bold" size={18} />
            </div>
            <h1 className="text-2xl font-bold gradient-gold-text drop-shadow-[0_4px_8px_rgba(212,175,55,0.3)]">
              DataLens
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-[#FFD700] hover:text-[#ffdd00]">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="gradient-gold text-[#0D0D0D] font-semibold hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] smooth-transition">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="marbled-bg py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block mb-4 px-4 py-2 sfs-card border border-[#FFD700] rounded-full">
            <span className="text-sm gradient-gold-text font-semibold">
              <Sparkles className="inline w-4 h-4 mr-2" />
              AI-Powered Data Analytics Platform
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-gold-text drop-shadow-[0_8px_16px_rgba(212,175,55,0.3)]">
            Query Your Data
            <br />
            Like Never Before
          </h1>
          <p className="text-xl md:text-2xl text-[#cbbf9b] mb-8 max-w-3xl mx-auto">
            Transform natural language into powerful SQL queries. Visualize insights instantly.
            Make data-driven decisions faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="gradient-gold text-[#0D0D0D] font-bold text-lg px-8 py-6 hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] smooth-transition hover:scale-105">
                Start Free Trial
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline" className="border-2 border-[#FFD700] text-[#FFD700] text-lg px-8 py-6 hover:bg-[rgba(212,175,55,0.1)] smooth-transition">
                View Demo
              </Button>
            </Link>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-[#9a8f80]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#4a7c4a]" size={16} />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#4a7c4a]" size={16} />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-[#4a7c4a]" size={16} />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[rgba(45,31,26,0.3)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-gold-text mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-[#cbbf9b]">
              Everything you need to analyze and visualize your data
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="sfs-card p-6 smooth-transition hover:transform hover:-translate-y-2 hover:border-[#FFD700]"
              >
                <div className="w-12 h-12 gradient-gold rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="text-[#0D0D0D]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-[#FFD700] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#cbbf9b]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-6 marbled-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold gradient-gold-text mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-[#cbbf9b]">
              Choose the perfect plan for your needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`sfs-card p-8 smooth-transition hover:transform hover:-translate-y-2 ${
                  plan.popular ? 'border-2 border-[#FFD700] shadow-[0_8px_25px_rgba(212,175,55,0.3)]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="inline-block mb-4 px-3 py-1 gradient-gold rounded-full">
                    <span className="text-xs text-[#0D0D0D] font-bold">MOST POPULAR</span>
                  </div>
                )}
                <h3 className="text-2xl font-bold text-[#FFD700] mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold gradient-gold-text">{plan.price}</span>
                  <span className="text-[#9a8f80]">{plan.period}</span>
                </div>
                <p className="text-[#cbbf9b] mb-6">{plan.description}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-2 text-[#e9e6df]">
                      <CheckCircle2 className="text-[#4a7c4a] flex-shrink-0 mt-0.5" size={18} />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup">
                  <Button
                    className={`w-full ${
                      plan.popular
                        ? 'gradient-gold text-[#0D0D0D] font-bold hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)]'
                        : 'sfs-card text-[#FFD700] hover:border-[#FFD700]'
                    } smooth-transition`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-[rgba(45,31,26,0.5)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold gradient-gold-text mb-6">
            Ready to Transform Your Data?
          </h2>
          <p className="text-xl text-[#cbbf9b] mb-8">
            Join thousands of companies making better decisions with DataLens
          </p>
          <Link href="/signup">
            <Button size="lg" className="gradient-gold text-[#0D0D0D] font-bold text-lg px-10 py-6 hover:shadow-[0_8px_25px_rgba(212,175,55,0.4)] smooth-transition hover:scale-105">
              Get Started Free - No Credit Card Required
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[rgba(212,175,55,0.3)] py-8 px-6">
        <div className="max-w-7xl mx-auto text-center text-[#9a8f80]">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <ChartLine className="text-[#FFD700]" size={20} />
            <span className="font-bold gradient-gold-text">DataLens</span>
          </div>
          <p className="text-sm">
            © 2025 DataLens by SmartFlow Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
