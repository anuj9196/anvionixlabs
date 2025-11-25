'use client';

import Link from 'next/link';
import { AuroraText } from '@/components/ui/aurora-text';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { MorphingText } from '@/components/ui/morphing-text';
import { Sparkle } from 'lucide-react';
import { SparklesText } from './ui/sparkles-text';
import { ShimmerButton } from './ui/shimmer-button';

export function Hero() {
    const morphingTexts = [
        'Building the future',
        'Creating innovation',
        'Transforming experiences',
        'Empowering businesses',
    ];

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full">

            {/* Content */}
            <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center w-full">

                <SparklesText sparklesCount={5}>
                    <div className="inline-flex items-center justify-center rounded-full border border-border px-4 py-1.5 backdrop-blur-sm gap-2">

                        <Sparkle className="w-3 h-3 text-primary" />
                        <AnimatedGradientText speed={2} className="text-xs font-semibold">
                            Innovation at Scale
                        </AnimatedGradientText>

                    </div>
                </SparklesText>

                <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold">
                    <AuroraText className="block text-6xl md:text-8xl lg:text-9xl">
                        Anvionix Labs
                    </AuroraText>
                </h1>

                <MorphingText
                    texts={morphingTexts}
                    className="text-muted-foreground w-full text-2xl lg:text-[2.5rem] mt-4 md:h-15"
                />

                <p className="text-lg md:text-xl text-muted-foreground mx-auto">
                    of digital experiences through innovative web and mobile applications
                </p>

                <div className="flex items-center justify-center gap-2 mt-8">
                    <ShimmerButton className="shadow-2xl">
                        {/* <Link href="#projects" className="relative z-10"> */}
                        {/* <BorderBeam size={250} duration={12} colorFrom="#3b82f6" colorTo="#8b5cf6" /> */}
                        Explore Our Projects
                        {/* </Link> */}
                    </ShimmerButton>
                </div>
            </div>
        </section>
    );
}
