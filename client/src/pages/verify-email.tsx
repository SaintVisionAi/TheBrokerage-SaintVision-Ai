import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';

export default function VerifyEmail() {
  const { token } = useParams();
  const [, setLocation] = useLocation();
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
        setTimeout(() => setLocation('/login'), 3000);
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to verify email');
      }
    } catch (err) {
      setStatus('error');
      setMessage('An error occurred while verifying your email');
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    try {
      // TODO: Implement resend verification email endpoint
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setMessage('Verification email sent! Please check your inbox.');
      } else {
        setMessage('Failed to resend verification email. Please try again.');
      }
    } catch (err) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader className="text-center">
          {status === 'loading' && (
            <>
              <div className="mx-auto w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
              <CardTitle className="text-2xl text-white">Verifying Email</CardTitle>
              <CardDescription className="text-gray-400">
                Please wait while we verify your email address...
              </CardDescription>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mx-auto w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-white">Email Verified!</CardTitle>
              <CardDescription className="text-gray-400">
                {message}
              </CardDescription>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mx-auto w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
              <CardTitle className="text-2xl text-white">Verification Failed</CardTitle>
              <CardDescription className="text-gray-400">
                {message}
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="text-center">
          {status === 'success' && (
            <div>
              <p className="text-gray-300 mb-4">
                Redirecting to login page...
              </p>
              <Link href="/login">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold">
                  Go to Login
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Button
                onClick={handleResendVerification}
                disabled={resending}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
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
              <Link href="/login">
                <Button variant="outline" className="w-full border-neutral-700 text-white hover:bg-neutral-800">
                  Back to Login
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
