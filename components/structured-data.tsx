/**
 * Component to render JSON-LD structured data for SEO
 * Safely escapes content to prevent XSS
 */
export function StructuredData({ data }: { data: object }) {
  // Safely stringify and escape the data
  const jsonString = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonString }}
    />
  );
}
