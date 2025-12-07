"use client"

import * as React from "react"
import { Languages } from "lucide-react"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { locales, localeNames, type Locale } from "@/i18n/config"

export function LanguageToggle() {
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const changeLocale = (newLocale: Locale) => {
        // Remove the current locale from the pathname
        const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, '')
        // Add the new locale (unless it's the default 'en')
        const newPath = newLocale === 'en'
            ? pathWithoutLocale || '/'
            : `/${newLocale}${pathWithoutLocale || ''}`
        router.push(newPath)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" suppressHydrationWarning>
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">Toggle language</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {locales.map((loc) => (
                    <DropdownMenuItem
                        key={loc}
                        onClick={() => changeLocale(loc)}
                        className={locale === loc ? "bg-accent" : ""}
                    >
                        {localeNames[loc]}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
