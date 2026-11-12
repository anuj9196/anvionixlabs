import { EXPERIMENTS, FOUNDER, SERVICES, SITE, type Service } from "@/data/site";

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

const address = {
  "@type": "PostalAddress",
  streetAddress: SITE.address.street,
  addressLocality: SITE.address.locality,
  addressRegion: SITE.address.region,
  postalCode: SITE.address.postalCode,
  addressCountry: SITE.address.country,
};

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    legalName: SITE.legalName,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone.replace(/\s/g, ""),
    taxID: SITE.gstin,
    description: SITE.description,
    address,
    areaServed: "Worldwide",
    priceRange: "₹₹₹",
    founder: { "@type": "Person", name: FOUNDER.name, url: `${SITE.url}/about#founder` },
    sameAs: [SITE.social.linkedin, SITE.social.github, ...SITE.brands.map((b) => b.url)],
    knowsAbout: ["Web application development", "Django", "Next.js", "React Native", "Flutter", "API development", "Cloud architecture", "Software audits"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: SERVICES.map((s) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: s.name, url: `${SITE.url}/services/${s.slug}` } })),
    },
    owns: EXPERIMENTS.filter((e) => !e.client).map((e) => ({ "@type": "SoftwareApplication", name: e.name, url: e.url, applicationCategory: e.kind })),
  };
}

export function serviceLd(s: Service) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: s.title,
      serviceType: s.name,
      description: s.intro,
      provider: { "@id": `${SITE.url}/#organization` },
      areaServed: "Worldwide",
      url: `${SITE.url}/services/${s.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: s.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE.url}${it.path}` })),
  };
}
