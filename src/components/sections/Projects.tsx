"use client"

import * as React from "react"
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
        title: "AI Workflow Automation",
        description: "A complex n8n workflow that automates customer support ticket classification using OpenAI's GPT-4.",
        tags: ["n8n", "OpenAI", "Python", "Webhook"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "Automation",
    },
    {
        id: 2,
        title: "E-commerce Dashboard",
        description: "Real-time analytics dashboard for e-commerce stores built with Next.js and Tremor.",
        tags: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "Web App",
    },
    {
        id: 3,
        title: "Infrastructure as Code",
        description: "Complete Terraform setup for deploying a scalable microservices architecture on AWS.",
        tags: ["Terraform", "AWS", "Docker", "CI/CD"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "DevOps",
    },
    {
        id: 4,
        title: "Smart Home Hub",
        description: "IoT dashboard for managing smart home devices with automated routines and energy monitoring.",
        tags: ["React", "Node.js", "MQTT", "InfluxDB"],
        links: {
            demo: "#",
            github: "#",
        },
        category: "IoT",
    },
]

const categories = ["All", "Automation", "Web App", "DevOps", "IoT"]

export function Projects() {
    const [activeCategory, setActiveCategory] = React.useState("All")

    const filteredProjects = projects.filter(
        (project) => activeCategory === "All" || project.category === activeCategory
    )

    return (
        <section id="projects" className="py-20 md:py-32 bg-muted/30">
            <div className="container px-4 md:px-6">
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
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:scale-105 transition-transform duration-500" />
                                    {/* Placeholder for project image */}
                                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-medium">
                                        Project Image
                                    </div>
                                </div>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl">{project.title}</CardTitle>
                                        <Badge variant="secondary">{project.category}</Badge>
                                    </div>
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
                                <CardFooter className="flex gap-2 pt-4">
                                    <Button variant="outline" size="sm" className="w-full" asChild>
                                        <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                                            <Github className="mr-2 h-4 w-4" />
                                            Code
                                        </a>
                                    </Button>
                                    <Button size="sm" className="w-full" asChild>
                                        <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="mr-2 h-4 w-4" />
                                            Demo
                                        </a>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
