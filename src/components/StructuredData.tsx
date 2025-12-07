export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Iatoba",
    "url": "https://iatoba.com",
    "image": "https://iatoba.com/portfolio-3d-landing.png",
    "jobTitle": "Full-Stack Developer & DevOps Engineer",
    "description": "Building high-performance web applications with Next.js, React, and 3D experiences. Specializing in full-stack development, workflow automation, self-hosted AI, and DevOps solutions.",
    "knowsAbout": [
      "Full-Stack Development",
      "Next.js",
      "React",
      "Three.js",
      "3D Web Development",
      "TypeScript",
      "DevOps",
      "Docker",
      "CI/CD",
      "Azure DevOps",
      "Nginx",
      "Workflow Automation",
      "n8n",
      "Self-Hosted AI",
      "LLM",
      "API Development",
      "E2E Testing"
    ],
    "sameAs": [
      "https://github.com/iatoba",
      "https://twitter.com/iatoba"
    ],
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    }
  };

  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Iatoba Portfolio",
    "url": "https://iatoba.com",
    "description": "Portfolio website showcasing full-stack development, DevOps, and 3D web experiences",
    "author": {
      "@type": "Person",
      "name": "Iatoba"
    }
  };

  const professionalServiceData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "Iatoba - Full-Stack Development Services",
    "url": "https://iatoba.com",
    "description": "Professional full-stack web development, 3D web experiences, workflow automation, and DevOps services",
    "priceRange": "$$",
    "areaServed": "Worldwide",
    "serviceType": [
      "Full-Stack Web Development",
      "3D Web Experiences",
      "API Development",
      "Workflow Automation",
      "DevOps & CI/CD",
      "Self-Hosted AI Solutions",
      "E2E Testing & QA"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceData) }}
      />
    </>
  );
}
