"use client"

import { motion } from "framer-motion"
import { Bot, Code2, Database, Globe, LayoutTemplate, Terminal } from "lucide-react"
import { useTranslations } from "next-intl"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export function Services() {
    const t = useTranslations('services')

    const services = [
        {
            titleKey: "items.fullstack.title",
            descriptionKey: "items.fullstack.description",
            icon: Globe,
        },
        {
            titleKey: "items.api.title",
            descriptionKey: "items.api.description",
            icon: Database,
        },
        {
            titleKey: "items.automation.title",
            descriptionKey: "items.automation.description",
            icon: Bot,
        },
        {
            titleKey: "items.ai.title",
            descriptionKey: "items.ai.description",
            icon: Code2,
        },
        {
            titleKey: "items.devops.title",
            descriptionKey: "items.devops.description",
            icon: Terminal,
        },
        {
            titleKey: "items.testing.title",
            descriptionKey: "items.testing.description",
            icon: LayoutTemplate,
        },
    ]

    return (
        <section id="services" className="py-10 md:py-16">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={service.titleKey}
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
                                    <CardTitle className="text-xl">{t(service.titleKey)}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-base">
                                        {t(service.descriptionKey)}
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
