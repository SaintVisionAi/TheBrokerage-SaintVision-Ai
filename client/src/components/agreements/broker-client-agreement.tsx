import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Check, Download } from 'lucide-react';

interface BrokerClientAgreementProps {
  clientData?: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    transactionType: string;
    serviceType: string;
    exclusivityPeriod: string;
  };
}

export default function BrokerClientAgreement({ clientData }: BrokerClientAgreementProps) {
  const [signature, setSignature] = useState('');
  const [initials, setInitials] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  const handleSign = async () => {
    if (!signature || !initials || !agreedToTerms) {
      alert('Please complete all signature fields and agree to terms');
      return;
    }

    setIsSigning(true);
    
    // In production, this would integrate with DocuSign API
    try {
      const response = await fetch('/api/agreements/sign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agreementType: 'broker-client',
          clientEmail: clientData?.email,
          signature,
          initials,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        alert('Agreement signed successfully! You will receive a copy via email.');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      alert('Error signing agreement. Please try again.');
    } finally {
      setIsSigning(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="bg-white text-black">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Exclusive Broker-Client Agreement
            </CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Licensed in all 50 United States • Valid from {today}
          </p>
        </CardHeader>

        <CardContent className="p-8 space-y-6">
          {/* Agreement Header */}
          <div className="text-center border-b pb-4">
            <h2 className="text-xl font-bold">SAINT VISION GROUP™</h2>
            <p className="text-sm text-gray-600">Real Estate Brokerage Services</p>
            <p className="text-xs text-gray-500">Licensed Real Estate Broker • All 50 States</p>
          </div>

          {/* Parties */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">PARTIES TO THIS AGREEMENT</h3>
            
            <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
              <div>
                <p className="text-sm font-semibold">CLIENT (Principal):</p>
                <p>{clientData?.firstName} {clientData?.lastName}</p>
                <p className="text-sm text-gray-600">{clientData?.address}</p>
                <p className="text-sm text-gray-600">{clientData?.city}, {clientData?.state} {clientData?.zipCode}</p>
                <p className="text-sm text-gray-600">{clientData?.email}</p>
              </div>
              <div>
                <p className="text-sm font-semibold">BROKER (Agent):</p>
                <p>Saint Vision Group™</p>
                <p className="text-sm text-gray-600">Licensed Real Estate Brokerage</p>
                <p className="text-sm text-gray-600">License #: [STATE LICENSE #]</p>
                <p className="text-sm text-gray-600">contact@saintvisiongroup.com</p>
              </div>
            </div>
          </div>

          {/* Agreement Terms */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg">1. SCOPE OF SERVICES</h3>
            <p className="text-sm leading-relaxed">
              Client hereby engages Saint Vision Group™ ("Broker") as their exclusive {clientData?.serviceType} real estate 
              broker for the purpose of <strong>{clientData?.transactionType}</strong> real estate property. Broker agrees to use 
              diligent efforts to procure a ready, willing, and able buyer/seller and to negotiate the terms and conditions of any 
              resulting transaction in the best interests of the Client.
            </p>

            <h3 className="font-bold text-lg mt-6">2. BROKER'S OBLIGATIONS</h3>
            <div className="text-sm space-y-2">
              <p>Broker agrees to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Market the property through MLS, online platforms, and professional networks</li>
                <li>Provide professional photography and property presentation</li>
                <li>Conduct showings and open houses as appropriate</li>
                <li>Negotiate on behalf of Client in good faith</li>
                <li>Coordinate with attorneys, inspectors, and other professionals</li>
                <li>Maintain confidentiality of Client information</li>
                <li>Comply with all federal, state, and local real estate laws</li>
              </ul>
            </div>

            <h3 className="font-bold text-lg mt-6">3. CLIENT'S OBLIGATIONS</h3>
            <div className="text-sm space-y-2">
              <p>Client agrees to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate information about the property</li>
                <li>Cooperate with showings and inspections</li>
                <li>Refer all inquiries to Broker during the term of this agreement</li>
                <li>Disclose any material defects or issues with the property</li>
                <li>Act in good faith throughout the transaction</li>
              </ul>
            </div>

            <h3 className="font-bold text-lg mt-6">4. COMPENSATION</h3>
            <p className="text-sm leading-relaxed">
              Client agrees to pay Broker a commission equal to <strong>the standard rate for {clientData?.state || 'the applicable state'}</strong> 
              upon successful closing of the transaction. Commission shall be paid from the proceeds of the sale/purchase at closing. 
              If Client withdraws from a ready, willing, and able buyer/seller procured by Broker, commission may still be due.
            </p>

            <h3 className="font-bold text-lg mt-6">5. TERM OF AGREEMENT</h3>
            <p className="text-sm leading-relaxed">
              This agreement shall be effective for a period of <strong>{clientData?.exclusivityPeriod || '90'} days</strong> from 
              the date of execution ("Exclusivity Period"). During this period, Client agrees to work exclusively with Broker and 
              not to engage other brokers or sell/purchase independently. This agreement may be terminated by either party with 
              written notice, subject to commission obligations for transactions in progress.
            </p>

            <h3 className="font-bold text-lg mt-6">6. DISCLOSURES & REPRESENTATIONS</h3>
            <div className="text-sm space-y-2">
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Agency Relationship:</strong> Broker represents Client's interests exclusively in this transaction</li>
                <li><strong>Dual Agency:</strong> Broker will not act as dual agent without written consent from all parties</li>
                <li><strong>Fair Housing:</strong> All parties agree to comply with Fair Housing laws and regulations</li>
                <li><strong>Material Facts:</strong> Client warrants all information provided is true and complete</li>
                <li><strong>Financial Capacity:</strong> Client represents they have financial capacity to complete the transaction</li>
              </ul>
            </div>

            <h3 className="font-bold text-lg mt-6">7. INDEMNIFICATION & LIABILITY</h3>
            <p className="text-sm leading-relaxed">
              Client agrees to indemnify and hold Broker harmless from any claims, damages, or liabilities arising from Client's 
              misrepresentation, breach of contract, or violation of applicable laws. Broker's liability shall be limited to the 
              amount of commission received, except in cases of gross negligence or willful misconduct.
            </p>

            <h3 className="font-bold text-lg mt-6">8. DISPUTE RESOLUTION</h3>
            <p className="text-sm leading-relaxed">
              Any disputes arising from this agreement shall first be submitted to mediation. If mediation fails, disputes shall 
              be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. 
              The prevailing party shall be entitled to reasonable attorney's fees and costs.
            </p>

            <h3 className="font-bold text-lg mt-6">9. GOVERNING LAW</h3>
            <p className="text-sm leading-relaxed">
              This agreement shall be governed by the laws of the State of <strong>{clientData?.state || '[CLIENT STATE]'}</strong> 
              and applicable federal laws. Broker holds all necessary licenses and complies with all state-specific requirements.
            </p>

            <h3 className="font-bold text-lg mt-6">10. ENTIRE AGREEMENT</h3>
            <p className="text-sm leading-relaxed">
              This agreement constitutes the entire understanding between the parties and supersedes all prior negotiations, 
              representations, or agreements. Any modifications must be in writing and signed by both parties.
            </p>
          </div>

          {/* Signature Section */}
          <div className="border-t pt-8 mt-8 space-y-6">
            <h3 className="font-bold text-lg">EXECUTION OF AGREEMENT</h3>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
              <p className="text-sm">
                <strong>Important:</strong> By signing below, you acknowledge that you have read, understood, and agree to 
                all terms and conditions of this Broker-Client Agreement. This is a legally binding contract.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Client Signature */}
              <div className="space-y-4">
                <h4 className="font-semibold">CLIENT SIGNATURE</h4>
                <div>
                  <Label>Full Legal Name (Type to Sign)</Label>
                  <Input
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    placeholder="Type your full name"
                    className="font-signature text-2xl"
                    data-testid="input-signature"
                  />
                </div>
                <div>
                  <Label>Initials</Label>
                  <Input
                    value={initials}
                    onChange={(e) => setInitials(e.target.value)}
                    placeholder="Your initials"
                    maxLength={4}
                    className="w-24"
                    data-testid="input-initials"
                  />
                </div>
                <p className="text-sm text-gray-600">Date: {today}</p>
              </div>

              {/* Broker Signature (Pre-signed) */}
              <div className="space-y-4">
                <h4 className="font-semibold">BROKER SIGNATURE</h4>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-signature text-2xl mb-2">Saint Vision Group™</p>
                  <p className="text-sm text-gray-600">Authorized Representative</p>
                  <p className="text-sm text-gray-600">Date: {today}</p>
                  <div className="mt-2">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded">
              <Checkbox
                id="agree"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
                data-testid="checkbox-agree"
              />
              <label htmlFor="agree" className="text-sm cursor-pointer">
                I have read and understand this entire agreement. I agree to all terms and conditions outlined above. 
                I acknowledge this is a legally binding contract and that my typed signature has the same legal effect 
                as a handwritten signature.
              </label>
            </div>

            {/* Sign Button */}
            <Button
              onClick={handleSign}
              disabled={isSigning || !signature || !initials || !agreedToTerms}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-lg py-6"
              data-testid="button-sign-agreement"
            >
              {isSigning ? (
                "Processing Signature..."
              ) : (
                <>
                  <Check className="mr-2 h-5 w-5" />
                  Sign Agreement Electronically
                </>
              )}
            </Button>

            <p className="text-xs text-center text-gray-500">
              By clicking "Sign Agreement Electronically", you agree to use electronic signatures in accordance with 
              the ESIGN Act and your state's Uniform Electronic Transactions Act (UETA).
            </p>
          </div>

          {/* Footer Disclaimers */}
          <div className="border-t pt-6 mt-8 text-xs text-gray-500 space-y-2">
            <p>
              <strong>License Disclosure:</strong> Saint Vision Group™ is a licensed real estate brokerage operating 
              in compliance with all applicable state and federal laws. State-specific licenses available upon request.
            </p>
            <p>
              <strong>Fair Housing Statement:</strong> Saint Vision Group™ is committed to compliance with all fair 
              housing and equal opportunity laws. We do not discriminate based on race, color, religion, sex, handicap, 
              familial status, national origin, sexual orientation, or gender identity.
            </p>
            <p>
              <strong>Document Retention:</strong> A fully executed copy of this agreement will be provided to you via 
              email and stored securely in compliance with state record-keeping requirements.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
