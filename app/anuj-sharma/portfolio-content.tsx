"use client";

import { HackathonCard } from "@/components/portfolio/hackathon-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { BlurFadeText } from "@/components/ui/blur-fade-text";
import { ProjectCard } from "@/components/project-card";
import { ResumeCard } from "@/components/portfolio/resume-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { MagicCard } from "@/components/ui/magic-card";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import { HighlightKeywords } from "@/lib/highlight-keywords";
import { Download, CheckCheckIcon, CodeIcon } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { ExperienceCard } from "@/components/portfolio/experience-card";
import { Highlighter } from "@/components/ui/highlighter";
import { useTheme } from "next-themes";

const BLUR_FADE_DELAY = 0.04;

// Calculate years of experience dynamically
const calculateExperienceYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2017; // Based on work experience start date
  return currentYear - startYear;
};

export function PortfolioContent() {
  const experienceYears = calculateExperienceYears();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col min-h-[100dvh] space-y-10 px-4 py-10 md:px-6">
      <section id="hero">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-2 flex justify-between">
            <div className="flex-col flex flex-1 space-y-1.5">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]} 👋`}
              />
              <div className="max-w-[600px] md:text-xl">
                <BlurFade delay={BLUR_FADE_DELAY}>
                  {DATA.description.split("Senior Engineering Team Lead").map((part, index, array) => {
                    // Create dynamic years text pattern
                    const yearsPattern = new RegExp(`(${experienceYears}\\+ years)`, 'g');
                    const parts = part.split(yearsPattern);
                    return (
                      <span key={index}>
                        {parts.map((subPart, subIndex) => {
                          if (subPart === `${experienceYears}+ years`) {
                            return (
                              <Highlighter 
                                key={subIndex} 
                                action="highlight" 
                                color="#3b82f6"
                              >
                                {subPart}
                              </Highlighter>
                            );
                          }
                          return <span key={subIndex}>{subPart}</span>;
                        })}
                        {index < array.length - 1 && (
                          <Highlighter 
                            action="underline" 
                            color="#fbbf24"
                          >
                            Senior Engineering Team Lead
                          </Highlighter>
                        )}
                      </span>
                    );
                  })}
                </BlurFade>
              </div>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY}>
              <Avatar className="size-28 border">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="experience">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <div className="flex items-center justify-center gap-4">
              <ExperienceCard 
                value={experienceYears} 
                label="Year Experience" 
                icon={<CheckCheckIcon className="size-3" />}
                showPlus={true}
              />
              <ExperienceCard 
                value={(DATA.personalProjects?.length || 0) + (DATA.projects?.length || 0)} 
                label="Projects Built" 
                icon={<CodeIcon className="size-3" />}
                showPlus={true}
              />
            </div>
          </BlurFade>
        </div>
      </section>
      <section id="about">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <BlurFade delay={BLUR_FADE_DELAY * 3}>
            <h2 className="text-xl font-bold">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4}>
            <div className="prose max-w-full text-pretty font-sans text-sm text-muted-foreground dark:prose-invert">
              <Markdown>{DATA.summary}</Markdown>
            </div>
          </BlurFade>
        </div>
      </section>
      <section id="work">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 5}>
              <h2 className="text-xl font-bold">Work Experience</h2>
            </BlurFade>
            {DATA.work.map((work, id) => (
              <BlurFade
                key={work.company}
                delay={BLUR_FADE_DELAY * 6 + id * 0.05}
              >
                <ResumeCard
                  key={work.company}
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={work.title}
                  href={work.href}
                  badges={work.badges}
                  period={`${work.start} - ${work.end ?? "Present"}`}
                  description={work.description}
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="education">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-xl font-bold">Education</h2>
            </BlurFade>
            {DATA.education.map((education, id) => (
              <BlurFade
                key={education.school}
                delay={BLUR_FADE_DELAY * 8 + id * 0.05}
              >
                <ResumeCard
                  key={education.school}
                  href={(education as any).website || education.href}
                  logoUrl={education.logoUrl}
                  altText={education.school}
                  title={education.school}
                  subtitle={education.degree}
                  period={`${education.start} - ${education.end}`}
                  gpa={education.gpa}
                  gpaLabel={education.gpaLabel}
                />
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="skills">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="flex min-h-0 flex-col gap-y-6">
            <BlurFade delay={BLUR_FADE_DELAY * 9}>
              <h2 className="text-xl font-bold">Skills</h2>
            </BlurFade>
            {Object.entries(DATA.skills).map(([category, skills], categoryId) => (
              <BlurFade
                key={category}
                delay={BLUR_FADE_DELAY * 10 + categoryId * 0.05}
              >
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {category}
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill, skillId) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="achievements">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="flex min-h-0 flex-col gap-y-3">
            <BlurFade delay={BLUR_FADE_DELAY * 10.5}>
              <h2 className="text-xl font-bold">Achievements</h2>
            </BlurFade>
            {DATA.achievements.map((achievement, id) => (
              <BlurFade
                key={achievement.title}
                delay={BLUR_FADE_DELAY * 11 + id * 0.05}
              >
                <MagicCard gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-2xl flex-shrink-0">
                      {achievement.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-base leading-none">
                        {achievement.title}
                      </h3>
                      {achievement.description && (
                        <p className="mt-1 text-sm text-muted-foreground">
                          {achievement.description}
                        </p>
                      )}
                    </div>
                  </div>
                </MagicCard>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="projects">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="space-y-12 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 11}>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                    My Projects
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    Check out my latest work
                  </h2>
                  <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    I&apos;ve worked on a variety of projects, from simple
                    websites to complex web applications. Here are a few of my
                    favorites.
                  </p>
                </div>
              </div>
            </BlurFade>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-[800px] mx-auto">
              {DATA.projects.map((resumeProject, id) => {
                // Transform resume project to Project type
                const project = {
                  id: resumeProject.title.toLowerCase().replace(/\s+/g, '-'),
                  name: resumeProject.title,
                  description: resumeProject.description,
                  type: 'web' as const,
                  websiteUrl: resumeProject.href,
                  screenshots: resumeProject.image
                    ? [resumeProject.image]
                    : resumeProject.video
                      ? [resumeProject.video]
                      : [],
                  tags: [...(resumeProject.technologies || [])],
                };

                return (
                  <BlurFade
                    key={resumeProject.title}
                    delay={BLUR_FADE_DELAY * 12 + id * 0.05}
                  >
                    <ProjectCard
                      project={project}
                      index={id}
                    />
                  </BlurFade>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section id="hackathons">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="space-y-12 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 13}>
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                    Personal Projects
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                    I like building things
                  </h2>
                  <p className="text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    I&apos;ve built various projects ranging from SaaS platforms to mobile applications.
                    These projects showcase my passion for creating innovative solutions and solving real-world problems.
                  </p>
                </div>
              </div>
            </BlurFade>

            {/* Personal Projects */}
            {DATA.personalProjects && DATA.personalProjects.length > 0 && (
              <BlurFade delay={BLUR_FADE_DELAY * 14}>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Personal Projects</h3>
                  <ul className="mb-4 ml-4 divide-y divide-dashed border-l">
                    {DATA.personalProjects.map((project, id) => (
                      <BlurFade
                        key={project.title}
                        delay={BLUR_FADE_DELAY * 14.5 + id * 0.05}
                      >
                        <HackathonCard
                          title={project.title}
                          description={project.description}
                          location={project.location}
                          dates={project.dates}
                          image={project.image}
                          href={project.href}
                          tags={project.tags}
                          links={project.links}
                        />
                      </BlurFade>
                    ))}
                  </ul>
                </div>
              </BlurFade>
            )}
          </div>
        </div>
      </section>
      <section id="contact">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="grid items-center justify-center gap-4 px-4 text-center md:px-6 w-full py-12">
            <BlurFade delay={BLUR_FADE_DELAY * 16}>
              <div className="space-y-3">
                <div className="inline-block rounded-lg bg-foreground text-background px-3 py-1 text-sm">
                  Contact
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Get in Touch
                </h2>
                <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Want to chat? Feel free to reach out via{" "}
                  <Link
                    href={DATA.contact.social.email.url}
                    className="text-blue-500 hover:underline"
                  >
                    email
                  </Link>{" "}
                  or{" "}
                  <Link
                    href={DATA.contact.social.LinkedIn.url}
                    className="text-blue-500 hover:underline"
                  >
                    LinkedIn
                  </Link>
                  . I&apos;ll respond whenever I can.
                </p>
                <div className="pt-4">
                  <Button
                    asChild
                    variant="outline"
                    className="gap-2"
                  >
                    <a
                      href="/files/AnujSharmaResume.pdf"
                      download="AnujSharmaResume.pdf"
                      className="relative"
                    >
                      <Download className="size-4" />
                      Download Resume

                      <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
                    </a>
                  </Button>
                </div>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>
    </div>
  );
}

