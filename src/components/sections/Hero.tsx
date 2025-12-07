"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { ArrowRight, Sparkles, Box, Network } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { BackgroundAnimations } from "@/components/ui/background-animations"
import { TiltPermissionButton } from "@/components/ui/TiltPermissionButton"
import { useDeviceTilt } from "@/hooks/useDeviceTilt"

type AnimationType = "classic" | "construct" | "cityflight"

export function Hero() {
    const t = useTranslations('hero')
    const [animationType, setAnimationType] = React.useState<AnimationType>("classic")

    // Get device tilt data for permission button and debug panel
    const tiltData = useDeviceTilt()
    const { needsPermission, requestPermission, isIOS, isMobile } = tiltData

    return (
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden py-20 md:py-32">
            <BackgroundAnimations type={animationType} tiltData={tiltData} />

            {/* Show permission button only on iOS when permission is needed */}
            {isIOS && needsPermission && (
                <TiltPermissionButton
                    isVisible={true}
                    onRequestPermission={requestPermission}
                />
            )}

            <div className="container px-4 md:px-6 relative z-10 pointer-events-none">
                <div className="flex flex-col items-center text-center space-y-8 pointer-events-auto">

                    {/* Animation Controls */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap justify-center gap-2 p-2 rounded-full bg-background/50 backdrop-blur-sm border mb-4"
                    >
                        <Button
                            variant={animationType === "classic" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setAnimationType("classic")}
                            className="text-xs"
                        >
                            <Sparkles className="mr-1 h-3 w-3" />
                            {t('classic')}
                        </Button>
                        <Button
                            variant={animationType === "cityflight" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setAnimationType("cityflight")}
                            className="text-xs"
                        >
                            <Network className="mr-1 h-3 w-3" />
                            {t('cityflight')}
                        </Button>
                        <Button
                            variant={animationType === "construct" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setAnimationType("construct")}
                            className="text-xs"
                        >
                            <Box className="mr-1 h-3 w-3" />
                            {t('construct')}
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 drop-shadow-lg">
                            {t('title')} <br className="hidden sm:inline" />
                            <span className="text-primary drop-shadow-md">{t('titleHighlight')}</span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl drop-shadow-md">
                            {t('description')}
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button size="lg" className="h-12 px-8" asChild>
                            <Link href="#projects">
                                {t('viewProjects')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                            <Link href="#contact">
                                {t('contactMe')}
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
