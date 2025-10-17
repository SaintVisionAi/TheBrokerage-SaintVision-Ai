import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import REBrokerageIntakeForm from '@/components/forms/re-brokerage-intake';

export default function REBrokerageIntakePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-black to-purple-900">
      <GlobalHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Real Estate Brokerage Services</h1>
            <p className="text-xl text-white/80">Begin your exclusive broker-client relationship with Saint Vision Group</p>
          </div>
          <REBrokerageIntakeForm />
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
}
