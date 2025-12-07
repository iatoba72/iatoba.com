"use client"

import * as React from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
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

// Mock data for projects
const projects = [
    {
        id: 1,
        title: "Self‑Hosted AI Lab & Automation Hub",
        description: "A self-hosted AI lab to run multiple LLMs and AI tools locally, orchestrated with Docker and n8n.",
        altText: "Self-hosted AI lab dashboard showing Docker containers running vLLM and OpenWebUI with n8n automation workflows",
        tags: ["Docker", "vLLM", "OpenWebUI", "n8n"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "AI & DevOps",
    },
    {
        id: 2,
        title: "Full‑Stack Portfolio & 3D Landing",
        description: "A personal portfolio site showcasing modern stack capabilities with interactive 3D elements.",
        altText: "Modern portfolio website with interactive 3D elements built using Next.js, Three.js, and React",
        tags: ["Next.js", "Three.js", "Docker", "Nginx"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "Web & 3D",
    },
    {
        id: 3,
        title: "Interactive 3D Product Configurator",
        description: "A real-time 3D configurator allowing users to customize products with instant visual feedback.",
        altText: "Interactive 3D product configurator built with Three.js and React Three Fiber showing real-time product customization",
        tags: ["Three.js", "React Three Fiber", "WebGL", "Zustand"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "Web & 3D",
    },
    {
        id: 4,
        title: "E2E Testing Framework",
        description: "A CodeceptJS-based end-to-end testing framework integrated into CI/CD pipelines.",
        altText: "End-to-end testing framework dashboard showing CodeceptJS tests integrated with Azure DevOps CI/CD pipeline",
        tags: ["CodeceptJS", "CI/CD", "Azure DevOps", "QA"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "QA & Testing",
    },
    {
        id: 5,
        title: "Secure Hybrid Cloud Gateway",
        description: "A secure access gateway bridging on-premise legacy systems with modern cloud applications using zero-trust principles.",
        altText: "Secure hybrid cloud gateway architecture diagram showing Docker, Nginx, OAuth2, and WireGuard integration",
        tags: ["Docker", "Nginx", "OAuth2", "WireGuard"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "DevOps & IoT",
    },
    {
        id: 6,
        title: "Homelab Monitoring Dashboard",
        description: "A centralized dashboard to monitor health and metrics of self-hosted AI and automation services.",
        altText: "Grafana homelab monitoring dashboard displaying Prometheus metrics for self-hosted AI and Docker services",
        tags: ["Grafana", "Prometheus", "Docker", "React"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "DevOps & IoT",
    },
]

const categories = ["All", "AI & DevOps", "Web & 3D", "Automation", "QA & Testing", "Web & DevOps", "DevOps & IoT"]

export function Projects() {
    const [activeCategory, setActiveCategory] = React.useState("All")

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
                            Featured Projects
                        </h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground mt-4 md:text-lg">
                            A selection of my recent work in automation, web development, and infrastructure.
                        </p>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-2 mt-8">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={activeCategory === category ? "default" : "outline"}
                                onClick={() => setActiveCategory(category)}
                                className="rounded-full"
                            >
                                {category}
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
                                            alt={project.altText}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 2 ? (
                                        <Image
                                            src="/portfolio-3d-landing.png"
                                            alt={project.altText}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 3 ? (
                                        <Image
                                            src="/3d-product-configurator.jpg"
                                            alt={project.altText}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 4 ? (
                                        <Image
                                            src="/e2e-testing-framework.jpg"
                                            alt={project.altText}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 5 ? (
                                        <Image
                                            src="/secure-hybrid-cloud-gateway.jpg"
                                            alt={project.altText}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : project.id === 6 ? (
                                        <Image
                                            src="/homelab-monitoring-dashboard.jpg"
                                            alt={project.altText}
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
                                    <CardTitle className="text-xl">{project.title}</CardTitle>
                                    <CardDescription className="line-clamp-2">
                                        {project.description}
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
