import GHLFormEmbed from '@/components/GHLFormEmbed';

export default function DocumentUploadForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">🛡️ Secure Document Upload</h1>
          <p className="text-muted-foreground">
            Upload required documents for your application
          </p>
        </div>
        
        <GHLFormEmbed
          formId="yLjMJMuW3mM08ju9GkWY"
          formName="Secure SVG Upload Portal"
          height="1304px"
          title="Secure SVG Upload Portal"
          className="w-full"
        />
      </div>
    </div>
  );
}
