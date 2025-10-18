import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
  HeadphonesIcon,
  Shield,
  Crown,
  Users,
  ArrowRight
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { useToast } from '@/hooks/use-toast';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: '',
    planInterest: 'Professional'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "hello@saintvisionai.com",
      action: "mailto:hello@saintvisionai.com"
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak with our team",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567"
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      description: "Chat with support",
      contact: "Available 9AM-6PM EST",
      action: "#"
    }
  ];

  const supportTypes = [
    {
      icon: Users,
      title: "Sales Inquiry",
      description: "Questions about our services and features",
      response: "< 2 hours"
    },
    {
      icon: HeadphonesIcon,
      title: "Technical Support", 
      description: "Help with platform issues",
      response: "< 4 hours"
    },
    {
      icon: Crown,
      title: "Enterprise Solutions",
      description: "Custom deployment and integration",
      response: "< 24 hours"
    },
    {
      icon: Shield,
      title: "Security & Compliance",
      description: "SOC 2 and security questions", 
      response: "< 24 hours"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Message Sent Successfully!",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
        planInterest: 'Professional'
      });
    } catch (error) {
      toast({
        title: "Error Sending Message",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 mb-6">
            Contact Us
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Get in Touch with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400">
              SaintSal™ Team
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Ready to transform your workflow with patent-protected AI technology? 
            Our team is here to help you get started with SaintSal™.
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-green-400">
              <Clock className="w-4 h-4" />
              Response within 24 hours
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle className="w-4 h-4" />
              Expert technical support
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Shield className="w-4 h-4" />
              Faith-aligned values
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-2xl text-white mb-2">Send us a Message</CardTitle>
                  <p className="text-white/70">Fill out the form below and we'll get back to you soon.</p>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Name *</label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="bg-slate-700/50 border-slate-600 text-white"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Email *</label>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className="bg-slate-700/50 border-slate-600 text-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Company</label>
                        <Input
                          name="company"
                          value={formData.company}
                          onChange={handleInputChange}
                          placeholder="Your company name"
                          className="bg-slate-700/50 border-slate-600 text-white"
                        />
                      </div>
                      
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Plan Interest</label>
                        <select
                          name="planInterest"
                          value={formData.planInterest}
                          onChange={handleInputChange}
                          className="w-full p-3 bg-slate-700/50 border border-slate-600 rounded-md text-white"
                        >
                          <option value="Starter">Starter ($29/month)</option>
                          <option value="Professional">Professional ($89/month)</option>
                          <option value="Enterprise">Enterprise (Custom)</option>
                          <option value="Route Intelligence">Route Intelligence Add-on</option>
                          <option value="Just Exploring">Just Exploring</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Subject *</label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="What can we help you with?"
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-white text-sm font-medium mb-2 block">Message *</label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us more about your needs..."
                        rows={6}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      size="lg"
                      className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 font-semibold"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              
              {/* Quick Contact */}
              <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Quick Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.action}
                      className="flex items-center gap-4 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-colors"
                    >
                      <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <method.icon className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{method.title}</div>
                        <div className="text-white/60 text-sm">{method.description}</div>
                        <div className="text-blue-400 text-sm">{method.contact}</div>
                      </div>
                    </a>
                  ))}
                </CardContent>
              </Card>

              {/* Support Types */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white">Support Types</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {supportTypes.map((type, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-slate-700/20">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <type.icon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{type.title}</div>
                        <div className="text-white/60 text-xs mb-1">{type.description}</div>
                        <Badge className="bg-green-400/20 text-green-400 border-green-400/30 text-xs">
                          Response: {type.response}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Business Hours */}
              <Card className="bg-slate-800/30 border-slate-700/50">
                <CardHeader>
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-400" />
                    Business Hours
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/70">Monday - Friday</span>
                      <span className="text-white">9:00 AM - 6:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Saturday</span>
                      <span className="text-white">10:00 AM - 4:00 PM EST</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Sunday</span>
                      <span className="text-white/60">Closed</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light mb-8 text-white">Ready to Get Started?</h2>
          <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
            Don't wait - experience the power of patent-protected AI technology today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black hover:from-yellow-500 hover:to-yellow-700 px-8 py-4 text-lg font-semibold">
                Try Free Demo
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/apply">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-yellow-400 px-8 py-4 text-lg">
                Apply Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}