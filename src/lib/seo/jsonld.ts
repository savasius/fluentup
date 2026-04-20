const SITE_URL = "https://fluentupenglish.com";

export function wordPageJsonLd(word: {
  word: string;
  definition: string;
  partOfSpeech: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: word.word,
    description: word.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "FluentUp English Vocabulary",
      url: `${SITE_URL}/vocabulary`,
    },
    url: `${SITE_URL}/vocabulary/${word.slug}`,
  };
}

export function grammarPageJsonLd(topic: {
  title: string;
  description: string;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: topic.title,
    description: topic.description,
    url: `${SITE_URL}/grammar/${topic.slug}`,
    author: {
      "@type": "Organization",
      name: "FluentUp English",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "FluentUp English",
      url: SITE_URL,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
