"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { useTranslations } from "next-intl"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

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
                    <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="md:hidden" suppressHydrationWarning>
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">{t('toggleMenu')}</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[40%] sm:max-w-[250px]">
                            <nav className="flex flex-col gap-6 mt-8 px-2">
                                {navigation.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        className="text-2xl font-medium transition-colors hover:text-primary block px-4 py-2"
                                        onClick={(e) => {
                                            e.preventDefault()
                                            const element = document.querySelector(item.href)
                                            if (element) {
                                                element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                            }
                                            setIsMenuOpen(false)
                                        }}
                                    >
                                        {item.name}
                                    </a>
                                ))}
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
