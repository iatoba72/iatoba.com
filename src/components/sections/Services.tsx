"use client"

import { motion } from "framer-motion"
import { Bot, Code2, Database, Globe, LayoutTemplate, Terminal } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

const services = [
    {
        title: "Full‑Stack Web & 3D Experiences",
        description: "Modern web apps with React/Next.js and interactive 3D elements using Three.js.",
        icon: Globe,
    },
    {
        title: "API Design & Backend Logic",
        description: "Clean RESTful APIs and integrations with third-party services (Auth, Payments, CRM).",
        icon: Database,
    },
    {
        title: "Workflow Automation",
        description: "Robust automations with n8n and custom scripts to connect tools and move data.",
        icon: Bot,
    },
    {
        title: "Self‑Hosted AI & Local LLMs",
        description: "Local LLM deployment (vLLM, OpenWebUI) and Dockerized AI services exposed securely.",
        icon: Code2,
    },
    {
        title: "DevOps, CI/CD & Infrastructure",
        description: "Dockerized apps, Azure DevOps pipelines, and Nginx/Cloudflare routing.",
        icon: Terminal,
    },
    {
        title: "E2E Testing & QA Automation",
        description: "Automated CodeceptJS test suites integrated into CI/CD for reliable releases.",
        icon: LayoutTemplate,
    },
]

export function Services() {
    return (
        <section id="services" className="py-20 md:py-32">
            <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                            Services & Expertise
                        </h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground mt-4 md:text-lg">
                            Comprehensive technical solutions tailored to your business needs.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card className="h-full border-muted-foreground/10 hover:border-primary/50 transition-colors duration-300">
                                <CardHeader>
                                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                        <service.icon className="h-6 w-6" />
                                    </div>
                                    <CardTitle className="text-xl">{service.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {service.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
