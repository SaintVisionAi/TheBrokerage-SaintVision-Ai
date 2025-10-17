import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import BrokerClientAgreement from '@/components/agreements/broker-client-agreement';

export default function AgreementPreviewPage() {
  // TODO: Get client data from query params or state
  const mockClientData = {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    address: '123 Main Street',
    city: 'Los Angeles',
    state: 'California',
    zipCode: '90001',
    transactionType: 'buying and selling',
    serviceType: 'residential',
    exclusivityPeriod: '90'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <GlobalHeader />
      <main className="container mx-auto px-4 py-12">
        <BrokerClientAgreement clientData={mockClientData} />
      </main>
      <GlobalFooter />
    </div>
  );
}
