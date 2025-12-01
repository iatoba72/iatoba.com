"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const expertise = [
    {
        category: "Self‑Hosted AI & LLM Operations",
        skills: [
            "Running LLMs locally with vLLM and OpenWebUI",
            "ComfyUI for visual/AI workflows",
            "Containerizing AI services with Docker",
            "Integrating AI into APIs and n8n"
        ]
    },
    {
        category: "Home Lab & Infrastructure",
        skills: [
            "Homelab management for AI workloads",
            "Reverse proxies (nginx) and SSL",
            "Cloudflare DNS, security, and tunneling",
            "Windows Server, AD, DNS, DHCP foundation"
        ]
    },
    {
        category: "Web Development",
        skills: [
            "React and Next.js (SPA, SSR, ISR)",
            "Three.js for 3D interactive experiences",
            "API‑driven architectures and integrations",
            "Responsive, SEO‑friendly dashboards"
        ]
    },
    {
        category: "Data & Databases",
        skills: [
            "PostgreSQL and MongoDB",
            "Schema design and query optimization",
            "MySQL and SQL Server experience"
        ]
    },
    {
        category: "Automation & Integrations",
        skills: [
            "Multi-tool automations via APIs/webhooks",
            "n8n orchestration for services and AI",
            "Custom automation flows for data sync"
        ]
    },
    {
        category: "DevOps & Delivery",
        skills: [
            "Docker for apps, DBs, and AI tools",
            "Azure DevOps pipelines (CI/CD)",
            "Deployments behind nginx and Cloudflare"
        ]
    },
    {
        category: "Testing & Quality",
        skills: [
            "CodeceptJS for E2E testing",
            "CI/CD test integration",
            "Reliable release pipelines"
        ]
    },
    {
        category: "Communication",
        skills: [
            "Native Spanish, Professional English",
            "Customer relationships and community management",
            "Connecting technical work with user needs"
        ]
    }
]

export function About() {
    return (
        <section id="about" className="py-20 md:py-32 bg-muted/30">
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 items-start">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            About Me
                        </h2>
                        <div className="space-y-4 text-muted-foreground md:text-lg">
                            <p>
                                I’m Tomás Ian Barriopedro, an Argentinian Computer Engineer (Ingeniería Informática, Universidad de Belgrano) who lives at the intersection of infrastructure, web development, automation, and AI.
                            </p>
                            <p>
                                I started my career in IT infrastructure and support, working with Windows Server, Active Directory, DNS/DHCP, corporate servers, and user support in on‑prem environments. From there, I moved into webmastering and online marketing, managing MySQL, HTML, ad servers, and social media for large news portals.
                            </p>
                            <p>
                                Over the years, my focus evolved from “keeping systems running” to designing and building the systems themselves—websites, APIs, automations, and more recently, self‑hosted AI stacks.
                            </p>
                            <p>
                                Today, my work is centered around full‑stack web development, 3D experiences, databases, workflow automation, self‑hosted AI, and DevOps. I like thinking in terms of systems and flows: how data moves, how services talk to each other, and how to turn a manual process into a reliable, automated pipeline.
                            </p>
                        </div>
                        <div className="pt-6">
                            <Button size="lg" variant="default">
                                Download Resume
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        <h3 className="text-2xl font-bold tracking-tight">Expertise</h3>
                        <div className="grid gap-4 sm:grid-cols-2 items-start">
                            {expertise.map((item, index) => (
                                <Card key={index} className="border-muted-foreground/20 py-2 gap-0 h-fit">
                                    <CardHeader className="px-3 py-1.5">
                                        <CardTitle className="text-base font-bold leading-tight">{item.category}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="px-3 pb-2 pt-0">
                                        <ul className="space-y-0.5">
                                            {item.skills.map((skill, i) => (
                                                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 leading-snug">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                                    {skill}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                </div >
            </div >
        </section >
    )
}
