import GHLFormEmbed from '@/components/GHLFormEmbed';

export default function RealEstateLeadForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Real Estate Lead Generation</h1>
          <p className="text-muted-foreground">
            Connect with our real estate solutions
          </p>
        </div>
        
        <GHLFormEmbed
          formId="M2jNYXh8wl8FYhxOap9N"
          formName="Real Estate Agent Lead Generation"
          height="1118px"
          title="Real Estate Agent Lead Generation"
          className="w-full"
        />
      </div>
    </div>
  );
}
