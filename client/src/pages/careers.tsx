import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Heart, 
  Zap, 
  Award,
  MapPin,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Brain,
  Code,
  Shield,
  Globe,
  Coffee,
  Home
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Careers() {
  const values = [
    {
      icon: Heart,
      title: "Faith-Aligned Mission",
      description: "We build technology that respects Christian values and serves a higher purpose"
    },
    {
      icon: Brain,
      title: "Innovation First", 
      description: "Work on cutting-edge AI technology protected by patents and industry recognition"
    },
    {
      icon: Users,
      title: "Team Excellence",
      description: "Collaborate with world-class engineers and AI researchers pushing boundaries"
    },
    {
      icon: Globe,
      title: "Global Impact",
      description: "Your work will influence how enterprises worldwide interact with AI technology"
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      items: ["Top-tier salaries", "Equity participation", "Performance bonuses", "Annual reviews"]
    },
    {
      icon: Heart,
      title: "Health & Wellness",
      items: ["Premium health insurance", "Mental health support", "Fitness stipends", "Wellness programs"]
    },
    {
      icon: Clock,
      title: "Work-Life Balance",
      items: ["Flexible hours", "Remote work options", "Unlimited PTO", "4-day work weeks"]
    },
    {
      icon: Brain,
      title: "Growth & Learning",
      items: ["Education budget", "Conference attendance", "Mentorship programs", "Skill development"]
    }
  ];

  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Lead development of HACP™ AI systems and enterprise integrations"
    },
    {
      title: "Full-Stack Developer",
      department: "Engineering", 
      location: "Remote / Austin",
      type: "Full-time",
      description: "Build and maintain the SaintSal™ platform frontend and backend systems"
    },
    {
      title: "DevOps Engineer",
      department: "Infrastructure",
      location: "Remote",
      type: "Full-time", 
      description: "Scale our platform infrastructure and ensure 99.9% uptime SLA"
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "San Francisco",
      type: "Full-time",
      description: "Drive product strategy for enterprise AI solutions and customer success"
    },
    {
      title: "Enterprise Sales Director",
      department: "Sales",
      location: "Remote / New York",
      type: "Full-time",
      description: "Lead enterprise sales efforts and build relationships with Fortune 500 clients"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Remote",
      type: "Full-time",
      description: "Ensure enterprise customers achieve maximum value from SaintSal™ platform"
    }
  ];

  const perks = [
    { icon: "💰", title: "Stock Options", description: "Equity in a fast-growing AI company" },
    { icon: "🏠", title: "Remote First", description: "Work from anywhere with flexible hours" },
    { icon: "📚", title: "Learning Budget", description: "$3,000 annually for courses and conferences" },
    { icon: "☕", title: "Unlimited Coffee", description: "Premium coffee and snacks in all offices" },
    { icon: "🏖️", title: "Unlimited PTO", description: "Take time off when you need it" },
    { icon: "🖥️", title: "Top Equipment", description: "Latest MacBook Pro, monitors, and accessories" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-green-500/20 text-green-400 border-green-400/30 mb-6">
            <Users className="w-3 h-3 mr-2" />
            Join Our Mission
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Build the Future of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              AI Technology
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join a mission-driven team building patent-protected AI technology that respects 
            Christian values while pushing the boundaries of human-AI collaboration. 
            Make a meaningful impact at SaintSal™.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm mb-12">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              Remote-First Culture
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle className="w-4 h-4" />
              Competitive Equity
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <CheckCircle className="w-4 h-4" />
              Faith-Aligned Mission
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 px-8 py-4 text-lg font-semibold">
              View Open Positions
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-green-400 px-8 py-4 text-lg">
                Learn About Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Our Values</h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              What drives us every day to build exceptional AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-green-500/30 transition-colors">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20">
                    <value.icon className="w-8 h-8 text-green-400" />
                  </div>
                  <CardTitle className="text-lg text-white mb-2">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 text-center text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Open Positions</h2>
            <p className="text-xl text-white/60">Join our growing team of AI innovators</p>
          </div>

          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-green-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{position.title}</h3>
                      <p className="text-white/70">{position.description}</p>
                    </div>
                    <Button className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                      {position.department}
                    </Badge>
                    <div className="flex items-center gap-1 text-white/60">
                      <MapPin className="w-3 h-3" />
                      {position.location}
                    </div>
                    <div className="flex items-center gap-1 text-white/60">
                      <Clock className="w-3 h-3" />
                      {position.type}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Benefits & Perks</h2>
            <p className="text-xl text-white/60">We take care of our team so they can do their best work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardHeader className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-green-500/20 to-blue-500/20">
                    <benefit.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <CardTitle className="text-lg text-white">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {benefit.items.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                        <span className="text-white/70 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Additional Perks</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {perks.map((perk, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{perk.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{perk.title}</h3>
                  <p className="text-white/60 text-sm">{perk.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-8 text-white">Ready to Join Us?</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Don't see the perfect role? We're always looking for exceptional talent. 
            Send us your resume and tell us how you'd like to contribute.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 px-8 py-4 text-lg font-semibold">
                Get in Touch
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-green-400 px-8 py-4 text-lg">
              Submit Resume
            </Button>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}