import GHLFormEmbed from '@/components/GHLFormEmbed';

export default function FullApplicationForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Full Lending Application</h1>
          <p className="text-muted-foreground">
            Complete your Saint Vision Group lending application
          </p>
        </div>
        
        <GHLFormEmbed
          formId="0zcz0ZlG2eEddg94wcbq"
          formName="Saint Vision Group Full Lending Application"
          height="3055px"
          title="Saint Vision Group Full Lending Application"
          className="w-full"
        />
      </div>
    </div>
  );
}
