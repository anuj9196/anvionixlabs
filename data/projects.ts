import { Icons } from "@/components/icons";

export interface TechItem {
  id: string | number;
  icon?: React.ReactElement;
  label?: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  type: 'web' | 'mobile';
  websiteUrl?: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
  screenshots: string[];
  tags: string[];
  featured?: boolean;
  techStack: TechItem[];
}

export const projects: Project[] = [
  {
    id: 'tapbeep',
    name: 'TapBeep',
    description: 'A revolutionary platform for seamless communication and collaboration.',
    type: 'web',
    websiteUrl: 'https://tapbeep.com',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&h=800&fit=crop',
    ],
    tags: ['Web App', 'Communication', 'SaaS'],
    featured: true,
    techStack: [
      {
        id: 'react',
        label: 'React',
        icon: Icons.react({ className: "size-4" }),
      },
      {
        id: 'angular',
        label: 'Angular',
        icon: Icons.angular({ className: "size-4" }),
      },
      {
        id: 'postgresql',
        label: 'PostgreSQL',
        icon: Icons.postgresql({ className: "size-4" }),
      },
      {
        id: 'mongodb',
        label: 'MongoDB',
        icon: Icons.mongodb({ className: "size-4" }),
      },
    ],
  },
  {
    id: 'tapxreality',
    name: 'TapXR',
    description: 'Immersive augmented and virtual reality experiences for businesses and consumers.',
    type: 'web',
    websiteUrl: 'https://tapxreality.com',
    screenshots: [
      'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1200&h=800&fit=crop',
    ],
    tags: ['AR/VR', 'Immersive Tech', 'Web App'],
    featured: true,
    techStack: [
      {
        id: 'react',
        label: 'React',
        icon: Icons.react({ className: "size-4" }),
      },
      {
        id: 'nextjs',
        label: 'Next.js',
        icon: Icons.nextjs({ className: "size-4" }),
      },
      {
        id: 'neo4j',
        label: 'Neo4j',
        icon: Icons.neo4j({ className: "size-4" }),
      },
    ]
  },
  {
    id: 'tapxtool',
    name: 'TapXTool',
    description: 'Powerful productivity tools and utilities for modern professionals.',
    type: 'web',
    websiteUrl: 'https://tapxtool.com',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
    ],
    tags: ['Productivity', 'Tools', 'Web App'],
    featured: true,
    techStack: [
      {
        id: 'react',
        label: 'React',
        icon: Icons.react({ className: "size-4" }),
      },
      {
        id: 'nextjs',
        label: 'Next.js',
        icon: Icons.nextjs({ className: "size-4" }),
      },
      {
        id: 'postgresql',
        label: 'PostgreSQL',
        icon: Icons.postgresql({ className: "size-4" }),
      },
    ],
  },
  {
    id: 'originor',
    name: 'Originor',
    description: 'Creative platform for designers and creators to showcase their work.',
    type: 'web',
    websiteUrl: 'https://originor.com',
    screenshots: [
      'https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&h=800&fit=crop',
    ],
    tags: ['Creative', 'Portfolio', 'Web App'],
    featured: true,
    techStack: [
      {
        id: 'react',
        label: 'React',
        icon: Icons.react({ className: "size-4" }),
      },
      {
        id: 'nextjs',
        label: 'Next.js',
        icon: Icons.nextjs({ className: "size-4" }),
      },
      {
        id: 'postgresql',
        label: 'PostgreSQL',
        icon: Icons.postgresql({ className: "size-4" }),
      },
    ],
  },
  {
    id: 'mobile-app-1',
    name: 'Mobile App 1',
    description: 'Innovative mobile application for iOS and Android platforms.',
    type: 'mobile',
    appStoreUrl: 'https://apps.apple.com',
    playStoreUrl: 'https://play.google.com',
    screenshots: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=1200&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=1200&fit=crop',
    ],
    tags: ['Mobile', 'iOS', 'Android'],
    techStack: [
      {
        id: 'flutter',
        label: 'Flutter',
        icon: Icons.flutter({ className: "size-4" }),
      },
      {
        id: 'dart',
        label: 'Dart',
        icon: Icons.dart({ className: "size-4" }),
      },
      {
        id: 'android',
        label: 'Android',
        icon: Icons.android({ className: "size-4" }),
      },
      {
        id: 'ios',
        label: 'iOS',
        icon: Icons.apple({ className: "size-4" }),
      },
    ],
  },
];


