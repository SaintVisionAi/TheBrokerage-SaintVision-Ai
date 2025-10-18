import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Activity,
  Globe,
  Database,
  Shield,
  Zap,
  RefreshCw
} from 'lucide-react';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function Status() {
  const overallStatus = {
    status: "operational",
    uptime: "99.98%",
    lastIncident: "12 days ago"
  };

  const services = [
    {
      name: "API Gateway",
      status: "operational",
      uptime: "99.99%",
      responseTime: "45ms",
      description: "Core API endpoints and authentication"
    },
    {
      name: "Chat Completions",
      status: "operational", 
      uptime: "99.97%",
      responseTime: "1.2s",
      description: "AI chat and conversation endpoints"
    },
    {
      name: "Speech Services",
      status: "operational",
      uptime: "99.95%",
      responseTime: "800ms", 
      description: "Text-to-speech and speech-to-text processing"
    },
    {
      name: "Knowledge Base",
      status: "degraded",
      uptime: "99.85%",
      responseTime: "3.1s",
      description: "Document ingestion and search functionality"
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.99%",
      responseTime: "25ms",
      description: "PostgreSQL database cluster"
    },
    {
      name: "CRM Integration",
      status: "operational",
      uptime: "99.92%",
      responseTime: "650ms",
      description: "PartnerTech.ai synchronization services"
    }
  ];

  const incidents = [
    {
      title: "Knowledge Base Slow Response Times",
      status: "investigating",
      severity: "minor",
      startTime: "2 hours ago",
      description: "We're investigating reports of slower than normal response times for knowledge base queries.",
      updates: [
        { time: "2 hours ago", message: "Issue identified and investigation started" },
        { time: "1 hour ago", message: "Engineering team working on optimization" },
        { time: "30 minutes ago", message: "Partial fix deployed, monitoring results" }
      ]
    },
    {
      title: "Brief API Gateway Outage",
      status: "resolved",
      severity: "major",
      startTime: "12 days ago",
      endTime: "12 days ago (45 minutes)",
      description: "API Gateway experienced a brief outage affecting all endpoints.",
      updates: [
        { time: "12 days ago", message: "Outage detected, investigating cause" },
        { time: "12 days ago", message: "Root cause identified as load balancer issue" },
        { time: "12 days ago", message: "Fix applied, services fully restored" }
      ]
    }
  ];

  const metrics = [
    {
      name: "API Requests",
      value: "2.4M",
      period: "Last 24h",
      trend: "up",
      icon: Activity
    },
    {
      name: "Average Response",
      value: "185ms",
      period: "Last hour",
      trend: "stable", 
      icon: Zap
    },
    {
      name: "Error Rate",
      value: "0.02%",
      period: "Last 24h",
      trend: "down",
      icon: Shield
    },
    {
      name: "Global Coverage",
      value: "99.9%",
      period: "SLA Target",
      trend: "stable",
      icon: Globe
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-400 border-green-400/30 bg-green-500/20';
      case 'degraded': return 'text-yellow-400 border-yellow-400/30 bg-yellow-500/20';
      case 'outage': return 'text-red-400 border-red-400/30 bg-red-500/20';
      case 'investigating': return 'text-blue-400 border-blue-400/30 bg-blue-500/20';
      case 'resolved': return 'text-green-400 border-green-400/30 bg-green-500/20';
      default: return 'text-gray-400 border-gray-400/30 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return CheckCircle;
      case 'degraded': return AlertTriangle;
      case 'outage': return XCircle;
      case 'investigating': return Clock;
      case 'resolved': return CheckCircle;
      default: return AlertTriangle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <GlobalHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <Badge className={`mb-6 ${getStatusColor(overallStatus.status)}`}>
            <CheckCircle className="w-3 h-3 mr-2" />
            All Systems Operational
          </Badge>
          
          <h1 className="text-6xl font-light mb-8 text-white">
            SaintSal™
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
              System Status
            </span>
          </h1>
          
          <p className="text-xl text-white/70 max-w-3xl mx-auto mb-12 leading-relaxed">
            Real-time status and performance metrics for all SaintSal™ services. 
            We're committed to transparency and keeping you informed about system health.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
              <div className="text-2xl font-bold text-green-400 mb-2">{overallStatus.uptime}</div>
              <div className="text-white/60 text-sm">30-day uptime</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
              <div className="text-2xl font-bold text-blue-400 mb-2">185ms</div>
              <div className="text-white/60 text-sm">Avg response time</div>
            </div>
            <div className="bg-slate-800/30 rounded-lg p-6 border border-slate-700/50">
              <div className="text-2xl font-bold text-purple-400 mb-2">{overallStatus.lastIncident}</div>
              <div className="text-white/60 text-sm">Last incident</div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Status */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-light text-white">Service Status</h2>
            <Button variant="outline" className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10" data-testid="button-refresh-status">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="space-y-4">
            {services.map((service, index) => {
              const StatusIcon = getStatusIcon(service.status);
              return (
                <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getStatusColor(service.status)}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                          <p className="text-white/60 text-sm">{service.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center">
                          <div className="text-white font-medium">{service.uptime}</div>
                          <div className="text-white/60">Uptime</div>
                        </div>
                        <div className="text-center">
                          <div className="text-white font-medium">{service.responseTime}</div>
                          <div className="text-white/60">Response</div>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-white mb-8">Performance Metrics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                    <metric.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-white mb-2">{metric.value}</div>
                  <div className="text-white/60 text-sm mb-2">{metric.name}</div>
                  <div className="text-white/40 text-xs">{metric.period}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-light text-white mb-8">Recent Incidents</h2>
          
          <div className="space-y-6">
            {incidents.map((incident, index) => {
              const StatusIcon = getStatusIcon(incident.status);
              return (
                <Card key={index} className="bg-slate-800/30 border-slate-700/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(incident.status)}`}>
                          <StatusIcon className="w-4 h-4" />
                        </div>
                        <div>
                          <CardTitle className="text-white">{incident.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-white/60 mt-1">
                            <span>{incident.startTime}</span>
                            {incident.endTime && <span>• Duration: {incident.endTime}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={getStatusColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-white/70 mb-4">{incident.description}</p>
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Updates:</h4>
                      {incident.updates.map((update, idx) => (
                        <div key={idx} className="flex gap-4 p-3 bg-slate-700/30 rounded-lg">
                          <div className="text-white/60 text-sm font-medium min-w-24">
                            {update.time}
                          </div>
                          <div className="text-white/80 text-sm">
                            {update.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border-blue-500/30">
            <CardContent className="p-12 text-center">
              <Activity className="w-16 h-16 mx-auto mb-6 text-blue-400" />
              <h2 className="text-3xl font-light mb-4 text-white">Stay Informed</h2>
              <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto">
                Subscribe to status updates and get notified about planned maintenance, 
                incidents, and system improvements.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 px-8 py-4 text-lg font-semibold" data-testid="button-subscribe-updates">
                  Subscribe to Updates
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:text-blue-400 px-8 py-4 text-lg" data-testid="button-rss-feed">
                  RSS Feed
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <GlobalFooter />
    </div>
  );
}