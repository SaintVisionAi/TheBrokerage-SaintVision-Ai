import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';
import REFinanceIntakeForm from '@/components/forms/re-finance-intake';

export default function REFinanceIntakePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-black to-blue-900">
      <GlobalHeader />
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Real Estate Finance Application</h1>
            <p className="text-xl text-white/80">Get financing for your investment property with competitive rates and fast approval</p>
          </div>
          <REFinanceIntakeForm />
        </div>
      </main>
      <GlobalFooter />
    </div>
  );
}
