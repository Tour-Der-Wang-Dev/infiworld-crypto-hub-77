
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  noindex?: boolean;
  nofollow?: boolean;
  canonicalPath?: string;
  schemaMarkup?: Record<string, any>;
}

const SEO = ({
  title = "INFIWORLD - ซื้อ ขาย เช่า จอง ด้วยคริปโตและบัตร",
  description = "แพลตฟอร์มครบวงจรที่รองรับการซื้อขายด้วยเงินสด บัตรเครดิต และคริปโตเคอเรนซี",
  keywords = "คริปโตเคอเรนซี, ฟรีแลนซ์, อสังหาริมทรัพย์, คริปโตแพลตฟอร์มไทย",
  image = "https://lovable.dev/opengraph-image-p98pqg.png",
  noindex = false,
  nofollow = false,
  canonicalPath,
  schemaMarkup,
}: SEOProps) => {
  const location = useLocation();
  const baseUrl = "https://infiworld.com"; // Replace with your actual domain
  
  // Construct canonical URL
  const canonicalUrl = canonicalPath 
    ? `${baseUrl}${canonicalPath}`
    : `${baseUrl}${location.pathname}`;
  
  // Create robots meta content
  const robotsContent = `${noindex ? 'noindex' : 'index'}, ${nofollow ? 'nofollow' : 'follow'}`;
  
  // Update canonical link in the document
  useEffect(() => {
    const canonicalLink = document.getElementById('canonical-link') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = canonicalUrl;
    }
  }, [canonicalUrl]);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* OpenGraph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Schema.org structured data */}
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
