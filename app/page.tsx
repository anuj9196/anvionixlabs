import {SectionTitle} from "@/components/section-title";
import { projects } from "@/data/projects";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/project-card";

export default function Home() {

  const featuredProjects = projects.filter((project) => project.featured);
  const otherProjects = projects.filter((project) => !project.featured);

  return (
    <div className="relative">
      <Hero /> 
      
      {/* Projects Section */}
      <section id="projects" className="relative py-20">
        {/* Matte texture overlay */}
        <div className="absolute inset-0 opacity-20 dark:opacity-20" style={{
          backgroundImage: 
            'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.02) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="absolute inset-0 opacity-20 dark:hidden" style={{
          backgroundImage: 
            'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <SectionTitle className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Projects
            </SectionTitle>
            <SectionTitle className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our innovative web and mobile applications that are transforming digital experiences
            </SectionTitle>
          </div>

          {/* Featured Projects */}
          {featuredProjects.length > 0 && (
            <div className="mb-16">
              <SectionTitle className="text-2xl font-semibold text-foreground mb-8">
                Featured
              </SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
                {featuredProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Other Projects */}
          {otherProjects.length > 0 && (
            <div>
              <SectionTitle className="text-2xl font-semibold text-foreground mb-8">
                More Projects
              </SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {otherProjects.map((project, index) => (
                  <ProjectCard key={project.id} project={project} index={index} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
