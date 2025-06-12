"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DollarSign, RefreshCw, AlertCircle, Clock, TrendingUp, ArrowRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { getExchangeRates, refreshExchangeRates } from "@/services/exchange-rates"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExchangeRates {
  rates: Record<string, number>
  timestamp: number
  lastUpdate: number
}

export default function CurrencyConverter() {
  const { t } = useLanguage()
  const [inputValue, setInputValue] = useState("")
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [sourceCurrency, setSourceCurrency] = useState("CNY")

  const currencies = [
    { code: "CNY", flag: "🇨🇳", symbol: "¥", category: "base" },
    { code: "USD", flag: "🇺🇸", symbol: "$", category: "major" },
    { code: "EUR", flag: "🇪🇺", symbol: "€", category: "major" },
    { code: "GBP", flag: "🇬🇧", symbol: "£", category: "major" },
    { code: "JPY", flag: "🇯🇵", symbol: "¥", category: "regional" },
    { code: "KRW", flag: "🇰🇷", symbol: "₩", category: "regional" },
    { code: "HKD", flag: "🇭🇰", symbol: "HK$", category: "regional" },
    { code: "SGD", flag: "🇸🇬", symbol: "S$", category: "regional" },
    { code: "AUD", flag: "🇦🇺", symbol: "A$", category: "major" },
    { code: "CAD", flag: "🇨🇦", symbol: "C$", category: "major" },
  ]

  const fetchRates = async (forceRefresh = false) => {
    setLoading(true)
    setError(false)
    try {
      const rates = forceRefresh ? await refreshExchangeRates() : await getExchangeRates()
      setExchangeRates(rates)
      setLastRefresh(new Date())
    } catch (err) {
      setError(true)
      console.error("Failed to fetch exchange rates:", err)
    } finally {
      setLoading(false)
    }
  }

  // Auto-refresh every hour
  useEffect(() => {
    fetchRates()

    const interval = setInterval(
      () => {
        console.log("Auto-refreshing exchange rates...")
        fetchRates()
      },
      60 * 60 * 1000,
    ) // 1 hour

    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number | undefined) => {
    if (num === undefined || isNaN(num) || !isFinite(num)) {
      return "0.00"
    }

    if (num === 0) return "0.00"

    // For very small numbers, use more decimal places
    if (num < 0.01) return num.toFixed(6).replace(/\.?0+$/, "")

    // For numbers less than 1, show 4 decimal places
    if (num < 1) return num.toFixed(4).replace(/\.?0+$/, "")

    // For larger numbers, show 2 decimal places
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  const formatExchangeRate = (rate: number) => {
    if (rate < 0.01) return rate.toFixed(6).replace(/\.?0+$/, "")
    if (rate < 1) return rate.toFixed(4).replace(/\.?0+$/, "")
    return rate.toFixed(4).replace(/\.?0+$/, "")
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString()
  }

  // Get the currency symbol for the selected currency
  const getSymbolForCurrency = (code: string) => {
    const currency = currencies.find((c) => c.code === code)
    return currency ? currency.symbol : code
  }

  // Convert from any currency to any other currency
  const convertCurrency = (amount: number, fromCurrency: string, toCurrency: string): number => {
    if (!exchangeRates || !exchangeRates.rates) return 0

    // Add CNY to rates with rate 1 if it doesn't exist
    const rates = {
      ...exchangeRates.rates,
      CNY: 1,
    }

    // If source or target currency doesn't exist in rates, return 0
    if (!rates[fromCurrency] || !rates[toCurrency]) return 0

    // First convert to CNY (our base currency for rates)
    // Then convert from CNY to target currency
    return (amount / rates[fromCurrency]) * rates[toCurrency]
  }

  const getConvertedValue = (targetCurrency: string) => {
    if (!inputValue || isNaN(Number(inputValue))) return 0

    const amount = Number(inputValue)
    return convertCurrency(amount, sourceCurrency, targetCurrency)
  }

  const getTimeUntilNextUpdate = () => {
    if (!lastRefresh) return ""
    const nextUpdate = new Date(lastRefresh.getTime() + 60 * 60 * 1000)
    const now = new Date()
    const diff = nextUpdate.getTime() - now.getTime()

    if (diff <= 0) return t("loading")

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (hours > 0) {
      return `${hours}h ${remainingMinutes}m`
    }
    return `${remainingMinutes}m`
  }

  // Get the target currencies (all except the source currency)
  const targetCurrencies = currencies.filter((c) => c.code !== sourceCurrency)

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("currencyTitle")}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("currencyDescription")}</p>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              {t("currencyTitle")}
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastRefresh && !loading && (
                <div className="flex items-center gap-1 text-sm text-slate-500">
                  <Clock className="h-4 w-4" />
                  <span>{getTimeUntilNextUpdate()}</span>
                </div>
              )}
              <Button variant="outline" size="sm" onClick={() => fetchRates(true)} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                {loading ? t("loading") : t("retry")}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span>{t("error")}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => fetchRates(true)}>
                <RefreshCw className="h-4 w-4 mr-1" />
                {t("retry")}
              </Button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="amount" className="text-sm font-medium text-slate-700">
                {t("enterValue")}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 text-lg">
                  {getSymbolForCurrency(sourceCurrency)}
                </span>
                <Input
                  id="amount"
                  type="number"
                  placeholder={t("enterValuePlaceholder")}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="text-lg h-12 pl-10 border-slate-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-sm font-medium text-slate-700">
                {t("selectSourceCurrency")}
              </Label>
              <Select value={sourceCurrency} onValueChange={setSourceCurrency}>
                <SelectTrigger className="h-12 border-slate-200 focus:border-green-500 focus:ring-green-500">
                  <SelectValue placeholder={t("selectCurrency")} />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      <div className="flex items-center gap-2">
                        <span>{currency.flag}</span>
                        <span>{t(currency.code.toLowerCase())}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {inputValue && !isNaN(Number(inputValue)) && exchangeRates && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t("conversionResults")}
                </h3>
                <Badge variant="outline" className="font-normal">
                  {t("convertFrom")} {currencies.find((c) => c.code === sourceCurrency)?.flag}{" "}
                  {t(sourceCurrency.toLowerCase())}
                </Badge>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {targetCurrencies.map((currency) => {
                  const convertedAmount = getConvertedValue(currency.code)
                  const exchangeRate = convertCurrency(1, sourceCurrency, currency.code)

                  return (
                    <Card
                      key={currency.code}
                      className="transition-all duration-200 hover:shadow-md bg-white hover:bg-slate-50 border-l-4 border-l-green-500"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{currency.flag}</span>
                            <Badge
                              variant={currency.category === "major" ? "default" : "secondary"}
                              className="text-xs"
                            >
                              {currency.code}
                            </Badge>
                          </div>
                          <span className="text-sm text-slate-500 font-mono">{currency.symbol}</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-slate-600">{t(currency.code.toLowerCase())}</p>
                          <p className="text-xl font-bold text-slate-900 break-all">
                            {currency.symbol}
                            {formatNumber(convertedAmount)}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                            <span>1 {sourceCurrency}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>
                              {formatExchangeRate(exchangeRate)} {currency.code}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {exchangeRates.lastUpdate && (
                <div className="text-center text-sm text-slate-500 space-y-1 bg-slate-50 p-3 rounded-lg">
                  <p className="flex items-center justify-center gap-1">
                    <Clock className="h-4 w-4" />
                    {t("lastUpdated")}: {formatDate(exchangeRates.lastUpdate)}
                  </p>
                  <p>Next auto-update: {getTimeUntilNextUpdate()}</p>
                </div>
              )}
            </div>
          )}

          {!inputValue && (
            <div className="text-center py-12 text-slate-500">
              <div className="text-6xl mb-4">💱</div>
              <p className="text-lg">{t("enterValuePrompt")}</p>
              <p className="text-sm mt-2">{t("perfectFor")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              {t("majorCurrencies")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">{t("majorCurrenciesDescription")}</p>
            <div className="space-y-2">
              {currencies
                .filter((c) => c.category === "major")
                .map((currency) => (
                  <div key={currency.code} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span className="text-sm font-medium">{currency.code}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {t("tradingVolume")}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              {t("regionalCurrencies")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">{t("regionalCurrenciesDescription")}</p>
            <div className="space-y-2">
              {currencies
                .filter((c) => c.category === "regional")
                .map((currency) => (
                  <div key={currency.code} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <span className="text-sm font-medium">{currency.code}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {t("crossBorderTrade")}
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              {t("conversionTips")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-slate-600">{t("conversionTipsDescription")}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-orange-500" />
                <span>Hourly Updates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Real-time Rates</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="h-4 w-4 text-blue-500" />
                <span>E-commerce Optimized</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
