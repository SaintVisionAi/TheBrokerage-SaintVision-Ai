import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  User,
  ArrowRight,
  Clock,
  Tag,
  TrendingUp,
  Brain,
  Shield,
  Zap
} from 'lucide-react';
import { Link } from 'wouter';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Blog() {
  const featuredPost = {
    title: "The Future of Human-AI Collaboration: HACP™ Technology Explained",
    excerpt: "Dive deep into our patent-protected HACP™ technology and discover how it's revolutionizing enterprise AI interactions.",
    author: "SaintSal AI Team",
    date: "January 28, 2025",
    readTime: "8 min read",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
  };

  const blogPosts = [
    {
      title: "Enterprise AI Security: Best Practices for 2025",
      excerpt: "Learn how to implement enterprise-grade AI security with SOC 2 compliance and data governance.",
      author: "Security Team",
      date: "January 25, 2025",
      readTime: "6 min read",
      category: "Security",
      tags: ["Security", "Enterprise", "Compliance"]
    },
    {
      title: "Building Voice-Enabled AI Applications with Azure Speech",
      excerpt: "A comprehensive guide to integrating real-time speech processing into your AI applications.",
      author: "Engineering Team", 
      date: "January 22, 2025",
      readTime: "10 min read",
      category: "Development",
      tags: ["Voice AI", "Azure", "Development"]
    },
    {
      title: "ROI Analysis: How SaintSal™ Delivers $2.3M in Annual Savings",
      excerpt: "Real case studies showing measurable business impact from AI automation in enterprise environments.",
      author: "Product Team",
      date: "January 18, 2025", 
      readTime: "5 min read",
      category: "Business",
      tags: ["ROI", "Case Study", "Enterprise"]
    },
    {
      title: "The Science Behind Patent-Protected AI Collaboration",
      excerpt: "Understanding the technical innovations that make HACP™ technology unique in the AI landscape.",
      author: "Research Team",
      date: "January 15, 2025",
      readTime: "12 min read", 
      category: "Research",
      tags: ["Patents", "Innovation", "AI Research"]
    },
    {
      title: "Faith and Technology: Building AI with Christian Values",
      excerpt: "How our faith-aligned approach influences product development and business practices.",
      author: "Leadership Team",
      date: "January 12, 2025",
      readTime: "7 min read",
      category: "Culture",
      tags: ["Values", "Faith", "Culture"]
    },
    {
      title: "Scaling AI Operations: From Startup to Enterprise",
      excerpt: "Lessons learned from helping 47+ companies scale their AI implementations successfully.",
      author: "Customer Success",
      date: "January 8, 2025",
      readTime: "9 min read",
      category: "Operations", 
      tags: ["Scaling", "Operations", "Success"]
    }
  ];

  const categories = [
    { name: "Technology", count: 12, icon: Brain },
    { name: "Security", count: 8, icon: Shield },
    { name: "Business", count: 15, icon: TrendingUp },
    { name: "Development", count: 10, icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 mb-6">
            <Calendar className="w-3 h-3 mr-2" />
            SaintSal™ Blog
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            Insights from the
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              AI Frontier
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Deep insights, technical articles, and thought leadership from the team 
            building the future of human-AI collaboration with patent-protected technology.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light mb-12 text-white text-center">Featured Article</h2>
          
          <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30 mb-4">
                  {featuredPost.category}
                </Badge>
                
                <h3 className="text-2xl font-semibold text-white mb-4">
                  {featuredPost.title}
                </h3>
                
                <p className="text-white/70 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center gap-6 text-sm text-white/60 mb-6">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                
                <Button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700" data-testid="button-read-featured">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            
            {/* Main Content */}
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-light mb-12 text-white">Latest Articles</h2>
              
              <div className="space-y-8">
                {blogPosts.map((post, index) => (
                  <Card key={index} className="bg-slate-800/30 border-slate-700/50 hover:border-blue-500/30 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="bg-purple-500/20 text-purple-400 border-purple-400/30">
                          {post.category}
                        </Badge>
                        <div className="text-sm text-white/60">{post.date}</div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-white/70 mb-4 leading-relaxed">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-white/60">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10" data-testid={`button-read-post-${index}`}>
                          Read More
                        </Button>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {post.tags.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="border-slate-600 text-slate-400 text-xs">
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              
              {/* Categories */}
              <Card className="bg-slate-800/30 border-slate-700/50 mb-8">
                <CardHeader>
                  <CardTitle className="text-white">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <category.icon className="w-4 h-4 text-blue-400" />
                          <span className="text-white">{category.name}</span>
                        </div>
                        <Badge variant="outline" className="border-slate-600 text-slate-400">
                          {category.count}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter Signup */}
              <Card className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-4">Stay Updated</h3>
                  <p className="text-white/70 mb-6 text-sm">
                    Get the latest insights on AI technology, enterprise solutions, and SaintSal™ updates.
                  </p>
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700" data-testid="button-subscribe-newsletter">
                    Subscribe to Newsletter
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}