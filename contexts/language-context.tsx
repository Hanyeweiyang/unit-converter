"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "zh"

type Translations = {
  [key: string]: {
    en: string
    zh: string
  }
}

// All translations for the application
const translations: Translations = {
  // Page title and description
  pageTitle: {
    en: "E-Commerce Unit Converter",
    zh: "电商单位转换器",
  },
  pageDescription: {
    en: "Convert between different units of measurement for your product listings. Perfect for international e-commerce and inventory management.",
    zh: "为您的产品列表在不同计量单位之间进行转换。适用于国际电子商务和库存管理。",
  },

  // Tabs
  lengthTab: {
    en: "Length",
    zh: "长度",
  },
  weightTab: {
    en: "Weight",
    zh: "重量",
  },

  // Input fields
  enterValue: {
    en: "Enter Value",
    zh: "输入数值",
  },
  enterValuePlaceholder: {
    en: "Enter a number...",
    zh: "输入数字...",
  },
  fromUnit: {
    en: "From Unit",
    zh: "从单位",
  },

  // Results
  conversionResults: {
    en: "Conversion Results",
    zh: "转换结果",
  },
  enterValuePrompt: {
    en: "Enter a value above to see conversions",
    zh: "在上方输入数值以查看转换结果",
  },
  perfectFor: {
    en: "Perfect for product dimensions, shipping weights, and inventory management",
    zh: "适用于产品尺寸、运输重量和库存管理",
  },

  // Unit categories
  metric: {
    en: "Metric",
    zh: "公制",
  },
  imperial: {
    en: "Imperial",
    zh: "英制",
  },
  input: {
    en: "Input",
    zh: "输入",
  },

  // Unit cards
  lengthUnits: {
    en: "Length Units",
    zh: "长度单位",
  },
  weightUnits: {
    en: "Weight Units",
    zh: "重量单位",
  },
  lengthDescription: {
    en: "Convert between metric and imperial length measurements commonly used in e-commerce:",
    zh: "在电子商务中常用的公制和英制长度测量单位之间进行转换：",
  },
  weightDescription: {
    en: "Convert between metric and imperial weight measurements for shipping and inventory:",
    zh: "在运输和库存的公制和英制重量测量单位之间进行转换：",
  },

  // Language selector
  language: {
    en: "Language",
    zh: "语言",
  },
  english: {
    en: "English",
    zh: "英语",
  },
  chinese: {
    en: "Chinese",
    zh: "中文",
  },

  // Navigation
  navigation: {
    en: "Navigation",
    zh: "导航",
  },
  unitConverter: {
    en: "Unit Converter",
    zh: "单位转换器",
  },
  currencyConverter: {
    en: "Currency Converter",
    zh: "货币转换器",
  },
  contentAnalyzer: {
    en: "Content Analyzer",
    zh: "内容分析器",
  },

  // Currency converter
  currencyTitle: {
    en: "Currency Exchange",
    zh: "货币兑换",
  },
  currencyDescription: {
    en: "Convert Chinese Yuan (CNY) to major international currencies with real-time exchange rates.",
    zh: "将人民币（CNY）转换为主要国际货币，提供实时汇率。",
  },
  fromCurrency: {
    en: "From Currency",
    zh: "源货币",
  },
  toCurrency: {
    en: "To Currency",
    zh: "目标货币",
  },
  exchangeRate: {
    en: "Exchange Rate",
    zh: "汇率",
  },
  lastUpdated: {
    en: "Last Updated",
    zh: "最后更新",
  },
  loading: {
    en: "Loading...",
    zh: "加载中...",
  },
  error: {
    en: "Error loading exchange rates",
    zh: "加载汇率时出错",
  },
  retry: {
    en: "Retry",
    zh: "重试",
  },

  // Currency names
  cny: {
    en: "Chinese Yuan (CNY)",
    zh: "人民币 (CNY)",
  },
  usd: {
    en: "US Dollar (USD)",
    zh: "美元 (USD)",
  },
  eur: {
    en: "Euro (EUR)",
    zh: "欧元 (EUR)",
  },
  gbp: {
    en: "British Pound (GBP)",
    zh: "英镑 (GBP)",
  },
  jpy: {
    en: "Japanese Yen (JPY)",
    zh: "日元 (JPY)",
  },
  krw: {
    en: "South Korean Won (KRW)",
    zh: "韩元 (KRW)",
  },
  hkd: {
    en: "Hong Kong Dollar (HKD)",
    zh: "港币 (HKD)",
  },
  sgd: {
    en: "Singapore Dollar (SGD)",
    zh: "新加坡元 (SGD)",
  },
  aud: {
    en: "Australian Dollar (AUD)",
    zh: "澳元 (AUD)",
  },
  cad: {
    en: "Canadian Dollar (CAD)",
    zh: "加元 (CAD)",
  },

  // Currency section titles and content
  majorCurrencies: {
    en: "Major Currencies",
    zh: "主要货币",
  },
  regionalCurrencies: {
    en: "Regional Currencies",
    zh: "区域货币",
  },
  majorCurrenciesDescription: {
    en: "Most traded currencies in global e-commerce and international business:",
    zh: "全球电子商务和国际贸易中最常用的货币：",
  },
  regionalCurrenciesDescription: {
    en: "Asian-Pacific currencies for regional trade and cross-border transactions:",
    zh: "亚太地区贸易和跨境交易常用货币：",
  },

  // Enhanced content for e-commerce focus
  tradingVolume: {
    en: "High Trading Volume",
    zh: "高交易量",
  },
  lowVolatility: {
    en: "Low Volatility",
    zh: "低波动性",
  },
  ecommercePopular: {
    en: "E-commerce Popular",
    zh: "电商热门",
  },
  crossBorderTrade: {
    en: "Cross-border Trade",
    zh: "跨境贸易",
  },

  // Practical information
  conversionTips: {
    en: "Conversion Tips",
    zh: "兑换提示",
  },
  marketInsights: {
    en: "Market Insights",
    zh: "市场洞察",
  },
  conversionTipsDescription: {
    en: "Exchange rates update hourly. Consider market volatility for large transactions and international payments.",
    zh: "汇率每小时更新。大额交易和国际支付请考虑市场波动性。",
  },
  marketInsightsDescription: {
    en: "Major currencies offer stability for international e-commerce, while regional currencies provide better rates for local markets.",
    zh: "主要货币为国际电商提供稳定性，区域货币为本地市场提供更优汇率。",
  },

  // Enhanced currency converter
  selectSourceCurrency: {
    en: "Select Currency",
    zh: "选择货币",
  },
  convertFrom: {
    en: "Convert from",
    zh: "从此货币转换",
  },
  convertTo: {
    en: "Convert to",
    zh: "转换为",
  },
  sourceAmount: {
    en: "Source Amount",
    zh: "源金额",
  },
  targetAmount: {
    en: "Target Amount",
    zh: "目标金额",
  },
  selectCurrency: {
    en: "Select currency",
    zh: "选择货币",
  },
  allCurrencies: {
    en: "All Currencies",
    zh: "所有货币",
  },
  baseCurrency: {
    en: "Base Currency",
    zh: "基础货币",
  },
  targetCurrencies: {
    en: "Target Currencies",
    zh: "目标货币",
  },

  // Content Analyzer
  contentAnalyzerTitle: {
    en: "Product Content Analyzer",
    zh: "产品内容分析器",
  },
  contentAnalyzerDescription: {
    en: "Analyze and optimize your product content for e-commerce platforms with real-time character count feedback.",
    zh: "分析和优化您的产品内容，为电商平台提供实时字符计数反馈。",
  },
  productTitle: {
    en: "Product Title",
    zh: "产品标题",
  },
  bulletPoints: {
    en: "Bullet Points",
    zh: "要点列表",
  },
  searchTerms: {
    en: "Search Terms",
    zh: "搜索关键词",
  },
  productTitlePlaceholder: {
    en: "Enter your product title (max 80 characters)...",
    zh: "输入产品标题（最多80个字符）...",
  },
  bulletPointPlaceholder: {
    en: "Enter bullet point (max 100 characters per line)...",
    zh: "输入要点（每行最多100个字符）...",
  },
  searchTermsPlaceholder: {
    en: "Enter search terms (max 250 characters per line)...",
    zh: "输入搜索关键词（每行最多250个字符）...",
  },
  charactersUsed: {
    en: "characters used",
    zh: "已使用字符",
  },
  charactersRemaining: {
    en: "characters remaining",
    zh: "剩余字符",
  },
  characterLimit: {
    en: "Character limit exceeded",
    zh: "超出字符限制",
  },
  addBulletPoint: {
    en: "Add Bullet Point",
    zh: "添加要点",
  },
  addSearchTermLine: {
    en: "Add Search Term Line",
    zh: "添加搜索词行",
  },
  removeLine: {
    en: "Remove line",
    zh: "删除行",
  },
  contentGuidelines: {
    en: "Content Guidelines",
    zh: "内容指南",
  },
  titleGuidelines: {
    en: "Title Guidelines",
    zh: "标题指南",
  },
  bulletGuidelines: {
    en: "Bullet Point Guidelines",
    zh: "要点指南",
  },
  searchGuidelines: {
    en: "Search Term Guidelines",
    zh: "搜索词指南",
  },
  titleTips: {
    en: "Keep titles concise and descriptive. Include key product features and brand name within 80 characters.",
    zh: "保持标题简洁明了。在80个字符内包含关键产品特性和品牌名称。",
  },
  bulletTips: {
    en: "Use bullet points to highlight key features, benefits, and specifications. Each point should be under 100 characters.",
    zh: "使用要点突出关键特性、优势和规格。每个要点应少于100个字符。",
  },
  searchTips: {
    en: "Include relevant keywords that customers might search for. Separate terms with commas, max 250 characters per line.",
    zh: "包含客户可能搜索的相关关键词。用逗号分隔词汇，每行最多250个字符。",
  },

  // Amazon FBA Calculator
  fbaCalculator: {
    en: "FBA Calculator",
    zh: "FBA计算器",
  },
  fbaCalculatorTitle: {
    en: "Amazon FBA Profit Calculator",
    zh: "亚马逊FBA利润计算器",
  },
  fbaCalculatorDescription: {
    en: "Calculate your Amazon FBA profit margins with detailed cost breakdown and fee analysis.",
    zh: "计算您的亚马逊FBA利润率，提供详细的成本分解和费用分析。",
  },

  // Input fields
  productCost: {
    en: "Product Cost",
    zh: "产品成本",
  },
  sellingPrice: {
    en: "Selling Price",
    zh: "销售价格",
  },
  shippingToAmazon: {
    en: "Shipping to Amazon",
    zh: "运输至亚马逊",
  },
  productWeight: {
    en: "Product Weight (lbs)",
    zh: "产品重量 (磅)",
  },
  productDimensions: {
    en: "Product Dimensions",
    zh: "产品尺寸",
  },
  length: {
    en: "Length (in)",
    zh: "长度 (英寸)",
  },
  width: {
    en: "Width (in)",
    zh: "宽度 (英寸)",
  },
  height: {
    en: "Height (in)",
    zh: "高度 (英寸)",
  },
  category: {
    en: "Category",
    zh: "类别",
  },

  // Categories
  electronics: {
    en: "Electronics",
    zh: "电子产品",
  },
  clothing: {
    en: "Clothing",
    zh: "服装",
  },
  books: {
    en: "Books",
    zh: "图书",
  },
  homeGarden: {
    en: "Home & Garden",
    zh: "家居园艺",
  },
  toys: {
    en: "Toys",
    zh: "玩具",
  },
  sports: {
    en: "Sports",
    zh: "运动用品",
  },
  beauty: {
    en: "Beauty",
    zh: "美容",
  },
  automotive: {
    en: "Automotive",
    zh: "汽车用品",
  },

  // Fee breakdown
  feeBreakdown: {
    en: "Fee Breakdown",
    zh: "费用明细",
  },
  amazonReferralFee: {
    en: "Amazon Referral Fee",
    zh: "亚马逊推荐费",
  },
  fbaFulfillmentFee: {
    en: "FBA Fulfillment Fee",
    zh: "FBA配送费",
  },
  monthlyStorageFee: {
    en: "Monthly Storage Fee",
    zh: "月度仓储费",
  },
  totalAmazonFees: {
    en: "Total Amazon Fees",
    zh: "亚马逊费用总计",
  },
  totalCosts: {
    en: "Total Costs",
    zh: "总成本",
  },
  grossProfit: {
    en: "Gross Profit",
    zh: "毛利润",
  },
  profitMargin: {
    en: "Profit Margin",
    zh: "利润率",
  },
  netProfit: {
    en: "Net Profit",
    zh: "净利润",
  },

  // Profit analysis
  profitAnalysis: {
    en: "Profit Analysis",
    zh: "利润分析",
  },
  breakEvenPrice: {
    en: "Break-even Price",
    zh: "盈亏平衡价格",
  },
  recommendedPrice: {
    en: "Recommended Price",
    zh: "建议价格",
  },
  roi: {
    en: "Return on Investment",
    zh: "投资回报率",
  },

  // Status indicators
  profitable: {
    en: "Profitable",
    zh: "盈利",
  },
  marginal: {
    en: "Marginal",
    zh: "微利",
  },
  unprofitable: {
    en: "Unprofitable",
    zh: "亏损",
  },

  // Placeholders
  enterAmount: {
    en: "Enter amount",
    zh: "输入金额",
  },
  enterWeight: {
    en: "Enter weight",
    zh: "输入重量",
  },
  enterDimension: {
    en: "Enter dimension",
    zh: "输入尺寸",
  },

  // Tips and guidelines
  fbaGuidelines: {
    en: "FBA Guidelines",
    zh: "FBA指南",
  },
  costOptimization: {
    en: "Cost Optimization",
    zh: "成本优化",
  },
  pricingStrategy: {
    en: "Pricing Strategy",
    zh: "定价策略",
  },
  fbaGuideTips: {
    en: "Consider all costs including product, shipping, and Amazon fees. Aim for 30%+ profit margin for sustainable business.",
    zh: "考虑所有成本，包括产品、运输和亚马逊费用。目标利润率30%+以确保业务可持续性。",
  },
  costOptimizationTips: {
    en: "Optimize product sourcing, negotiate better shipping rates, and consider product bundling to improve margins.",
    zh: "优化产品采购，协商更好的运输费率，考虑产品捆绑销售以提高利润率。",
  },
  pricingStrategyTips: {
    en: "Research competitor pricing, consider seasonal demand, and factor in advertising costs for realistic profit projections.",
    zh: "研究竞争对手定价，考虑季节性需求，将广告成本纳入现实利润预测。",
  },

  // Currency and formatting
  currency: {
    en: "Currency",
    zh: "货币",
  },
  percentage: {
    en: "%",
    zh: "%",
  },
  perUnit: {
    en: "per unit",
    zh: "每件",
  },
  perMonth: {
    en: "per month",
    zh: "每月",
  },

  // FBA Calculator - Additional translations
  productInformation: {
    en: "Product Information",
    zh: "产品信息",
  },
  dimensionsAndWeight: {
    en: "Dimensions & Weight",
    zh: "尺寸和重量",
  },
  calculationResults: {
    en: "Calculation Results",
    zh: "计算结果",
  },
  recommendations: {
    en: "Recommendations",
    zh: "建议",
  },
  enterProductDetails: {
    en: "Enter product cost and selling price to see calculations",
    zh: "输入产品成本和销售价格以查看计算结果",
  },
  profitableProduct: {
    en: "Profitable Product",
    zh: "盈利产品",
  },
  marginalProfit: {
    en: "Marginal Profit",
    zh: "微利产品",
  },
  unprofitableProduct: {
    en: "Unprofitable Product",
    zh: "亏损产品",
  },
  enterProductDetails: {
    en: "Enter your product details to calculate FBA profit margins",
    zh: "输入产品详情以计算FBA利润率",
  },

  // Amazon Profit Calculator
  amazonCalculator: {
    en: "Amazon Calculator",
    zh: "亚马逊计算器",
  },
  amazonCalculatorTitle: {
    en: "Amazon Profit Calculator",
    zh: "亚马逊利润计算器",
  },
  amazonCalculatorDescription: {
    en: "Comprehensive Amazon profit analysis including advertising costs, returns, and all associated expenses.",
    zh: "全面的亚马逊利润分析，包括广告费用、退货和所有相关支出。",
  },

  // Additional cost fields
  advertisingCosts: {
    en: "Advertising Costs (PPC)",
    zh: "广告费用 (PPC)",
  },
  returnRate: {
    en: "Return Rate (%)",
    zh: "退货率 (%)",
  },
  returnProcessingFee: {
    en: "Return Processing Fee",
    zh: "退货处理费",
  },
  miscellaneousExpenses: {
    en: "Miscellaneous Expenses",
    zh: "杂项费用",
  },
  longTermStorageFee: {
    en: "Long-term Storage Fee",
    zh: "长期仓储费",
  },
  removalFee: {
    en: "Removal Fee",
    zh: "移除费用",
  },
  inventoryPlacementFee: {
    en: "Inventory Placement Fee",
    zh: "库存配置费",
  },

  // Advanced calculations
  netProfitAfterExpenses: {
    en: "Net Profit After All Expenses",
    zh: "扣除所有费用后净利润",
  },
  totalExpenses: {
    en: "Total Expenses",
    zh: "总费用",
  },
  effectiveProfitMargin: {
    en: "Effective Profit Margin",
    zh: "有效利润率",
  },
  costPerAcquisition: {
    en: "Cost Per Acquisition (CPA)",
    zh: "获客成本 (CPA)",
  },
  advertisingCostOfSales: {
    en: "Advertising Cost of Sales (ACoS)",
    zh: "广告销售成本比 (ACoS)",
  },
  totalAdvertisingCost: {
    en: "Total Advertising Cost",
    zh: "总广告费用",
  },
  returnLosses: {
    en: "Return Losses",
    zh: "退货损失",
  },

  // Advanced analysis
  advancedAnalysis: {
    en: "Advanced Analysis",
    zh: "高级分析",
  },
  profitabilityScore: {
    en: "Profitability Score",
    zh: "盈利能力评分",
  },
  riskAssessment: {
    en: "Risk Assessment",
    zh: "风险评估",
  },
  lowRisk: {
    en: "Low Risk",
    zh: "低风险",
  },
  mediumRisk: {
    en: "Medium Risk",
    zh: "中等风险",
  },
  highRisk: {
    en: "High Risk",
    zh: "高风险",
  },

  // Placeholders and tips
  enterPercentage: {
    en: "Enter percentage",
    zh: "输入百分比",
  },
  advertisingTips: {
    en: "Advertising Tips",
    zh: "广告建议",
  },
  returnManagement: {
    en: "Return Management",
    zh: "退货管理",
  },
  expenseOptimization: {
    en: "Expense Optimization",
    zh: "费用优化",
  },
  advertisingTipsContent: {
    en: "Keep ACoS below 30% for healthy profit margins. Monitor keyword performance and adjust bids regularly.",
    zh: "保持ACoS低于30%以确保健康的利润率。监控关键词表现并定期调整出价。",
  },
  returnManagementContent: {
    en: "Minimize returns through accurate product descriptions, quality images, and proper packaging.",
    zh: "通过准确的产品描述、高质量图片和适当包装来减少退货。",
  },
  expenseOptimizationContent: {
    en: "Track all expenses carefully. Consider bulk shipping and inventory optimization to reduce costs.",
    zh: "仔细跟踪所有费用。考虑批量运输和库存优化以降低成本。",
  },

  // Status and recommendations
  excellent: {
    en: "Excellent",
    zh: "优秀",
  },
  good: {
    en: "Good",
    zh: "良好",
  },
  fair: {
    en: "Fair",
    zh: "一般",
  },
  poor: {
    en: "Poor",
    zh: "较差",
  },
  optimizeAdvertising: {
    en: "Optimize Advertising",
    zh: "优化广告",
  },
  reduceReturns: {
    en: "Reduce Returns",
    zh: "减少退货",
  },
  improveMargins: {
    en: "Improve Margins",
    zh: "提高利润率",
  },
  additionalExpenses: {
    en: "Additional Expenses",
    zh: "额外费用",
  },
}

// Unit translations
export const unitTranslations = {
  // Length units
  mm: {
    en: "Millimeters (mm)",
    zh: "毫米 (mm)",
  },
  cm: {
    en: "Centimeters (cm)",
    zh: "厘米 (cm)",
  },
  m: {
    en: "Meters (m)",
    zh: "米 (m)",
  },
  in: {
    en: "Inches (in)",
    zh: "英寸 (in)",
  },
  ft: {
    en: "Feet (ft)",
    zh: "英尺 (ft)",
  },
  yd: {
    en: "Yards (yd)",
    zh: "码 (yd)",
  },

  // Weight units
  mg: {
    en: "Milligrams (mg)",
    zh: "毫克 (mg)",
  },
  g: {
    en: "Grams (g)",
    zh: "克 (g)",
  },
  kg: {
    en: "Kilograms (kg)",
    zh: "千克 (kg)",
  },
  oz: {
    en: "Ounces (oz)",
    zh: "盎司 (oz)",
  },
  lb: {
    en: "Pounds (lb)",
    zh: "磅 (lb)",
  },
  ton: {
    en: "Tons (ton)",
    zh: "吨 (ton)",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  tUnit: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`)
      return key
    }
    return translations[key][language]
  }

  // Unit translation function
  const tUnit = (key: string): string => {
    if (!unitTranslations[key as keyof typeof unitTranslations]) {
      return key
    }
    return unitTranslations[key as keyof typeof unitTranslations][language]
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t, tUnit }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
