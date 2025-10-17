import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  MessageSquare,
  Heart,
  Award,
  ArrowRight,
  ExternalLink,
  Calendar,
  MapPin,
  Github,
  Twitter,
  Linkedin,
  Youtube
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Community() {
  const communityStats = [
    { label: "Active Developers", value: "2,500+", icon: Users },
    { label: "Monthly Discussions", value: "850+", icon: MessageSquare },
    { label: "Code Contributions", value: "320+", icon: Github },
    { label: "Community Projects", value: "45+", icon: Award }
  ];

  const channels = [
    {
      name: "Discord Server",
      description: "Real-time chat with developers and the SaintSal™ team",
      members: "1,200+ members",
      platform: "Discord",
      link: "#"
    },
    {
      name: "GitHub Discussions",
      description: "Technical discussions, feature requests, and bug reports",
      members: "800+ participants",
      platform: "GitHub",
      link: "#"
    },
    {
      name: "Stack Overflow",
      description: "Ask technical questions and get expert answers",
      members: "400+ questions",
      platform: "Stack Overflow",
      link: "#"
    },
    {
      name: "Reddit Community",
      description: "Share projects, tutorials, and discuss AI trends",
      members: "650+ subscribers",
      platform: "Reddit",
      link: "#"
    }
  ];

  const events = [
    {
      title: "AI Development Masterclass",
      date: "February 15, 2025",
      time: "2:00 PM EST",
      type: "Virtual Workshop",
      description: "Learn advanced AI integration patterns with SaintSal™ experts"
    },
    {
      title: "Community Showcase",
      date: "February 28, 2025", 
      time: "6:00 PM EST",
      type: "Virtual Meetup",
      description: "Show off your projects and see what others are building"
    },
    {
      title: "HACP™ Technology Deep Dive",
      date: "March 10, 2025",
      time: "3:00 PM EST", 
      type: "Webinar",
      description: "Technical presentation on our patent-protected AI collaboration protocol"
    }
  ];

  const guidelines = [
    {
      title: "Be Respectful",
      description: "Treat all community members with respect and professionalism"
    },
    {
      title: "Faith-Aligned Values",
      description: "Honor our Christian values in discussions and interactions"
    },
    {
      title: "Stay On Topic", 
      description: "Keep discussions relevant to AI development and SaintSal™ technology"
    },
    {
      title: "Share Knowledge",
      description: "Help others by sharing your expertise and experience"
    },
    {
      title: "No Spam",
      description: "Avoid promotional content and excessive self-promotion"
    },
    {
      title: "Use Clear Titles",
      description: "Make it easy for others to understand and find your posts"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-400/30 mb-6">
            <Users className="w-3 h-3 mr-2" />
            Developer Community
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Join the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-400">
              SaintSal™ Community
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Connect with developers, share knowledge, and build the future of AI together. 
            Our community is built on Christian values, technical excellence, and mutual support.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-8 py-4 text-lg font-semibold">
              Join Discord
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-orange-400 px-8 py-4 text-lg">
              View on GitHub
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {communityStats.map((stat, index) => (
              <div key={index} className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-orange-400" />
                <div className="text-2xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Channels */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Community Channels</h2>
            <p className="text-xl text-white/60">Find your preferred way to connect and collaborate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {channels.map((channel, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-orange-500/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">{channel.name}</h3>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                      {channel.platform}
                    </Badge>
                  </div>
                  
                  <p className="text-white/70 mb-4">{channel.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/60">{channel.members}</div>
                    <Button variant="outline" className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10">
                      Join Channel
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Upcoming Events</h2>
            <p className="text-xl text-white/60">Join our community events and workshops</p>
          </div>

          <div className="space-y-6">
            {events.map((event, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-white/70 mb-3">{event.description}</p>
                      <div className="flex items-center gap-6 text-sm text-white/60">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.time}
                        </div>
                      </div>
                    </div>
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700">
                      Register Free
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light mb-6 text-white">Community Guidelines</h2>
            <p className="text-xl text-white/60">Help us maintain a positive and productive environment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guidelines.map((guideline, index) => (
              <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500/20 to-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Heart className="w-4 h-4 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{guideline.title}</h3>
                      <p className="text-white/70 text-sm">{guideline.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-orange-900/30 to-purple-900/30 border-orange-500/30">
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 mx-auto mb-6 text-orange-400" />
              <h2 className="text-3xl font-light mb-4 text-white">Follow Us</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Stay connected with the latest updates, tutorials, and community highlights 
                across all our social platforms.
              </p>
              
              <div className="flex justify-center gap-6 mb-8">
                <Button variant="outline" size="lg" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10">
                  <Twitter className="w-5 h-5 mr-2" />
                  Twitter
                </Button>
                <Button variant="outline" size="lg" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10">
                  <Github className="w-5 h-5 mr-2" />
                  GitHub
                </Button>
                <Button variant="outline" size="lg" className="border-blue-600/30 text-blue-300 hover:bg-blue-600/10">
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </Button>
                <Button variant="outline" size="lg" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Youtube className="w-5 h-5 mr-2" />
                  YouTube
                </Button>
              </div>

              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 px-8 py-4 text-lg font-semibold">
                  Join Our Community
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}