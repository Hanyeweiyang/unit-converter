"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Ruler, Weight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// Conversion factors to base units (meters for length, grams for weight)
const lengthConversions = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
}

const weightConversions = {
  mg: 0.001,
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
  ton: 1000000,
}

export default function Component() {
  const { t, tUnit } = useLanguage()
  const [activeTab, setActiveTab] = useState("length")
  const [inputValue, setInputValue] = useState("")
  const [fromUnit, setFromUnit] = useState("cm")
  const [conversions, setConversions] = useState<Record<string, number>>({})

  const lengthUnits = [
    { value: "mm", category: "metric" },
    { value: "cm", category: "metric" },
    { value: "m", category: "metric" },
    { value: "in", category: "imperial" },
    { value: "ft", category: "imperial" },
    { value: "yd", category: "imperial" },
  ]

  const weightUnits = [
    { value: "mg", category: "metric" },
    { value: "g", category: "metric" },
    { value: "kg", category: "metric" },
    { value: "oz", category: "imperial" },
    { value: "lb", category: "imperial" },
    { value: "ton", category: "metric" },
  ]

  const convertUnits = (value: number, from: string, conversionsMap: Record<string, number>) => {
    // Check if the from unit exists in the conversion map
    if (!conversionsMap[from]) {
      console.warn(`Invalid unit: ${from}`)
      return {}
    }

    const baseValue = value * conversionsMap[from]
    const results: Record<string, number> = {}

    Object.keys(conversionsMap).forEach((unit) => {
      const convertedValue = baseValue / conversionsMap[unit]
      // Only add valid numbers to results
      if (!isNaN(convertedValue) && isFinite(convertedValue)) {
        results[unit] = convertedValue
      }
    })

    return results
  }

  useEffect(() => {
    // Reset fromUnit to default when switching tabs
    if (activeTab === "length" && !lengthConversions[fromUnit as keyof typeof lengthConversions]) {
      setFromUnit("cm")
      return
    }
    if (activeTab === "weight" && !weightConversions[fromUnit as keyof typeof weightConversions]) {
      setFromUnit("g")
      return
    }

    if (inputValue && !isNaN(Number(inputValue))) {
      const value = Number(inputValue)
      if (activeTab === "length") {
        setConversions(convertUnits(value, fromUnit, lengthConversions))
      } else {
        setConversions(convertUnits(value, fromUnit, weightConversions))
      }
    } else {
      setConversions({})
    }
  }, [inputValue, fromUnit, activeTab])

  const formatNumber = (num: number | undefined) => {
    // Handle undefined or NaN values
    if (num === undefined || isNaN(num) || !isFinite(num)) {
      return "0"
    }

    if (num === 0) return "0"
    if (num < 0.001) return num.toExponential(3)
    if (num < 1) return num.toFixed(6).replace(/\.?0+$/, "")
    if (num < 1000) return num.toFixed(3).replace(/\.?0+$/, "")
    return num.toLocaleString(undefined, { maximumFractionDigits: 3 })
  }

  const currentUnits = activeTab === "length" ? lengthUnits : weightUnits
  const currentConversions = activeTab === "length" ? lengthConversions : weightConversions

  // Add this new useEffect after the existing one
  useEffect(() => {
    // Clear conversions when switching tabs to prevent stale data
    setConversions({})

    // Reset to default unit for the active tab
    if (activeTab === "length") {
      setFromUnit("cm")
    } else {
      setFromUnit("g")
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("pageTitle")}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("pageDescription")}</p>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader className="pb-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-100">
              <TabsTrigger value="length" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                {t("lengthTab")}
              </TabsTrigger>
              <TabsTrigger value="weight" className="flex items-center gap-2">
                <Weight className="h-4 w-4" />
                {t("weightTab")}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="value" className="text-sm font-medium text-slate-700">
                {t("enterValue")}
              </Label>
              <Input
                id="value"
                type="number"
                placeholder={t("enterValuePlaceholder")}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="text-lg h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-medium text-slate-700">
                {t("fromUnit")}
              </Label>
              <Select value={fromUnit} onValueChange={setFromUnit}>
                <SelectTrigger className="h-12 border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentUnits.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      <div className="flex items-center justify-between w-full">
                        <span>{tUnit(unit.value)}</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {t(unit.category)}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {Object.keys(conversions).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
                {t("conversionResults")}
              </h3>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {currentUnits.map((unit) => (
                  <Card
                    key={unit.value}
                    className={`transition-all duration-200 hover:shadow-md ${
                      unit.value === fromUnit ? "ring-2 ring-blue-500 bg-blue-50" : "bg-white hover:bg-slate-50"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant={unit.category === "metric" ? "default" : "secondary"} className="text-xs">
                          {t(unit.category)}
                        </Badge>
                        {unit.value === fromUnit && (
                          <Badge variant="outline" className="text-xs text-blue-600 border-blue-200">
                            {t("input")}
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-slate-600">{tUnit(unit.value)}</p>
                        <p className="text-xl font-bold text-slate-900 break-all">
                          {formatNumber(conversions[unit.value])}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {!inputValue && (
            <div className="text-center py-12 text-slate-500">
              <div className="text-6xl mb-4">{activeTab === "length" ? "📏" : "⚖️"}</div>
              <p className="text-lg">{t("enterValuePrompt")}</p>
              <p className="text-sm mt-2">{t("perfectFor")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Ruler className="h-5 w-5 text-blue-600" />
              {t("lengthUnits")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-slate-600">{t("lengthDescription")}</p>
            <div className="flex flex-wrap gap-2">
              {lengthUnits.map((unit) => (
                <Badge key={unit.value} variant="outline" className="text-xs">
                  {unit.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Weight className="h-5 w-5 text-green-600" />
              {t("weightUnits")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-slate-600">{t("weightDescription")}</p>
            <div className="flex flex-wrap gap-2">
              {weightUnits.map((unit) => (
                <Badge key={unit.value} variant="outline" className="text-xs">
                  {unit.value}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
