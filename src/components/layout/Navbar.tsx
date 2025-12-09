"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AnimatePresence } from "framer-motion"
import { MobileMenuCard } from "./MobileMenuCard"

export function Navbar() {
    const t = useTranslations('navbar')
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)

    const navigation = [
        { name: t('projects'), href: "#projects" },
        { name: t('services'), href: "#services" },
        { name: t('about'), href: "#about" },
        { name: t('contact'), href: "#contact" },
    ]

    // Handle menu state changes with pointer-events fix
    const handleMenuChange = (open: boolean) => {
        setIsMenuOpen(open)
        // Workaround for Radix UI pointer-events bug on mobile
        if (!open) {
            setTimeout(() => {
                if (document.body.style.pointerEvents === 'none') {
                    document.body.style.pointerEvents = 'auto'
                }
            }, 0)
        }
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <header
            className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${isScrolled
                ? "bg-background/80 backdrop-blur-md border-border/40"
                : "bg-transparent border-transparent"
                }`}
        >
            <div className="w-full max-w-screen-2xl mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold tracking-tighter">iatoba</span>
                    </Link>
                </div>
                <nav className="hidden md:flex items-center gap-6">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium transition-colors hover:text-primary cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault()
                                const element = document.querySelector(item.href)
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                }
                            }}
                        >
                            {item.name}
                        </a>
                    ))}
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <ModeToggle />
                    </div>
                </nav>
                <div className="flex items-center gap-2 md:hidden">
                    <LanguageToggle />
                    <ModeToggle />
                    <Sheet open={isMenuOpen} onOpenChange={handleMenuChange} modal={false}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                suppressHydrationWarning
                                aria-label={t('toggleMenu')}
                                aria-expanded={isMenuOpen}
                            >
                                <Menu className="h-5 w-5" aria-hidden="true" />
                                <span className="sr-only">{t('toggleMenu')}</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="w-[63vw] max-w-[266px] sm:max-w-[238px] bg-background/60 backdrop-blur-xl border-border/10"
                            style={{ pointerEvents: 'auto' }}
                        >
                            <nav
                                className="flex flex-col gap-4 mt-12 px-3"
                                role="navigation"
                                aria-label="Mobile navigation"
                            >
                                <AnimatePresence mode="wait">
                                    {isMenuOpen && navigation.map((item, index) => (
                                        <MobileMenuCard
                                            key={item.name}
                                            href={item.href}
                                            label={item.name}
                                            index={index}
                                            onNavigate={() => handleMenuChange(false)}
                                        />
                                    ))}
                                </AnimatePresence>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
