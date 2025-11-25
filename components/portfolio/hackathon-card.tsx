import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Icons } from "@/components/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Props {
  title: string;
  description: string;
  dates: string;
  location: string;
  image?: string;
  href?: string;
  tags?: readonly string[];
  links?: readonly {
    icon: React.ReactNode;
    title: string;
    href: string;
  }[];
}

// Generate a consistent color based on the title
function getColorFromTitle(title: string): string {
  // Predefined palette of attractive colors
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-orange-500",
    "bg-red-500",
    "bg-cyan-500",
    "bg-violet-500",
    "bg-rose-500",
  ];

  // Simple hash function to get consistent color for same title
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

// Map tag names to icons (only using icons that exist in Icons component)
function getTagIcon(tag: string): React.ReactNode | null {
  const tagLower = tag.toLowerCase();
  const iconMap: Record<string, () => React.ReactNode> = {
    "react": () => Icons.react({ className: "size-3" }),
    "next.js": () => Icons.nextjs({ className: "size-3" }),
    "nextjs": () => Icons.nextjs({ className: "size-3" }),
    "typescript": () => Icons.typescript({ className: "size-3" }),
    "github": () => Icons.github({ className: "size-3" }),
    "android": () => Icons.android({ className: "size-3" }),
    "ios": () => Icons.apple({ className: "size-3" }),
    "apple": () => Icons.apple({ className: "size-3" }),
    "google": () => Icons.google({ className: "size-3" }),
    "aws": () => Icons.amazon({ className: "size-3" }),
    "django": () => Icons.django({ className: "size-3" }),
    "mysql": () => Icons.mysql({ className: "size-3" }),
    "postgresql": () => Icons.postgresql({ className: "size-3" }),
    "mongodb": () => Icons.mongodb({ className: "size-3" }),
    "neo4j": () => Icons.neo4j({ className: "size-3" }),
    "angular": () => Icons.angular({ className: "size-3" }),
    "flutter": () => Icons.flutter({ className: "size-3" }),
    "dart": () => Icons.dart({ className: "size-3" }),
    "java": () => Icons.java({ className: "size-3" }),
    "kotlin": () => Icons.kotlin({ className: "size-3" }),
    "swift": () => Icons.swift({ className: "size-3" }),
    "qr code": () => Icons.QrCode({ className: "size-3" }),
    "qrcode": () => Icons.QrCode({ className: "size-3" }),
    "qr": () => Icons.QrCode({ className: "size-3" }),
    "qr-code": () => Icons.QrCode({ className: "size-3" }),
    "qr-code-scanner": () => Icons.QrCode({ className: "size-3" }),
    "qr-code-reader": () => Icons.QrCode({ className: "size-3" }),
    "qr-code-generator": () => Icons.QrCode({ className: "size-3" }),
  };

  // Try exact match first
  if (iconMap[tagLower]) {
    return iconMap[tagLower]();
  }

  // Try partial match (e.g., "CI/CD" contains "ci", "github actions" contains "github")
  for (const [key, iconFn] of Object.entries(iconMap)) {
    if (tagLower.includes(key) || key.includes(tagLower)) {
      return iconFn();
    }
  }

  return null;
}

export function HackathonCard({
  title,
  description,
  dates,
  location,
  image,
  href,
  tags,
  links,
}: Props) {
  const fallbackColor = getColorFromTitle(title);

  return (
    <li className="relative ml-10 py-4">
      <div className="absolute -left-16 top-2 flex items-center justify-center bg-white rounded-full">
        <Avatar className="border size-12 m-auto">
          <AvatarImage src={image} alt={title} className="object-contain" />
          <AvatarFallback className={`${fallbackColor} text-white font-semibold`}>
            {title[0]}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex flex-1 flex-col justify-start gap-1">
        {dates && (
          <time className="text-xs text-muted-foreground">{dates}</time>
        )}
        <h2 className="font-semibold leading-none">{title}</h2>
        {location && (
          <p className="text-sm text-muted-foreground">{location}</p>
        )}
        {description && (
          <span className="prose dark:prose-invert text-sm text-muted-foreground">
            {description}
          </span>
        )}
        {tags && tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => {
              const icon = getTagIcon(tag);
              return (
                <TooltipProvider key={tag}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="secondary" className="text-xs flex items-center gap-1">
                        {icon}
                        {tag}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="flex items-center gap-1">
                      {icon && icon}
                      {tag}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </div>
      {(href || (links && links.length > 0)) && (
        <div className="mt-2 flex flex-row flex-wrap items-start gap-2">
          {href && (
            <Badge asChild>
              <Link href={href} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${title} website`}>
                {href.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                <ExternalLink className="size-3.5 flex-shrink-0" />
              </Link>
            </Badge>
          )}
          {links?.map((link, idx) => (
            <Link href={link.href} key={idx}>
              <Badge key={idx} title={link.title} className="flex gap-2">
                {link.icon}
                {link.title}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </li>
  );
}