"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const skills = [
    "Next.js & React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Python",
    "Docker & Kubernetes",
    "AWS & Cloudflare",
    "CI/CD Pipelines",
]

export function About() {
    return (
        <section id="about" className="py-20 md:py-32 bg-muted/30">
            <div className="container px-4 md:px-6">
                <div className="grid gap-12 lg:grid-cols-2 items-center">
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
                        <p className="text-muted-foreground md:text-lg">
                            I am a passionate Full Stack Developer and Automation Specialist with a focus on building efficient, scalable, and user-friendly digital solutions.
                        </p>
                        <p className="text-muted-foreground md:text-lg">
                            With years of experience in the tech industry, I help businesses optimize their workflows and establish a strong online presence through modern web technologies and intelligent automation.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
                            {skills.map((skill, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span className="font-medium">{skill}</span>
                                </div>
                            ))}
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
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="relative aspect-square lg:aspect-[4/3] overflow-hidden rounded-2xl bg-muted"
                    >
                        {/* Placeholder for profile image */}
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-medium bg-gradient-to-br from-primary/5 to-secondary/5">
                            Profile Image
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
