import GHLPreQualForm from '@/components/forms/ghl-prequal-form';
import GlobalHeader from '@/components/layout/global-header';
import GlobalFooter from '@/components/layout/global-footer';

export default function PreQualForm() {
  return (
    <>
      <GlobalHeader />
      <div className="bg-black min-h-screen px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-3 text-white">Apply Now - Pre-Qualification</h1>
            <p className="text-lg text-gray-400">
              Start your journey with Saint Vision Group. Complete this quick assessment to determine your eligibility.
            </p>
          </div>

          <GHLPreQualForm />
        </div>
      </div>
      <GlobalFooter />
    </>
  );
}
