import { Metadata } from "next";
import { DATA } from "@/data/resume";
import { PortfolioContent } from "./portfolio-content";

// Calculate years of experience dynamically for metadata
const calculateExperienceYears = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 2017;
  return currentYear - startYear;
};

export const metadata: Metadata = {
  title: DATA.name,
  description: `Senior Engineering Team Lead with ${calculateExperienceYears()}+ years of experience in building and scaling SaaS and mobile applications.`,
};

export default function Page() {
  return <PortfolioContent />;
}
