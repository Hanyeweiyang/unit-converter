"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, DollarSign, TrendingUp, TrendingDown, AlertTriangle, Info, Target } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface FBACalculation {
  productCost: number
  sellingPrice: number
  shippingToAmazon: number
  referralFee: number
  fulfillmentFee: number
  storageFee: number
  totalFees: number
  totalCosts: number
  grossProfit: number
  profitMargin: number
  roi: number
  breakEvenPrice: number
  recommendedPrice: number
}

// Amazon FBA fee structure (simplified - actual fees may vary)
const REFERRAL_FEES: Record<string, number> = {
  electronics: 0.08, // 8%
  clothing: 0.17, // 17%
  books: 0.15, // 15%
  homeGarden: 0.15, // 15%
  toys: 0.15, // 15%
  sports: 0.15, // 15%
  beauty: 0.15, // 15%
  automotive: 0.12, // 12%
}

export default function FBACalculator() {
  const { t, language } = useLanguage()
  const [productCost, setProductCost] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")
  const [shippingToAmazon, setShippingToAmazon] = useState("")
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [category, setCategory] = useState("electronics")
  const [calculation, setCalculation] = useState<FBACalculation | null>(null)

  const categories = [
    { value: "electronics", label: t("electronics") },
    { value: "clothing", label: t("clothing") },
    { value: "books", label: t("books") },
    { value: "homeGarden", label: t("homeGarden") },
    { value: "toys", label: t("toys") },
    { value: "sports", label: t("sports") },
    { value: "beauty", label: t("beauty") },
    { value: "automotive", label: t("automotive") },
  ]

  const calculateFulfillmentFee = (weightLbs: number, lengthIn: number, widthIn: number, heightIn: number): number => {
    // Simplified FBA fulfillment fee calculation
    const volume = (lengthIn * widthIn * heightIn) / 1728 // cubic feet
    const dimensionalWeight = volume * 139 // DIM weight factor
    const billableWeight = Math.max(weightLbs, dimensionalWeight)

    if (billableWeight <= 1) return 2.5
    if (billableWeight <= 2) return 3.48
    if (billableWeight <= 3) return 4.09
    if (billableWeight <= 12) return 4.75 + (billableWeight - 3) * 0.38
    if (billableWeight <= 70) return 8.17 + (billableWeight - 12) * 0.42
    return 32.53 + (billableWeight - 70) * 0.83
  }

  const calculateStorageFee = (lengthIn: number, widthIn: number, heightIn: number): number => {
    // Monthly storage fee calculation (simplified)
    const volume = (lengthIn * widthIn * heightIn) / 1728 // cubic feet
    return volume * 0.75 // $0.75 per cubic foot per month (standard size)
  }

  const formatCurrency = (amount: number): string => {
    const symbol = language === "zh" ? "¥" : "$"
    const rate = language === "zh" ? 7.2 : 1 // Simplified conversion rate
    const convertedAmount = language === "zh" ? amount * rate : amount

    return `${symbol}${convertedAmount.toFixed(2)}`
  }

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  useEffect(() => {
    const cost = Number.parseFloat(productCost) || 0
    const price = Number.parseFloat(sellingPrice) || 0
    const shipping = Number.parseFloat(shippingToAmazon) || 0
    const weightNum = Number.parseFloat(weight) || 0
    const lengthNum = Number.parseFloat(length) || 0
    const widthNum = Number.parseFloat(width) || 0
    const heightNum = Number.parseFloat(height) || 0

    if (cost > 0 && price > 0) {
      const referralFeeRate = REFERRAL_FEES[category] || 0.15
      const referralFee = price * referralFeeRate

      const fulfillmentFee =
        weightNum > 0 && lengthNum > 0 && widthNum > 0 && heightNum > 0
          ? calculateFulfillmentFee(weightNum, lengthNum, widthNum, heightNum)
          : 3.0 // Default estimate

      const storageFee =
        lengthNum > 0 && widthNum > 0 && heightNum > 0 ? calculateStorageFee(lengthNum, widthNum, heightNum) : 0.5 // Default estimate

      const totalFees = referralFee + fulfillmentFee + storageFee
      const totalCosts = cost + shipping + totalFees
      const grossProfit = price - totalCosts
      const profitMargin = price > 0 ? (grossProfit / price) * 100 : 0
      const roi = cost > 0 ? (grossProfit / cost) * 100 : 0
      const breakEvenPrice = totalCosts
      const recommendedPrice = totalCosts / 0.7 // Target 30% profit margin

      setCalculation({
        productCost: cost,
        sellingPrice: price,
        shippingToAmazon: shipping,
        referralFee,
        fulfillmentFee,
        storageFee,
        totalFees,
        totalCosts,
        grossProfit,
        profitMargin,
        roi,
        breakEvenPrice,
        recommendedPrice,
      })
    } else {
      setCalculation(null)
    }
  }, [productCost, sellingPrice, shippingToAmazon, weight, length, width, height, category])

  const getProfitStatus = (margin: number) => {
    if (margin >= 30)
      return { status: "profitable", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" }
    if (margin >= 15)
      return { status: "marginal", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" }
    return { status: "unprofitable", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
  }

  const profitStatus = calculation ? getProfitStatus(calculation.profitMargin) : null

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("fbaCalculatorTitle")}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("fbaCalculatorDescription")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                {t("productInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="productCost">{t("productCost")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      {language === "zh" ? "¥" : "$"}
                    </span>
                    <Input
                      id="productCost"
                      type="number"
                      step="0.01"
                      placeholder={t("enterAmount")}
                      value={productCost}
                      onChange={(e) => setProductCost(e.target.value)}
                      className="pl-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">{t("sellingPrice")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      {language === "zh" ? "¥" : "$"}
                    </span>
                    <Input
                      id="sellingPrice"
                      type="number"
                      step="0.01"
                      placeholder={t("enterAmount")}
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(e.target.value)}
                      className="pl-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingToAmazon">{t("shippingToAmazon")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      {language === "zh" ? "¥" : "$"}
                    </span>
                    <Input
                      id="shippingToAmazon"
                      type="number"
                      step="0.01"
                      placeholder={t("enterAmount")}
                      value={shippingToAmazon}
                      onChange={(e) => setShippingToAmazon(e.target.value)}
                      className="pl-8 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">{t("category")}</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="border-slate-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product Dimensions */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                {t("dimensionsAndWeight")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">{t("productWeight")}</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder={t("enterWeight")}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="border-slate-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">{t("length")}</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.1"
                    placeholder={t("enterDimension")}
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="border-slate-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="width">{t("width")}</Label>
                  <Input
                    id="width"
                    type="number"
                    step="0.1"
                    placeholder={t("enterDimension")}
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    className="border-slate-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">{t("height")}</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder={t("enterDimension")}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="border-slate-200 focus:border-green-500 focus:ring-green-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {calculation && (
            <>
              {/* Profit Summary */}
              <Card className={`shadow-lg border-0 ${profitStatus?.bg} ${profitStatus?.border} border`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`flex items-center gap-2 ${profitStatus?.color}`}>
                    {calculation.profitMargin >= 30 ? (
                      <TrendingUp className="h-5 w-5" />
                    ) : calculation.profitMargin >= 15 ? (
                      <AlertTriangle className="h-5 w-5" />
                    ) : (
                      <TrendingDown className="h-5 w-5" />
                    )}
                    {t("profitAnalysis")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("grossProfit")}</p>
                      <p className={`text-2xl font-bold ${profitStatus?.color}`}>
                        {formatCurrency(calculation.grossProfit)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("profitMargin")}</p>
                      <p className={`text-2xl font-bold ${profitStatus?.color}`}>
                        {formatPercentage(calculation.profitMargin)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <Badge
                      variant={
                        calculation.profitMargin >= 30
                          ? "default"
                          : calculation.profitMargin >= 15
                            ? "secondary"
                            : "destructive"
                      }
                      className="text-sm px-4 py-2"
                    >
                      {t(profitStatus?.status || "unprofitable")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Fee Breakdown */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-purple-600" />
                    {t("feeBreakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("productCost")}</span>
                      <span className="font-medium">{formatCurrency(calculation.productCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("shippingToAmazon")}</span>
                      <span className="font-medium">{formatCurrency(calculation.shippingToAmazon)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("amazonReferralFee")}</span>
                      <span className="font-medium">{formatCurrency(calculation.referralFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("fbaFulfillmentFee")}</span>
                      <span className="font-medium">{formatCurrency(calculation.fulfillmentFee)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("monthlyStorageFee")}</span>
                      <span className="font-medium">{formatCurrency(calculation.storageFee)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-semibold">
                      <span>{t("totalCosts")}</span>
                      <span>{formatCurrency(calculation.totalCosts)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    {t("recommendations")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("breakEvenPrice")}</p>
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(calculation.breakEvenPrice)}</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("recommendedPrice")}</p>
                      <p className="text-lg font-bold text-slate-900">{formatCurrency(calculation.recommendedPrice)}</p>
                    </div>
                  </div>

                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-slate-600 mb-1">{t("roi")}</p>
                    <p className="text-xl font-bold text-blue-600">{formatPercentage(calculation.roi)}</p>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!calculation && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="text-center py-12 text-slate-500">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-lg">{t("enterValuePrompt")}</p>
                <p className="text-sm mt-2">{t("enterProductDetails")}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Guidelines */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600" />
              {t("fbaGuidelines")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{t("fbaGuideTips")}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {t("costOptimization")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{t("costOptimizationTips")}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              {t("pricingStrategy")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{t("pricingStrategyTips")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
