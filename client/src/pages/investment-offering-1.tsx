import GHLFormEmbed from '@/components/GHLFormEmbed';

export default function InvestmentIntakeForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Investment Opportunity</h1>
          <p className="text-muted-foreground">
            Join our exclusive investment community
          </p>
        </div>
        
        <GHLFormEmbed
          formId="1pivHofKUp5uTa9ws1TG"
          formName="Investment Quick Form (Social)"
          height="1325px"
          title="Investment Quick Form (Social)"
          className="w-full"
        />
      </div>
    </div>
  );
}
