import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const [, navigate] = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const [resending, setResending] = useState(false);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch(`/api/auth/verify-email/${verificationToken}`);
      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Your email has been verified successfully!');
        // Redirect to login after 3 seconds
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to verify email');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An error occurred while verifying your email');
    }
  };

  const resendVerification = async () => {
    setResending(true);
    try {
      // You'll need to pass the email somehow - could be in URL params or stored in session
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: '' }) // TODO: Get email from somewhere
      });
      
      const data = await response.json();
      if (response.ok) {
        setMessage('Verification email resent! Please check your inbox.');
      } else {
        setMessage(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      setMessage('An error occurred while resending verification email');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-[#1d1d1f] via-[#2d2d2f] to-[#1d1d1f]">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur border-0 shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-[#ffd700] to-[#ffed4e] rounded-full flex items-center justify-center mb-4">
            {status === 'loading' && <Loader2 className="w-8 h-8 text-[#1d1d1f] animate-spin" />}
            {status === 'success' && <CheckCircle className="w-8 h-8 text-[#1d1d1f]" />}
            {status === 'error' && <XCircle className="w-8 h-8 text-[#1d1d1f]" />}
          </div>
          <CardTitle className="text-2xl font-bold text-[#1d1d1f]">
            {status === 'loading' && 'Verifying Your Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
          <CardDescription className="text-[#666]">
            {message}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {status === 'success' && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                <p className="text-green-800 text-sm">
                  ✅ Your account is now active! Redirecting you to login...
                </p>
              </div>
              <Button 
                onClick={() => navigate('/login')}
                className="w-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] hover:from-[#ffed4e] hover:to-[#ffd700] text-[#1d1d1f] font-semibold shadow-lg"
              >
                Go to Login
              </Button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm text-center">
                  {message}
                </p>
              </div>
              <div className="space-y-2">
                <Button 
                  onClick={resendVerification}
                  disabled={resending}
                  className="w-full bg-gradient-to-r from-[#ffd700] to-[#ffed4e] hover:from-[#ffed4e] hover:to-[#ffd700] text-[#1d1d1f] font-semibold shadow-lg"
                >
                  {resending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
                <Button 
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </>
          )}
          
          {status === 'loading' && (
            <div className="text-center py-8">
              <p className="text-sm text-[#666]">
                Please wait while we verify your email address...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
