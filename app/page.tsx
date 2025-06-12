"use client"

import { useState } from "react"
import UnitConverter from "../unit-converter"
import CurrencyConverter from "../currency-converter"
import ContentAnalyzer from "../content-analyzer"
import { Navigation } from "@/components/navigation"
import { LanguageProvider } from "@/contexts/language-context"
import FBACalculator from "../fba-calculator"

export default function Page() {
  const [activeSection, setActiveSection] = useState<"unit" | "currency" | "fba" | "content">("unit")

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
        <div className="p-4">
          <div className="mx-auto max-w-6xl">
            {activeSection === "unit" && <UnitConverter />}
            {activeSection === "currency" && <CurrencyConverter />}
            {activeSection === "fba" && <FBACalculator />}
            {activeSection === "content" && <ContentAnalyzer />}
          </div>
        </div>
      </div>
    </LanguageProvider>
  )
}
