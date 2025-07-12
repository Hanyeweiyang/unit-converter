"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, X, AlertTriangle, CheckCircle, Info } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface CharacterCountProps {
  current: number
  max: number
  label: string
}

function CharacterCount({ current, max, label }: CharacterCountProps) {
  const { t } = useLanguage()
  const isOverLimit = current > max
  const isNearLimit = current > max * 0.8
  const remaining = max - current

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-600">
        {current} / {max} {t("charactersUsed")}
      </span>
      <div className="flex items-center gap-1">
        {isOverLimit ? (
          <>
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <Badge variant="destructive" className="text-xs">
              {t("characterLimit")}
            </Badge>
          </>
        ) : isNearLimit ? (
          <>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <Badge variant="secondary" className="text-xs">
              {remaining} {t("charactersRemaining")}
            </Badge>
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <Badge variant="outline" className="text-xs">
              {remaining} {t("charactersRemaining")}
            </Badge>
          </>
        )}
      </div>
    </div>
  )
}

export default function ContentAnalyzer() {
  const { t } = useLanguage()
  const [productTitle, setProductTitle] = useState("")
  const [bulletPoints, setBulletPoints] = useState([""])
  const [searchTerms, setSearchTerms] = useState([""])

  const addBulletPoint = () => {
    setBulletPoints([...bulletPoints, ""])
  }

  const removeBulletPoint = (index: number) => {
    if (bulletPoints.length > 1) {
      setBulletPoints(bulletPoints.filter((_, i) => i !== index))
    }
  }

  const updateBulletPoint = (index: number, value: string) => {
    const updated = [...bulletPoints]
    updated[index] = value
    setBulletPoints(updated)
  }

  const addSearchTermLine = () => {
    setSearchTerms([...searchTerms, ""])
  }

  const removeSearchTermLine = (index: number) => {
    if (searchTerms.length > 1) {
      setSearchTerms(searchTerms.filter((_, i) => i !== index))
    }
  }

  const updateSearchTermLine = (index: number, value: string) => {
    const updated = [...searchTerms]
    updated[index] = value
    setSearchTerms(updated)
  }

  const getInputClassName = (current: number, max: number) => {
    if (current > max) {
      return "border-red-500 focus:border-red-500 focus:ring-red-500"
    }
    if (current > max * 0.8) {
      return "border-orange-500 focus:border-orange-500 focus:ring-orange-500"
    }
    return "border-slate-200 focus:border-blue-500 focus:ring-blue-500"
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("contentAnalyzerTitle")}</h1>
        <p className="text-slate-600 max-w-2xl mx-auto">{t("contentAnalyzerDescription")}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Product Title */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              {t("productTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t("productTitle")}</Label>
              <Input
                id="title"
                value={productTitle}
                onChange={(e) => setProductTitle(e.target.value)}
                placeholder={t("productTitlePlaceholder")}
                className={getInputClassName(productTitle.length, 80)}
                maxLength={120} // Allow typing beyond limit for visual feedback
              />
              <CharacterCount current={productTitle.length} max={80} label={t("productTitle")} />
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">{t("titleGuidelines")}</h4>
                    <p className="text-sm text-blue-700">{t("titleTips")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Bullet Points */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              {t("bulletPoints")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {bulletPoints.map((bullet, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`bullet-${index}`}>
                      {t("bulletPoints")} {index + 1}
                    </Label>
                    {bulletPoints.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBulletPoint(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id={`bullet-${index}`}
                    value={bullet}
                    onChange={(e) => updateBulletPoint(index, e.target.value)}
                    placeholder={t("bulletPointPlaceholder")}
                    className={`min-h-[60px] ${getInputClassName(bullet.length, 100)}`}
                    maxLength={150} // Allow typing beyond limit for visual feedback
                  />
                  <CharacterCount current={bullet.length} max={100} label={`${t("bulletPoints")} ${index + 1}`} />
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addBulletPoint} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              {t("addBulletPoint")}
            </Button>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">{t("bulletGuidelines")}</h4>
                    <p className="text-sm text-green-700">{t("bulletTips")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Search Terms */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              {t("searchTerms")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {searchTerms.map((terms, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`search-${index}`}>
                      {t("searchTerms")} {index + 1}
                    </Label>
                    {searchTerms.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSearchTermLine(index)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    id={`search-${index}`}
                    value={terms}
                    onChange={(e) => updateSearchTermLine(index, e.target.value)}
                    placeholder={t("searchTermsPlaceholder")}
                    className={`min-h-[80px] ${getInputClassName(terms.length, 250)}`}
                    maxLength={300} // Allow typing beyond limit for visual feedback
                  />
                  <CharacterCount current={terms.length} max={250} label={`${t("searchTerms")} ${index + 1}`} />
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addSearchTermLine} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              {t("addSearchTermLine")}
            </Button>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-purple-900 mb-1">{t("searchGuidelines")}</h4>
                    <p className="text-sm text-purple-700">{t("searchTips")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-slate-600" />
            {t("contentGuidelines")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-medium text-slate-900">{t("productTitle")}</h4>
              <div className="flex items-center gap-2">
                <Badge variant={productTitle.length <= 80 ? "default" : "destructive"}>{productTitle.length}/80</Badge>
                <span className="text-sm text-slate-600">
                  {productTitle.length <= 80 ? "✓ Within limit" : "⚠ Over limit"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-slate-900">{t("bulletPoints")}</h4>
              <div className="space-y-1">
                {bulletPoints.map((bullet, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant={bullet.length <= 100 ? "default" : "destructive"} className="text-xs">
                      {bullet.length}/100
                    </Badge>
                    <span className="text-xs text-slate-600">
                      Point {index + 1}: {bullet.length <= 100 ? "✓" : "⚠"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-slate-900">{t("searchTerms")}</h4>
              <div className="space-y-1">
                {searchTerms.map((terms, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Badge variant={terms.length <= 250 ? "default" : "destructive"} className="text-xs">
                      {terms.length}/250
                    </Badge>
                    <span className="text-xs text-slate-600">
                      Line {index + 1}: {terms.length <= 250 ? "✓" : "⚠"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
