"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { useTranslations } from "next-intl"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function Projects() {
    const t = useTranslations('projects')
    const [activeCategory, setActiveCategory] = React.useState("All")

    // Projects data with translation keys
    const projects = [
        {
            id: 1,
            titleKey: "items.aiLab.title",
            descriptionKey: "items.aiLab.description",
            altTextKey: "items.aiLab.altText",
            tags: ["Docker", "vLLM", "OpenWebUI", "n8n"],
            links: {
                demo: "#",
                github: "#",
            },
            category: "AI & DevOps",
        },
        {
            id: 2,
            titleKey: "items.portfolio.title",
            descriptionKey: "items.portfolio.description",
            altTextKey: "items.portfolio.altText",
            tags: ["Next.js", "Three.js", "Docker", "Nginx"],
            links: {
                demo: "#",
                github: "#",
            },
            category: "Web & 3D",
        },
        {
            id: 3,
            titleKey: "items.configurator.title",
            descriptionKey: "items.configurator.description",
            altTextKey: "items.configurator.altText",
            tags: ["Three.js", "React Three Fiber", "WebGL", "Zustand"],
            links: {
                demo: "#",
                github: "#",
            },
            category: "Web & 3D",
        },
        {
            id: 4,
            titleKey: "items.testing.title",
            descriptionKey: "items.testing.description",
            altTextKey: "items.testing.altText",
            tags: ["CodeceptJS", "CI/CD", "Azure DevOps", "QA"],
            links: {
                demo: "#",
                github: "#",
            },
            category: "QA & Testing",
        },
        {
            id: 5,
            titleKey: "items.gateway.title",
            descriptionKey: "items.gateway.description",
            altTextKey: "items.gateway.altText",
            tags: ["Docker", "Nginx", "OAuth2", "WireGuard"],
            links: {
                demo: "#",
                github: "#",
            },
            category: "DevOps & IoT",
        },
        {
            id: 6,
            titleKey: "items.monitoring.title",
            descriptionKey: "items.monitoring.description",
            altTextKey: "items.monitoring.altText",
            tags: ["Grafana", "Prometheus", "Docker", "React"],
            links: {
                demo: "#",
                github: "#",
            },
            category: "DevOps & IoT",
        },
    ]

    const categories = [
        { key: "all", label: t('categories.all') },
        { key: "aiDevops", label: t('categories.aiDevops') },
        { key: "web3d", label: t('categories.web3d') },
        { key: "automation", label: t('categories.automation') },
        { key: "qaTesting", label: t('categories.qaTesting') },
        { key: "webDevops", label: t('categories.webDevops') },
        { key: "devopsIot", label: t('categories.devopsIot') },
    ]

    const filteredProjects = projects.filter(
        (project) => activeCategory === "All" || project.category === activeCategory
    )

    return (
        <section id="projects" className="py-10 md:py-16 bg-muted/30">
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            {t('title')}
                        </h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground mt-4 md:text-lg">
                            {t('subtitle')}
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {categories.map((category) => (
                            <Button
                                key={category.key}
                                variant={activeCategory === category.label ? "default" : "outline"}
                                onClick={() => setActiveCategory(category.label)}
                                className="rounded-full"
                            >
                                {category.label}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full flex flex-col overflow-hidden border-muted-foreground/10 hover:border-primary/50 transition-colors duration-300">
                                <div className="aspect-video w-full bg-muted relative overflow-hidden group">
                                    {project.id === 1 ? (
                                        <Image
                                            src="/ai-workflow-automation.jpg"
                                            alt={t(project.altTextKey)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 2 ? (
                                        <Image
                                            src="/portfolio-3d-landing.png"
                                            alt={t(project.altTextKey)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 3 ? (
                                        <Image
                                            src="/3d-product-configurator.jpg"
                                            alt={t(project.altTextKey)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 4 ? (
                                        <Image
                                            src="/e2e-testing-framework.jpg"
                                            alt={t(project.altTextKey)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 5 ? (
                                        <Image
                                            src="/secure-hybrid-cloud-gateway.jpg"
                                            alt={t(project.altTextKey)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 6 ? (
                                        <Image
                                            src="/homelab-monitoring-dashboard.jpg"
                                            alt={t(project.altTextKey)}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <>
                                            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-105 transition-transform duration-500" />
                                            {/* Placeholder for project image */}
                                            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-medium">
                                                Project Image
                                            </div>
                                        </>
                                    )}
                                </div>
                                <CardHeader>
                                    <CardTitle className="text-xl">{t(project.titleKey)}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {t(project.descriptionKey)}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <div className="flex flex-wrap gap-2">
                                        {project.tags.map((tag) => (
                                            <Badge key={tag} variant="outline" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
