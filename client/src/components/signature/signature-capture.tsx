import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Pen, Type, Eraser, Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SignatureCaptureProps {
  onSignatureComplete: (signatureData: {
    data: string;
    type: 'drawn' | 'typed';
    consentChecks: Record<string, boolean>;
    signerName: string;
  }) => void;
  onCancel?: () => void;
  loanAmount?: string;
  applicationId?: string;
  applicantName?: string;
}

const CONSENT_ITEMS = [
  {
    id: 'loan_terms',
    label: 'I acknowledge and agree to the loan terms and conditions',
    required: true
  },
  {
    id: 'credit_check',
    label: 'I authorize a credit check and financial verification',
    required: true
  },
  {
    id: 'info_accuracy',
    label: 'I certify all provided information is accurate and complete',
    required: true
  },
  {
    id: 'communication',
    label: 'I consent to receive communications via phone, email, and SMS',
    required: true
  },
  {
    id: 'data_sharing',
    label: 'I understand my information will be shared with lending partners',
    required: true
  }
];

export default function SignatureCapture({
  onSignatureComplete,
  onCancel,
  loanAmount = '',
  applicationId = '',
  applicantName = ''
}: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [typedSignature, setTypedSignature] = useState('');
  const [signatureType, setSignatureType] = useState<'drawn' | 'typed'>('drawn');
  const [consentChecks, setConsentChecks] = useState<Record<string, boolean>>({});
  const [signerName, setSignerName] = useState(applicantName);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (signatureType === 'drawn') {
      initializeCanvas();
    }
  }, [signatureType]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Configure drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add signature line
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, canvas.height - 30);
    ctx.lineTo(canvas.width - 20, canvas.height - 30);
    ctx.stroke();

    // Add "Sign here" text
    ctx.fillStyle = '#999999';
    ctx.font = '12px Arial';
    ctx.fillText('Sign here', 20, canvas.height - 10);

    // Reset drawing style
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setHasDrawnSignature(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.nativeEvent.offsetX;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e 
      ? e.touches[0].clientX - rect.left 
      : e.nativeEvent.offsetX;
    const y = 'touches' in e 
      ? e.touches[0].clientY - rect.top 
      : e.nativeEvent.offsetY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    setHasDrawnSignature(false);
    initializeCanvas();
  };

  const validateAndSubmit = () => {
    const newErrors: string[] = [];

    // Check if signature is provided
    if (signatureType === 'drawn' && !hasDrawnSignature) {
      newErrors.push('Please draw your signature');
    }
    if (signatureType === 'typed' && !typedSignature.trim()) {
      newErrors.push('Please type your signature');
    }

    // Check if name is provided
    if (!signerName.trim()) {
      newErrors.push('Please enter your full name');
    }

    // Check all required consents
    const missingConsents = CONSENT_ITEMS
      .filter(item => item.required && !consentChecks[item.id])
      .map(item => item.label);
    
    if (missingConsents.length > 0) {
      newErrors.push('Please check all required consent boxes');
    }

    setErrors(newErrors);

    if (newErrors.length === 0) {
      // Generate signature data
      let signatureData = '';
      
      if (signatureType === 'drawn' && canvasRef.current) {
        signatureData = canvasRef.current.toDataURL('image/png');
      } else if (signatureType === 'typed') {
        // Create a canvas for typed signature
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 150;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#000000';
          ctx.font = 'italic 30px Brush Script MT, cursive';
          ctx.fillText(typedSignature, 20, 80);
          signatureData = canvas.toDataURL('image/png');
        }
      }

      onSignatureComplete({
        data: signatureData,
        type: signatureType,
        consentChecks,
        signerName
      });
    }
  };

  const handleConsentChange = (itemId: string, checked: boolean) => {
    setConsentChecks(prev => ({ ...prev, [itemId]: checked }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto" data-testid="signature-capture-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pen className="h-5 w-5" />
          Electronic Signature & Consent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Disclosure Text */}
        <div className="p-4 bg-gray-50 rounded-lg text-sm space-y-2">
          <h3 className="font-semibold">Loan Application Disclosure</h3>
          <p className="text-gray-700">
            By signing this application, you are agreeing to proceed with a loan application
            {loanAmount && ` for ${loanAmount}`}. Your signature authorizes Saint Vision Group 
            and its lending partners to verify the information provided and make credit inquiries 
            as necessary to process your application.
          </p>
          <p className="text-gray-600 text-xs">
            Application ID: {applicationId || 'Will be generated upon submission'}
          </p>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-3">
          <Label>Required Consents</Label>
          {CONSENT_ITEMS.map((item) => (
            <div key={item.id} className="flex items-start space-x-2">
              <Checkbox
                id={item.id}
                checked={consentChecks[item.id] || false}
                onCheckedChange={(checked) => handleConsentChange(item.id, checked as boolean)}
                data-testid={`consent-${item.id}`}
              />
              <label
                htmlFor={item.id}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {item.label} {item.required && <span className="text-red-500">*</span>}
              </label>
            </div>
          ))}
        </div>

        {/* Signer Name */}
        <div className="space-y-2">
          <Label htmlFor="signer-name">
            Full Legal Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="signer-name"
            type="text"
            placeholder="Enter your full legal name"
            value={signerName}
            onChange={(e) => setSignerName(e.target.value)}
            data-testid="input-signer-name"
          />
        </div>

        {/* Signature Tabs */}
        <Tabs value={signatureType} onValueChange={(value) => setSignatureType(value as 'drawn' | 'typed')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="drawn" className="flex items-center gap-2">
              <Pen className="h-4 w-4" />
              Draw Signature
            </TabsTrigger>
            <TabsTrigger value="typed" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Type Signature
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="drawn" className="space-y-4">
            <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
              <canvas
                ref={canvasRef}
                className="w-full h-48 cursor-crosshair touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                data-testid="signature-canvas"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearCanvas}
                className="flex items-center gap-2"
                data-testid="button-clear-signature"
              >
                <Eraser className="h-4 w-4" />
                Clear Signature
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="typed" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="typed-sig">Type your signature</Label>
              <Input
                id="typed-sig"
                type="text"
                placeholder="Type your full name as signature"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                className="text-2xl font-signature"
                style={{ fontFamily: 'Brush Script MT, cursive', fontStyle: 'italic' }}
                data-testid="input-typed-signature"
              />
            </div>
            {typedSignature && (
              <div className="p-4 border-2 border-gray-300 rounded-lg bg-white">
                <p 
                  className="text-3xl text-center"
                  style={{ fontFamily: 'Brush Script MT, cursive', fontStyle: 'italic' }}
                >
                  {typedSignature}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Please complete all required fields</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside mt-2">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex items-center gap-2"
            data-testid="button-cancel-signature"
          >
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={validateAndSubmit}
            className="flex items-center gap-2"
            data-testid="button-submit-signature"
          >
            <Check className="h-4 w-4" />
            Sign & Submit Application
          </Button>
        </div>

        {/* Legal Notice */}
        <div className="text-xs text-gray-500 text-center pt-4 border-t">
          <p>
            By clicking "Sign & Submit Application", you agree that your electronic signature
            is the legal equivalent of your manual signature on this application.
          </p>
          <p className="mt-1">
            Date & Time: {new Date().toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}