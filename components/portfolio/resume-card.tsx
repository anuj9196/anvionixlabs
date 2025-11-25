"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { HighlightKeywords } from "@/lib/highlight-keywords";
import { ExternalLink } from "lucide-react";
import { Badge } from "../ui/badge";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string | string[] | readonly string[];
  gpa?: string;
  gpaLabel?: string;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  period,
  gpa,
  gpaLabel,
  description,
}: ResumeCardProps) => {
  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <Avatar className="size-12 border">
          <AvatarImage
            src={logoUrl}
            alt={altText}
            className="object-contain"
          />
          <AvatarFallback>{altText[0]}</AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
              <h3 className="font-medium text-base leading-none">{title}</h3>
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {subtitle}
                {/* <HighlightKeywords text={subtitle} /> */}
              </p>
            )}
            {href && (
              <Badge asChild>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${title} website`}
                >
                  <span className="truncate max-w-[200px]">{href.replace(/^https?:\/\//, '').replace(/^www\./, '')}</span>
                  <ExternalLink className="size-3.5 flex-shrink-0" />
                </Link>
                </Badge>
              )}
            {description && (
              <ul className="mt-2 space-y-1 list-disc list-inside text-xs text-muted-foreground leading-relaxed">
                {(Array.isArray(description) ? [...description] : [description]).map(
                  (item, index) => {
                    const text = typeof item === "string" ? item : String(item);
                    return (
                      <li key={index}>
                        {/* <HighlightKeywords text={text} /> */}
                        {text}
                      </li>
                    );
                  }
                )}
              </ul>
            )}
          </div>
          <div className="flex-shrink-0 flex flex-col items-end gap-1">
            <div className="text-sm text-muted-foreground tabular-nums">
              {period}
            </div>
            {gpa && (
              <div className="text-sm text-muted-foreground tabular-nums">
                {gpaLabel || "GPA"}: {gpa}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};