import React from "react";

// List of important keywords to highlight
const KEYWORDS = [
  // Technologies
  "Django",
  "Angular",
  "React",
  "Next.js",
  "Flutter",
  "AWS",
  "ECS",
  "S3",
  "CloudFront",
  "Lambda",
  "WAF",
  "GCP",
  "DigitalOcean",
  "Docker",
  "CI/CD",
  "GitHub Actions",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Neo4j",
  "DynamoDB",
  "Python",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Express.js",
  // Concepts
  "AI",
  "SaaS",
  "Cloud",
  "Security",
  "DevOps",
  "Microservices",
  "API",
  "REST",
  "GraphQL",
  // Metrics and numbers
  /\d+%/g,
  /\d+\+/g,
  /\d+\.\d+%/g,
  // Important phrases
  "Engineering",
  "Architecture",
  "Scalable",
  "High-performance",
  "Enterprise",
  "Automation",
  "Integration",
  "Deployment",
  "Infrastructure",
  "Performance",
  "Reliability",
  "Security-first",
  "Zero-downtime",
];

interface HighlightKeywordsProps {
  text: string;
  className?: string;
}

export function HighlightKeywords({ text, className = "" }: HighlightKeywordsProps) {
  // Convert text to string if it's not already
  const textStr = typeof text === "string" ? text : String(text);
  
  if (!textStr) return <span className={className}>{text}</span>;

  const parts: (string | React.ReactNode)[] = [];
  let lastIndex = 0;
  let keyCounter = 0;

  // Create a combined regex pattern
  const keywordPatterns = KEYWORDS.map((keyword) => {
    if (keyword instanceof RegExp) {
      return keyword;
    }
    // Escape special regex characters and create word boundary pattern
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "gi");
  });

  // Find all matches
  const matches: Array<{ index: number; length: number; text: string }> = [];

  keywordPatterns.forEach((pattern) => {
    // Reset regex lastIndex to avoid issues
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(textStr)) !== null) {
      matches.push({
        index: match.index,
        length: match[0].length,
        text: match[0],
      });
    }
  });

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Remove overlapping matches (keep the longer one)
  const filteredMatches: Array<{ index: number; length: number; text: string }> = [];
  for (const match of matches) {
    const overlaps = filteredMatches.some(
      (existing) =>
        match.index < existing.index + existing.length &&
        match.index + match.length > existing.index
    );
    if (!overlaps) {
      filteredMatches.push(match);
    }
  }

  // Build the parts array
  filteredMatches.forEach((match) => {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(textStr.substring(lastIndex, match.index));
    }

    // Add the highlighted match
    parts.push(
      <span
        key={`highlight-${keyCounter++}`}
        className="font-semibold text-foreground bg-primary/10 dark:bg-primary/20 px-1 rounded"
      >
        {match.text}
      </span>
    );

    lastIndex = match.index + match.length;
  });

  // Add remaining text
  if (lastIndex < textStr.length) {
    parts.push(textStr.substring(lastIndex));
  }

  return <span className={className}>{parts.length > 0 ? parts : textStr}</span>;
}

