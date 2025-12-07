"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function About() {
    const t = useTranslations('about')

    const expertise = [
        {
            categoryKey: "expertise.aiLlm.category",
            skillsKey: "expertise.aiLlm.skills",
        },
        {
            categoryKey: "expertise.homeLab.category",
            skillsKey: "expertise.homeLab.skills",
        },
        {
            categoryKey: "expertise.webDev.category",
            skillsKey: "expertise.webDev.skills",
        },
        {
            categoryKey: "expertise.data.category",
            skillsKey: "expertise.data.skills",
        },
        {
            categoryKey: "expertise.automation.category",
            skillsKey: "expertise.automation.skills",
        },
        {
            categoryKey: "expertise.devops.category",
            skillsKey: "expertise.devops.skills",
        },
    ]
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
                            {t('title')}
                        </h2>
                        <p className="text-xl font-semibold text-muted-foreground">
                            {t('subtitle')}
                        </p>
                        <div className="space-y-4 text-muted-foreground md:text-lg">
                            <p>
                                {t('intro')}
                            </p>
                        </div>
                        <div className="pt-6">
                            <Button size="lg" variant="default">
                                {t('cta')}
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
                            {expertise.map((item, index) => {
                                const skills = t.raw(item.skillsKey) as string[]
                                return (
                                    <Card key={index} className="border-muted-foreground/20 py-2 gap-0 h-fit">
                                        <CardHeader className="px-3 py-1.5">
                                            <CardTitle className="text-base font-bold leading-tight">{t(item.categoryKey)}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-3 pb-2 pt-0">
                                            <ul className="space-y-0.5">
                                                {skills.map((skill, i) => (
                                                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 leading-snug">
                                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                                                        {skill}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </motion.div>
                </div >
            </div >
        </section >
    )
}
