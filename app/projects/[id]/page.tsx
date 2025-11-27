import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ProjectPageClient } from "./ProjectPageClient";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return {
      title: "Project Not Found | Anvionix Labs",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = `${project.name} | Anvionix Labs`;
  const description =
    project.description ?? "Explore Anvionix Labs projects showcasing our work.";
  const image = project.screenshots?.[0];
  const canonical = project.websiteUrl;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: image ? [image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}
