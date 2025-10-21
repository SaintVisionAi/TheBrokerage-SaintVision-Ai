import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, User, Phone } from 'lucide-react';
import { useEffect } from 'react';

export default function SetAppointmentPage() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GlobalHeader />
      
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Schedule Your Discovery Call</h1>
            <p className="text-lg text-gray-600">Connect with our team to discuss your lending and investment goals</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Quick Scheduling</h3>
                </div>
                <p className="text-sm text-gray-600">Find a time that works best for you</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">30-Minute Call</h3>
                </div>
                <p className="text-sm text-gray-600">Dedicated 1-on-1 consultation</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Expert Guidance</h3>
                </div>
                <p className="text-sm text-gray-600">From our lending specialists</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Book Your Appointment</CardTitle>
              <CardDescription>
                Use the calendar below to select your preferred date and time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="calendly-inline-widget" 
                data-url="https://calendly.com/ryan-stvisiongroup?background_color=f9fafb&text_color=111827&primary_color=2563eb"
                style={{ minWidth: '320px', height: '700px' }}
              />
            </CardContent>
          </Card>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">What to Expect</h3>
            <ul className="space-y-2 text-blue-800">
              <li className="flex gap-2">
                <span className="font-semibold">•</span>
                <span>Discussion of your financial goals and needs</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">•</span>
                <span>Review of available lending and investment options</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">•</span>
                <span>Pre-qualification assessment if interested in lending</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">•</span>
                <span>Next steps and timeline for your chosen solution</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <GlobalFooter />
    </div>
  );
}
