'use client';

import { ExternalLink, Smartphone, Globe, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/data/projects';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShineBorder } from './ui/shine-border';
import {ImageModal} from './image-modal';

interface ProjectCardProps {
  project: Project;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleImageClick = (imageIndex: number) => {
    setSelectedImageIndex(imageIndex);
    setIsModalOpen(true);
  };

  const cardContent = (
    <div className="h-full flex flex-col m-[2px]">
      {/* Screenshot Gallery */}
      <div className="relative h-48 bg-muted rounded-lg">
        <div className="relative h-full overflow-hidden">
          <div className="flex overflow-hidden snap-x snap-mandatory scrollbar-hide h-full">
          {project.screenshots.map((screenshot, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-full h-full snap-center cursor-pointer relative group"
              onClick={() => handleImageClick(idx)}
            >
              <Image
                src={screenshot}
                alt={`${project.name} screenshot ${idx + 1}`}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300 rounded-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 rounded-lg">
                <div className="bg-black/90 rounded-full p-2 border border-primary-500/50">
                  <ChevronRight className="w-4 h-4 text-primary-400" />
                </div>
              </div>
            </div>
          ))}
          </div>
          {/* Screenshot Indicators */}
          {project.screenshots.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
              {project.screenshots.map((_, idx) => (
                <div
                  key={idx}
                  className="w-1.5 h-1.5 rounded-full bg-white/40"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-card-foreground mb-1 truncate">
              {project.name}
            </h3>
            <div className="flex items-center space-x-1.5 text-muted-foreground mb-2">
              {project.type === 'web' ? (
                <Globe className="w-3.5 h-3.5" />
              ) : (
                <Smartphone className="w-3.5 h-3.5" />
              )}
              <span className="text-xs capitalize">{project.type}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{project.description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {project.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full text-xs font-medium border border-primary-500/30"
            >
              {tag}
            </span>
          ))}
          {project.tags.length > 2 && (
            <span className="px-2 py-0.5 bg-primary-500/20 text-primary-300 rounded-full text-xs font-medium border border-primary-500/30">
              +{project.tags.length - 2}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <Button
            asChild
            variant="default"
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-xs h-8 px-3 flex-1"
          >
            <Link href={`/projects/${project.id}`}>
              <span>View Details</span>
              <ChevronRight className="w-3 h-3 ml-1.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </div>
  );

  return (
    <>
      <Card className="relative h-full w-full overflow-hidden border-border bg-card/50 p-0">
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
        {cardContent}
      </Card>
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
