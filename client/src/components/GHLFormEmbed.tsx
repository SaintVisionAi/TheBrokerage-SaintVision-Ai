import { useEffect } from 'react';

interface GHLFormEmbedProps {
  formId: string;
  formName: string;
  height?: string;
  title?: string;
  className?: string;
}

export default function GHLFormEmbed({
  formId,
  formName,
  height = '2500px',
  title,
  className = 'w-full'
}: GHLFormEmbedProps) {
  useEffect(() => {
    // Load GHL form script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <iframe
      src={`https://api.leadconnectorhq.com/widget/form/${formId}`}
      style={{
        width: '100%',
        height: height,
        border: 'none',
        borderRadius: '8px'
      }}
      id={`inline-${formId}`}
      data-layout="{'id':'INLINE'}"
      data-trigger-type="alwaysShow"
      data-activation-type="alwaysActivated"
      data-deactivation-type="neverDeactivate"
      data-form-name={formName}
      title={title || formName}
      className={className}
    />
  );
}
