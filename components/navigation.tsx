"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Calculator, DollarSign, FileText, Package } from "lucide-react"

interface NavigationProps {
  activeSection: "unit" | "currency" | "fba" | "content"
  onSectionChange: (section: "unit" | "currency" | "fba" | "content") => void
}

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const { t } = useLanguage()

  return (
    <nav className="bg-white/80 backdrop-blur border-b border-slate-200 sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button
              variant={activeSection === "unit" ? "default" : "ghost"}
              onClick={() => onSectionChange("unit")}
              className="flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">{t("unitConverter")}</span>
            </Button>
            <Button
              variant={activeSection === "currency" ? "default" : "ghost"}
              onClick={() => onSectionChange("currency")}
              className="flex items-center gap-2"
            >
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">{t("currencyConverter")}</span>
            </Button>
            <Button
              variant={activeSection === "fba" ? "default" : "ghost"}
              onClick={() => onSectionChange("fba")}
              className="flex items-center gap-2"
            >
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">{t("fbaCalculator")}</span>
            </Button>
            <Button
              variant={activeSection === "content" ? "default" : "ghost"}
              onClick={() => onSectionChange("content")}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">{t("contentAnalyzer")}</span>
            </Button>
          </div>
          <LanguageSwitcher />
        </div>
      </div>
    </nav>
  )
}
