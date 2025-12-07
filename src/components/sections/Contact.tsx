"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Mail, MapPin, Phone, Send, Linkedin } from "lucide-react"
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
            newErrors.firstName = 'First name is required'
        }
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required'
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email'
        }
        if (!formData.message.trim()) {
            newErrors.message = 'Message is required'
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Message must be at least 10 characters'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        // Honeypot spam check
        if (honeypot) {
            console.log('Bot detected')
            return
        }

        // Validate
        if (!validateForm()) {
            setStatus({
                type: 'error',
                message: 'Please fix the errors above',
            })
            return
        }

        setStatus({ type: 'loading' })

        try {
            // Use FormData for simpler submission
            const submitData = new FormData()
            submitData.append('access_key', process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '')
            submitData.append('name', `${formData.firstName} ${formData.lastName}`)
            submitData.append('email', formData.email)
            submitData.append('message', formData.message)
            submitData.append('from_name', `${formData.firstName} ${formData.lastName}`)
            submitData.append('subject', `New Contact Form Submission from ${formData.firstName} ${formData.lastName}`)

            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: submitData
            })

            const data = await response.json()

            if (data.success) {
                setStatus({
                    type: 'success',
                    message: "Thank you for your message! I'll get back to you soon.",
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
                    message: 'Something went wrong. Please try again or email me directly.',
                })
            }
        } catch (error) {
            setStatus({
                type: 'error',
                message: 'Failed to send message. Please check your connection and try again.',
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
                            Get in Touch
                        </h2>
                        <p className="mx-auto max-w-[700px] text-muted-foreground mt-4 md:text-lg">
                            Ready to start your next project? Contact me today for a consultation.
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
                                <CardTitle>Contact Information</CardTitle>
                                <CardDescription>
                                    Feel free to reach out through any of these channels.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Email</p>
                                        <a
                                            href="mailto:iatoba@gmail.com"
                                            className="text-muted-foreground hover:underline"
                                        >
                                            iatoba@gmail.com
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Phone</p>
                                        <a
                                            href="https://wa.me/5491153226235"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-muted-foreground hover:underline"
                                        >
                                            +54 9 11 5322 6235
                                        </a>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">Location</p>
                                        <p className="text-muted-foreground">Buenos Aires, Argentina</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Linkedin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="font-medium">LinkedIn</p>
                                        <a href="https://www.linkedin.com/in/iatoba/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:underline">
                                            linkedin.com/in/iatoba
                                        </a>
                                    </div>
                                </div>
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
                                <CardTitle>Send a Message</CardTitle>
                                <CardDescription>
                                    I'll get back to you as soon as possible.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form className="space-y-4" onSubmit={handleSubmit}>
                                    {/* Honeypot field (hidden from users) */}
                                    <input
                                        type="text"
                                        name="botcheck"
                                        value={honeypot}
                                        onChange={(e) => setHoneypot(e.target.value)}
                                        style={{ display: 'none' }}
                                        tabIndex={-1}
                                        autoComplete="off"
                                    />

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label htmlFor="firstName" className="text-sm font-medium">
                                                First name
                                            </label>
                                            <Input
                                                id="firstName"
                                                name="firstName"
                                                placeholder="John"
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
                                                Last name
                                            </label>
                                            <Input
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Doe"
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
                                            Email
                                        </label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
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
                                            Message
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            placeholder="Tell me about your project..."
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
                                                Sending...
                                                <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                            </>
                                        ) : (
                                            <>
                                                Send Message
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
