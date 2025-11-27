"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, Smartphone, Globe, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShineBorder } from "@/components/ui/shine-border";
import { BorderBeam } from "@/components/ui/border-beam";
import { BlurFade } from "@/components/ui/blur-fade";
import { ImageModal } from "@/components/image-modal";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { TechStackBeam } from "@/components/tech-stack-beam";
import type { Project } from "@/data/projects";

type ProjectPageClientProps = {
  project: Project;
};

export function ProjectPageClient({ project }: ProjectPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <div className="relative w-full h-[70vh] min-h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
          {project.screenshots[0] && (
            <Image
              src={project.screenshots[0]}
              alt={project.name}
              fill
              className="object-cover opacity-20"
              priority
            />
          )}
          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16">
            <BlurFade delay={0.1}>
              <Link href="/#projects">
                <Button variant="ghost" className="mb-8 text-foreground/70 hover:text-foreground group">
                  <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                  Back to Projects
                </Button>
              </Link>
            </BlurFade>

            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-8">
              <div className="flex-1">
                <BlurFade delay={0.2}>
                  <div className="flex items-center gap-3 mb-4">
                    {project.type === "web" ? (
                      <Globe className="w-6 h-6 text-primary" />
                    ) : (
                      <Smartphone className="w-6 h-6 text-primary" />
                    )}
                    <span className="text-sm uppercase tracking-wider text-muted-foreground">{project.type}</span>
                  </div>
                </BlurFade>
                <BlurFade delay={0.3}>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6">{project.name}</h1>
                </BlurFade>
                <BlurFade delay={0.4}>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl leading-relaxed">
                    {project.description}
                  </p>
                </BlurFade>
              </div>

              {project.websiteUrl && (
                <BlurFade delay={0.5}>
                  <div className="relative">
                    <ShimmerButton
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      shimmerColor="#ffffff"
                      background="hsl(var(--primary))"
                    >
                      <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <span>Visit Website</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </ShimmerButton>
                  </div>
                </BlurFade>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Tech Stack with Animated Beam */}
          <BlurFade delay={0.6}>
            <div className="mb-16 relative">
              <h2 className="text-3xl font-bold text-foreground mb-8">Tech Stack</h2>
              <div className="relative rounded-lg border bg-card/50 p-8 overflow-hidden min-h-[200px]">
                <BorderBeam duration={8} size={100} colorFrom="#A07CFE" colorTo="#FE8FB5" />
                <div className="relative z-10">
                  <TechStackBeam techs={project.techStack} centerLabel="Tech Stack" />
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Screenshots Gallery */}
          <BlurFade delay={0.7}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-8">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.screenshots.map((screenshot, idx) => (
                  <Card
                    key={idx}
                    className="overflow-hidden group cursor-pointer relative border-border bg-card/50 hover:bg-card transition-colors p-0"
                  >
                    <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} className="rounded-lg" />
                    <div className="relative aspect-video bg-muted w-full h-full" onClick={() => handleImageClick(idx)}>
                      <Image
                        src={screenshot}
                        alt={`${project.name} screenshot ${idx + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-black/90 rounded-full p-3 border border-primary-500/50">
                          <ChevronRight className="w-5 h-5 text-primary-400" />
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </BlurFade>

          {/* Call to Action */}
          <BlurFade delay={0.8}>
            <Card className="p-8 bg-card/50 border-border relative overflow-hidden">
              <BorderBeam duration={10} size={150} colorFrom="#A07CFE" colorTo="#FE8FB5" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Ready to explore {project.name}?</h3>
                  <p className="text-muted-foreground">Visit our website or download the app to get started.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {project.websiteUrl && (
                    <ShimmerButton
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                      shimmerColor="#ffffff"
                      background="hsl(var(--primary))"
                    >
                      <a href={project.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <span>Visit Website</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </ShimmerButton>
                  )}
                  {project.appStoreUrl && (
                    <Button asChild variant="outline" size="lg" className="border-border">
                      <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span>App Store</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                  {project.playStoreUrl && (
                    <Button asChild variant="outline" size="lg" className="border-border">
                      <a href={project.playStoreUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        <span>Play Store</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </BlurFade>
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={project.screenshots}
        initialIndex={selectedImageIndex}
        projectName={project.name}
      />
    </>
  );
}

