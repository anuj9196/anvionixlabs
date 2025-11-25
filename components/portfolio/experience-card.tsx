"use client";
import { Badge } from "../ui/badge";
import { Meteors } from "../ui/meteors";
import { CheckCheckIcon, CodeIcon, UsersIcon, BriefcaseIcon, TrophyIcon, RocketIcon } from "lucide-react";
import { ShineBorder } from "../ui/shine-border";
import { BorderBeam } from "../ui/border-beam";
import { useState } from "react";
import { NumberTicker } from "../ui/number-ticker";

interface ExperienceCardProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  showPlus?: boolean;
}

export function ExperienceCard({ 
  value, 
  label, 
  icon = <CheckCheckIcon className="size-3" />,
  showPlus = false 
}: ExperienceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex h-[100px] w-full flex-col items-center justify-center overflow-hidden rounded-lg border" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      {isHovered ? (
        <ShineBorder shineColor={["#A07CFE", "#FE8FB5", "#FFBE7B"]} />
      ) : (
        <BorderBeam duration={8} size={100} colorFrom="#A07CFE" colorTo="#FE8FB5" />
      )}
      <Meteors number={30} />
      <span className="pointer-events-none bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-center text-3xl leading-none font-semibold whitespace-pre-wrap text-transparent dark:from-white dark:to-slate-900/10 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center">
          <NumberTicker value={value} className="bg-gradient-to-b from-black to-gray-300/80 bg-clip-text text-transparent dark:from-white dark:to-slate-900/10" />
          {showPlus && "+"}
        </div>

        <Badge variant="default" className="gap-1">
          {icon}
          {label}
        </Badge>
      </span>
    </div>
  )
}
