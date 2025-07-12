"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { DollarSign, Target, ShoppingCart, BarChart3, Shield, Zap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface AmazonCalculation {
  // Basic costs
  productCost: number
  sellingPrice: number
  shippingToAmazon: number

  // Amazon fees
  referralFee: number
  fulfillmentFee: number
  storageFee: number

  // Additional expenses
  advertisingCosts: number
  returnRate: number
  returnProcessingFee: number
  miscellaneousExpenses: number
  longTermStorageFee: number
  removalFee: number
  inventoryPlacementFee: number

  // Calculated values
  totalAmazonFees: number
  totalAdvertisingCost: number
  returnLosses: number
  totalExpenses: number
  grossProfit: number
  netProfitAfterExpenses: number
  effectiveProfitMargin: number
  advertisingCostOfSales: number
  roi: number

  // Analysis
  profitabilityScore: number
  riskLevel: "low" | "medium" | "high"
}

// Amazon FBA fee structure
const REFERRAL_FEES: Record<string, number> = {
  electronics: 0.08,
  clothing: 0.17,
  books: 0.15,
  homeGarden: 0.15,
  toys: 0.15,
  sports: 0.15,
  beauty: 0.15,
  automotive: 0.12,
}

export default function AmazonCalculator() {
  const { t, language } = useLanguage()
  const [productCost, setProductCost] = useState("")
  const [sellingPrice, setSellingPrice] = useState("")
  const [shippingToAmazon, setShippingToAmazon] = useState("")
  const [weight, setWeight] = useState("")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [height, setHeight] = useState("")
  const [category, setCategory] = useState("electronics")

  // Additional expense fields
  const [advertisingCosts, setAdvertisingCosts] = useState("")
  const [returnRate, setReturnRate] = useState("")
  const [returnProcessingFee, setReturnProcessingFee] = useState("")
  const [miscellaneousExpenses, setMiscellaneousExpenses] = useState("")
  const [longTermStorageFee, setLongTermStorageFee] = useState("")
  const [removalFee, setRemovalFee] = useState("")
  const [inventoryPlacementFee, setInventoryPlacementFee] = useState("")

  const [calculation, setCalculation] = useState<AmazonCalculation | null>(null)

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
    const volume = (lengthIn * widthIn * heightIn) / 1728
    const dimensionalWeight = volume * 139
    const billableWeight = Math.max(weightLbs, dimensionalWeight)

    if (billableWeight <= 1) return 2.5
    if (billableWeight <= 2) return 3.48
    if (billableWeight <= 3) return 4.09
    if (billableWeight <= 12) return 4.75 + (billableWeight - 3) * 0.38
    if (billableWeight <= 70) return 8.17 + (billableWeight - 12) * 0.42
    return 32.53 + (billableWeight - 70) * 0.83
  }

  const calculateStorageFee = (lengthIn: number, widthIn: number, heightIn: number): number => {
    const volume = (lengthIn * widthIn * heightIn) / 1728
    return volume * 0.75
  }

  const formatCurrency = (amount: number): string => {
    const symbol = language === "zh" ? "¥" : "$"
    const rate = language === "zh" ? 7.2 : 1
    const convertedAmount = language === "zh" ? amount * rate : amount
    return `${symbol}${convertedAmount.toFixed(2)}`
  }

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`
  }

  const getProfitabilityScore = (margin: number, acos: number, returnRate: number): number => {
    let score = 100

    // Deduct points based on profit margin
    if (margin < 10) score -= 40
    else if (margin < 20) score -= 20
    else if (margin < 30) score -= 10

    // Deduct points based on ACoS
    if (acos > 50) score -= 30
    else if (acos > 30) score -= 15
    else if (acos > 20) score -= 5

    // Deduct points based on return rate
    if (returnRate > 15) score -= 20
    else if (returnRate > 10) score -= 10
    else if (returnRate > 5) score -= 5

    return Math.max(0, Math.min(100, score))
  }

  const getRiskLevel = (margin: number, acos: number, returnRate: number): "low" | "medium" | "high" => {
    if (margin < 15 || acos > 40 || returnRate > 12) return "high"
    if (margin < 25 || acos > 25 || returnRate > 8) return "medium"
    return "low"
  }

  useEffect(() => {
    const cost = Number.parseFloat(productCost) || 0
    const price = Number.parseFloat(sellingPrice) || 0
    const shipping = Number.parseFloat(shippingToAmazon) || 0
    const weightNum = Number.parseFloat(weight) || 0
    const lengthNum = Number.parseFloat(length) || 0
    const widthNum = Number.parseFloat(width) || 0
    const heightNum = Number.parseFloat(height) || 0

    // Additional expenses
    const adCosts = Number.parseFloat(advertisingCosts) || 0
    const retRate = Number.parseFloat(returnRate) || 0
    const retProcessingFee = Number.parseFloat(returnProcessingFee) || 0
    const miscExpenses = Number.parseFloat(miscellaneousExpenses) || 0
    const ltStorageFee = Number.parseFloat(longTermStorageFee) || 0
    const remFee = Number.parseFloat(removalFee) || 0
    const invPlacementFee = Number.parseFloat(inventoryPlacementFee) || 0

    if (cost > 0 && price > 0) {
      const referralFeeRate = REFERRAL_FEES[category] || 0.15
      const referralFee = price * referralFeeRate

      const fulfillmentFee =
        weightNum > 0 && lengthNum > 0 && widthNum > 0 && heightNum > 0
          ? calculateFulfillmentFee(weightNum, lengthNum, widthNum, heightNum)
          : 3.0

      const storageFee =
        lengthNum > 0 && widthNum > 0 && heightNum > 0 ? calculateStorageFee(lengthNum, widthNum, heightNum) : 0.5

      const totalAmazonFees = referralFee + fulfillmentFee + storageFee
      const totalAdvertisingCost = adCosts
      const returnLosses = (price * retRate) / 100 + retProcessingFee

      const totalExpenses =
        cost +
        shipping +
        totalAmazonFees +
        totalAdvertisingCost +
        returnLosses +
        miscExpenses +
        ltStorageFee +
        remFee +
        invPlacementFee

      const grossProfit = price - (cost + shipping + totalAmazonFees)
      const netProfitAfterExpenses = price - totalExpenses
      const effectiveProfitMargin = price > 0 ? (netProfitAfterExpenses / price) * 100 : 0
      const advertisingCostOfSales = price > 0 ? (totalAdvertisingCost / price) * 100 : 0
      const roi = cost > 0 ? (netProfitAfterExpenses / cost) * 100 : 0

      const profitabilityScore = getProfitabilityScore(effectiveProfitMargin, advertisingCostOfSales, retRate)
      const riskLevel = getRiskLevel(effectiveProfitMargin, advertisingCostOfSales, retRate)

      setCalculation({
        productCost: cost,
        sellingPrice: price,
        shippingToAmazon: shipping,
        referralFee,
        fulfillmentFee,
        storageFee,
        advertisingCosts: adCosts,
        returnRate: retRate,
        returnProcessingFee: retProcessingFee,
        miscellaneousExpenses: miscExpenses,
        longTermStorageFee: ltStorageFee,
        removalFee: remFee,
        inventoryPlacementFee: invPlacementFee,
        totalAmazonFees,
        totalAdvertisingCost,
        returnLosses,
        totalExpenses,
        grossProfit,
        netProfitAfterExpenses,
        effectiveProfitMargin,
        advertisingCostOfSales,
        roi,
        profitabilityScore,
        riskLevel,
      })
    } else {
      setCalculation(null)
    }
  }, [
    productCost,
    sellingPrice,
    shippingToAmazon,
    weight,
    length,
    width,
    height,
    category,
    advertisingCosts,
    returnRate,
    returnProcessingFee,
    miscellaneousExpenses,
    longTermStorageFee,
    removalFee,
    inventoryPlacementFee,
  ])

  const getProfitStatus = (margin: number) => {
    if (margin >= 25)
      return { status: "excellent", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" }
    if (margin >= 15) return { status: "good", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" }
    if (margin >= 5)
      return { status: "fair", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" }
    return { status: "poor", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" }
  }

  const profitStatus = calculation ? getProfitStatus(calculation.effectiveProfitMargin) : null

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("amazonCalculatorTitle")}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("amazonCalculatorDescription")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Basic Product Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
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

          {/* Additional Expenses */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                {t("additionalExpenses")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="advertisingCosts">{t("advertisingCosts")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      {language === "zh" ? "¥" : "$"}
                    </span>
                    <Input
                      id="advertisingCosts"
                      type="number"
                      step="0.01"
                      placeholder={t("enterAmount")}
                      value={advertisingCosts}
                      onChange={(e) => setAdvertisingCosts(e.target.value)}
                      className="pl-8 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnRate">{t("returnRate")}</Label>
                  <div className="relative">
                    <Input
                      id="returnRate"
                      type="number"
                      step="0.1"
                      placeholder={t("enterPercentage")}
                      value={returnRate}
                      onChange={(e) => setReturnRate(e.target.value)}
                      className="pr-8 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500">%</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="returnProcessingFee">{t("returnProcessingFee")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      {language === "zh" ? "¥" : "$"}
                    </span>
                    <Input
                      id="returnProcessingFee"
                      type="number"
                      step="0.01"
                      placeholder={t("enterAmount")}
                      value={returnProcessingFee}
                      onChange={(e) => setReturnProcessingFee(e.target.value)}
                      className="pl-8 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="miscellaneousExpenses">{t("miscellaneousExpenses")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      {language === "zh" ? "¥" : "$"}
                    </span>
                    <Input
                      id="miscellaneousExpenses"
                      type="number"
                      step="0.01"
                      placeholder={t("enterAmount")}
                      value={miscellaneousExpenses}
                      onChange={(e) => setMiscellaneousExpenses(e.target.value)}
                      className="pl-8 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longTermStorageFee">{t("longTermStorageFee")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      {language === "zh" ? "¥" : "$"}
                    </span>
                    <Input
                      id="longTermStorageFee"
                      type="number"
                      step="0.01"
                      placeholder={t("enterAmount")}
                      value={longTermStorageFee}
                      onChange={(e) => setLongTermStorageFee(e.target.value)}
                      className="pl-8 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inventoryPlacementFee">{t("inventoryPlacementFee")}</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500">
                      {language === "zh" ? "¥" : "$"}
                    </span>
                    <Input
                      id="inventoryPlacementFee"
                      type="number"
                      step="0.01"
                      placeholder={t("enterAmount")}
                      value={inventoryPlacementFee}
                      onChange={(e) => setInventoryPlacementFee(e.target.value)}
                      className="pl-8 border-slate-200 focus:border-purple-500 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {calculation && (
            <>
              {/* Profitability Score */}
              <Card className={`shadow-lg border-0 ${profitStatus?.bg} ${profitStatus?.border} border`}>
                <CardHeader className="pb-4">
                  <CardTitle className={`flex items-center gap-2 ${profitStatus?.color}`}>
                    <Zap className="h-5 w-5" />
                    {t("profitabilityScore")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div
                      className="text-4xl font-bold mb-2"
                      style={{ color: `hsl(${calculation.profitabilityScore * 1.2}, 70%, 50%)` }}
                    >
                      {calculation.profitabilityScore.toFixed(0)}/100
                    </div>
                    <Progress value={calculation.profitabilityScore} className="w-full h-3 mb-4" />
                    <Badge
                      variant={
                        calculation.profitabilityScore >= 80
                          ? "default"
                          : calculation.profitabilityScore >= 60
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {calculation.profitabilityScore >= 80
                        ? t("excellent")
                        : calculation.profitabilityScore >= 60
                          ? t("good")
                          : calculation.profitabilityScore >= 40
                            ? t("fair")
                            : t("poor")}
                    </Badge>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("netProfitAfterExpenses")}</p>
                      <p className={`text-xl font-bold ${profitStatus?.color}`}>
                        {formatCurrency(calculation.netProfitAfterExpenses)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("effectiveProfitMargin")}</p>
                      <p className={`text-xl font-bold ${profitStatus?.color}`}>
                        {formatPercentage(calculation.effectiveProfitMargin)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Advanced Metrics */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-indigo-600" />
                    {t("advancedAnalysis")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("advertisingCostOfSales")}</p>
                      <p className="text-lg font-bold text-slate-900">
                        {formatPercentage(calculation.advertisingCostOfSales)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("roi")}</p>
                      <p className="text-lg font-bold text-slate-900">{formatPercentage(calculation.roi)}</p>
                    </div>
                    <div className="text-center p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">{t("riskAssessment")}</p>
                      <Badge
                        variant={
                          calculation.riskLevel === "low"
                            ? "default"
                            : calculation.riskLevel === "medium"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {t(calculation.riskLevel + "Risk")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Breakdown */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    {t("feeBreakdown")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("sellingPrice")}</span>
                      <span className="font-medium text-green-600">{formatCurrency(calculation.sellingPrice)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("productCost")}</span>
                      <span className="font-medium text-red-600">-{formatCurrency(calculation.productCost)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("shippingToAmazon")}</span>
                      <span className="font-medium text-red-600">-{formatCurrency(calculation.shippingToAmazon)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("totalAmazonFees")}</span>
                      <span className="font-medium text-red-600">-{formatCurrency(calculation.totalAmazonFees)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("totalAdvertisingCost")}</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(calculation.totalAdvertisingCost)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("returnLosses")}</span>
                      <span className="font-medium text-red-600">-{formatCurrency(calculation.returnLosses)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">{t("miscellaneousExpenses")}</span>
                      <span className="font-medium text-red-600">
                        -{formatCurrency(calculation.miscellaneousExpenses)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>{t("netProfitAfterExpenses")}</span>
                      <span className={calculation.netProfitAfterExpenses >= 0 ? "text-green-600" : "text-red-600"}>
                        {formatCurrency(calculation.netProfitAfterExpenses)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!calculation && (
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="text-center py-12 text-slate-500">
                <div className="text-6xl mb-4">📈</div>
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
              <Zap className="h-5 w-5 text-yellow-600" />
              {t("advertisingTips")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{t("advertisingTipsContent")}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              {t("returnManagement")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{t("returnManagementContent")}</p>
          </CardContent>
        </Card>

        <Card className="bg-white/60 backdrop-blur border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              {t("expenseOptimization")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">{t("expenseOptimizationContent")}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
