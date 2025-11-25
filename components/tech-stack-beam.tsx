"use client"

import React, { forwardRef, useMemo, useRef } from "react"
import { cn } from "@/lib/utils"
import { AnimatedBeam } from "./ui/animated-beam"
import { ShimmerButton } from "./ui/shimmer-button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"

// fallback image (you uploaded this file)
// const demoIconUrl = "/mnt/data/original-c1ce1039d9254c51c10c1609746a6526.webp"

type TechItem = {
  id: string | number
  icon?: React.ReactElement
  label?: string
  imageUrl?: string // optional fallback image url
}

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex w-12 h-12 items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] text-gray-900",
        className
      )}
    >
      {children}
    </div>
  )
})
Circle.displayName = "Circle"

export function TechStackBeam({
  techs,
  centerLabel = "Tech Stack",
}: {
  techs: TechItem[]
  centerLabel?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const centerRef = useRef<HTMLDivElement>(null)

  // create refs for each tech item
  const itemRefs = useMemo(
    () => techs.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [techs.length]
  )

  // split items into two arrays (left & right) as evenly as possible
  const half = Math.ceil(techs.length / 2)
  const leftItems = techs.slice(0, half)
  const rightItems = techs.slice(half)

  return (
    <div
      className="relative flex h-[300px] w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex w-full max-w-2xl items-center justify-between gap-6">
        {/* LEFT column */}
        <div className="flex flex-col items-start justify-center gap-6">
          {leftItems.map((item, idx) => {
            const ref = itemRefs[idx]!
            return (
              <Circle key={item.id} ref={ref}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {item.icon ?? (
                        // fallback: image or demo url
                        <img
                          src={item.imageUrl}
                          alt={String(item.label ?? item.id)}
                          className="h-6 w-6 object-cover rounded"
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Circle>
            )
          })}
        </div>

        {/* CENTER hub */}
        <div className="flex flex-col items-center justify-center">
          <div ref={centerRef} className="z-20">
            <ShimmerButton
              className="shadow-2xl"
              background="linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
              shimmerColor="#ffffff"
            >
              <span className="text-center text-sm leading-none font-medium tracking-tight whitespace-pre-wrap text-white lg:text-lg">
                {centerLabel}
              </span>
            </ShimmerButton>
          </div>
        </div>

        {/* RIGHT column */}
        <div className="flex flex-col items-end justify-center gap-6">
          {rightItems.map((item, idx) => {
            // right index offset from half
            const ref = itemRefs[half + idx]!
            return (
              <Circle key={item.id} ref={ref}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      {item.icon ?? (
                        <img
                          src={item.imageUrl}
                          alt={String(item.label ?? item.id)}
                          className="h-6 w-6 object-cover rounded"
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>
                      {item.label}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </Circle>
            )
          })}
        </div>
      </div>

      {/* Beam connections: left -> center (normal), right -> center (reverse) */}
      {leftItems.map((_, idx) => {
        const fromRef = itemRefs[idx]!
        return (
          <AnimatedBeam
            key={`left-${idx}`}
            containerRef={containerRef}
            fromRef={fromRef}
            toRef={centerRef}
          />
        )
      })}

      {rightItems.map((_, idx) => {
        const fromRef = itemRefs[half + idx]!
        return (
          <AnimatedBeam
            key={`right-${idx}`}
            containerRef={containerRef}
            fromRef={fromRef}
            toRef={centerRef}
            reverse
          />
        )
      })}
    </div>
  )
}
