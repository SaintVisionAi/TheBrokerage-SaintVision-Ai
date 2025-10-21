import RealEstateForm from '@/components/forms/ghl-real-estate';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function RealEstateLeadForm() {
  return (
    <>
      <GlobalHeader />
      <div className="bg-black min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3 text-white">Real Estate Solutions</h1>
            <p className="text-lg text-gray-400">
              Connect with our real estate investment and financing solutions
            </p>
          </div>

          <RealEstateForm />
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
