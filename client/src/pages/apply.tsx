import GHLFormEmbed from '@/components/GHLFormEmbed';

export default function PreQualForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Apply Now - Pre-Qualification</h1>
          <p className="text-muted-foreground">
            Start your journey with Saint Vision Group
          </p>
        </div>
        
        <GHLFormEmbed
          formId="gPGc1pTZGRvxybqPpDRL"
          formName="Apply Now SVG2"
          height="2067px"
          title="Apply Now SVG2"
          className="w-full"
        />
      </div>
    </div>
  );
}
