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
        title: "Workflow Automation",
        description: "Streamline business processes with custom n8n workflows and AI integration.",
        icon: Bot,
    },
    {
        title: "Web Development",
        description: "Build high-performance, responsive web applications using Next.js and React.",
        icon: Globe,
    },
    {
        title: "DevOps & Infrastructure",
        description: "Automate deployment pipelines and manage cloud infrastructure with Terraform.",
        icon: Terminal,
    },
    {
        title: "UI/UX Implementation",
        description: "Translate designs into pixel-perfect, accessible, and interactive interfaces.",
        icon: LayoutTemplate,
    },
    {
        title: "Backend Systems",
        description: "Design robust APIs and database architectures for scalable applications.",
        icon: Database,
    },
    {
        title: "Custom Scripting",
        description: "Develop specialized scripts to solve unique technical challenges.",
        icon: Code2,
    },
]

export function Services() {
    return (
        <section id="services" className="py-20 md:py-32">
            <div className="container px-4 md:px-6">
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
