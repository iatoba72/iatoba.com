"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, Linkedin } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormData {
    firstName: string
    lastName: string
    email: string
    message: string
}

interface FormErrors {
    firstName?: string
    lastName?: string
    email?: string
    message?: string
}

interface FormStatus {
    type: 'idle' | 'loading' | 'success' | 'error'
    message?: string
}

export function Contact() {
    const t = useTranslations('contact')

    // Form state
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
    })

    const [errors, setErrors] = useState<FormErrors>({})
    const [status, setStatus] = useState<FormStatus>({ type: 'idle' })
    const [honeypot, setHoneypot] = useState('')

    // Security: Track form load time (bots submit too fast)
    const [formLoadTime] = useState(Date.now())

    // Security: Rate limiting (max submissions per session)
    const [submissionCount, setSubmissionCount] = useState(0)
    const MAX_SUBMISSIONS = 3

    // Handle input changes
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }))
        }
    }

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {}

        if (!formData.firstName.trim()) {
            newErrors.firstName = t('errors.firstNameRequired')
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = t('errors.lastNameRequired')
        }
        if (!formData.email.trim()) {
            newErrors.email = t('errors.emailRequired')
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = t('errors.emailInvalid')
        }
        if (!formData.message.trim()) {
            newErrors.message = t('errors.messageRequired')
        } else if (formData.message.trim().length < 10) {
            newErrors.message = t('errors.messageMinLength')
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission through Cloudflare Pages Function
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Security: Honeypot spam check (client-side first layer)
        if (honeypot) {
            console.log('Bot detected: honeypot filled')
            return
        }

        // Security: Time-based detection (client-side first layer)
        const timeSpent = Date.now() - formLoadTime
        if (timeSpent < 3000) {
            console.log('Bot detected: form submitted too fast', timeSpent, 'ms')
            return
        }

        // Security: Rate limiting (client-side session limit)
        if (submissionCount >= MAX_SUBMISSIONS) {
            setStatus({
                type: 'error',
                message: t('errors.tooManySubmissions'),
            })
            return
        }

        // Validate form (client-side UX)
        if (!validateForm()) {
            setStatus({
                type: 'error',
                message: 'Please fix the errors above',
            })
            return
        }

        setStatus({ type: 'loading' })

        try {
            // Submit to Cloudflare Pages Function
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    message: formData.message,
                    honeypot: honeypot,  // Pass to server for re-validation
                    formLoadTime: formLoadTime,  // Pass to server for timing check
                }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                // Increment submission count for rate limiting
                setSubmissionCount(prev => prev + 1)

                setStatus({
                    type: 'success',
                    message: t('successMessage'),
                })

                // Reset form
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    message: '',
                })
                setErrors({})
            } else {
                setStatus({
                    type: 'error',
                    message: data.message || t('errorMessage'),
                })
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: t('errorMessage'),
            })
            console.error('Form submission error:', error)
        }
    }
    return (
        <section id="contact" className="py-10 md:py-16">
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

                <div className="grid gap-8 lg:grid-cols-2">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="h-full">
                            <CardHeader>
                                <CardTitle>{t('contactInformation')}</CardTitle>
                                <CardDescription>
                                    {t('contactDescription')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <a
                                    href="mailto:iatoba@gmail.com"
                                    className="flex items-center gap-4 transition-colors hover:opacity-80 cursor-pointer"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('emailLabel')}</p>
                                        <p className="text-muted-foreground hover:underline">
                                            iatoba@gmail.com
                                        </p>
                                    </div>
                                </a>
                                <a
                                    href="https://wa.me/5491153226235"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 transition-colors hover:opacity-80 cursor-pointer"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('phoneLabel')}</p>
                                        <p className="text-muted-foreground hover:underline">
                                            +54 9 11 5322 6235
                                        </p>
                                    </div>
                                </a>
                                <a
                                    href="https://www.google.com/maps/search/?api=1&query=Buenos+Aires,+Argentina"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 transition-colors hover:opacity-80 cursor-pointer"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('locationLabel')}</p>
                                        <p className="text-muted-foreground hover:underline">Buenos Aires, Argentina</p>
                                    </div>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/iatoba/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-4 transition-colors hover:opacity-80 cursor-pointer"
                                >
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Linkedin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">{t('linkedinLabel')}</p>
                                        <p className="text-muted-foreground hover:underline">
                                            linkedin.com/in/iatoba
                                        </p>
                                    </div>
                                </a>
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle>{t('sendMessageTitle')}</CardTitle>
                                <CardDescription>
                                    {t('sendMessageDescription')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    {/* Honeypot field - hidden from users, attractive to bots */}
                                    <input
                                        type="text"
                                        name="website"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                        className="absolute -left-[9999px] opacity-0 h-0 w-0 pointer-events-none"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        aria-hidden="true"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="text-sm font-medium">
                                                {t('firstName')}
                                            </label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                placeholder={t('firstNamePlaceholder')}
                                                value={formData.firstName}
                                                onChange={handleInputChange}
                                                disabled={status.type === 'loading'}
                                                aria-invalid={!!errors.firstName}
                                                aria-describedby={errors.firstName ? "firstName-error" : undefined}
                                            />
                                            {errors.firstName && (
                                                <p id="firstName-error" className="text-sm text-destructive">
                                                    {errors.firstName}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="lastName" className="text-sm font-medium">
                                                {t('lastName')}
                                            </label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                placeholder={t('lastNamePlaceholder')}
                                                value={formData.lastName}
                                                onChange={handleInputChange}
                                                disabled={status.type === 'loading'}
                                                aria-invalid={!!errors.lastName}
                                                aria-describedby={errors.lastName ? "lastName-error" : undefined}
                                            />
                                            {errors.lastName && (
                                                <p id="lastName-error" className="text-sm text-destructive">
                                                    {errors.lastName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium">
                                            {t('email')}
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder={t('emailPlaceholder')}
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={status.type === 'loading'}
                                            aria-invalid={!!errors.email}
                                            aria-describedby={errors.email ? "email-error" : undefined}
                                        />
                                        {errors.email && (
                                            <p id="email-error" className="text-sm text-destructive">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="message" className="text-sm font-medium">
                                            {t('message')}
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder={t('messagePlaceholder')}
                                            className="min-h-[120px]"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            disabled={status.type === 'loading'}
                                            aria-invalid={!!errors.message}
                                            aria-describedby={errors.message ? "message-error" : undefined}
                                        />
                                        {errors.message && (
                                            <p id="message-error" className="text-sm text-destructive">
                                                {errors.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Status message */}
                                    {status.message && (
                                        <div
                                            className={cn(
                                                "p-3 rounded-md text-sm",
                                                status.type === 'success' && "bg-green-50 dark:bg-green-950 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800",
                                                status.type === 'error' && "bg-destructive/10 text-destructive border border-destructive/20"
                                            )}
                                            role="alert"
                                        >
                                            {status.message}
                                        </div>
                                    )}

                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={status.type === 'loading'}
                                    >
                                        {status.type === 'loading' ? (
                                            <>
                                                {t('sending')}
                                                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            </>
                                        ) : (
                                            <>
                                                {t('send')}
                                                <Send className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
