interface ApiResponse {
  code: number
  msg: string
  data: {
    count: number
    rates: {
      [key: string]: {
        name: string
        rate: number
      }
    }
    update_at: number
  }
  request_id: string
}

interface CachedRates {
  rates: Record<string, number>
  timestamp: number
  lastUpdate: number
}

const CACHE_DURATION = 60 * 60 * 1000 // 1 hour
const API_URL = "https://v2.xxapi.cn/api/allrates"

let cachedData: CachedRates | null = null

export async function getExchangeRates(): Promise<CachedRates> {
  // Return cached data if it's still fresh (less than 1 hour old)
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: ApiResponse = await response.json()

    if (data.code !== 200 || !data.data || !data.data.rates) {
      throw new Error(`API error: ${data.msg || "Unknown error"}`)
    }

    // The API returns USD-based rates, we need to convert to CNY-based rates
    const usdToCnyRate = data.data.rates.CNY?.rate || 7.1874733006
    const supportedCurrencies = ["USD", "EUR", "GBP", "JPY", "KRW", "HKD", "SGD", "AUD", "CAD"]
    const cnyBasedRates: Record<string, number> = {}

    // Convert USD-based rates to CNY-based rates
    // Formula: CNY to Target = (USD to Target) / (USD to CNY)
    supportedCurrencies.forEach((currency) => {
      if (data.data.rates[currency]) {
        const usdToTargetRate = data.data.rates[currency].rate
        // Convert to CNY base: 1 CNY = (usdToTargetRate / usdToCnyRate) Target Currency
        cnyBasedRates[currency] = usdToTargetRate / usdToCnyRate
      }
    })

    cachedData = {
      rates: cnyBasedRates,
      timestamp: Date.now(),
      lastUpdate: data.data.update_at,
    }

    console.log("Exchange rates updated:", {
      usdToCnyRate,
      cnyBasedRates,
      updateTime: new Date(data.data.update_at),
    })

    return cachedData
  } catch (error) {
    console.error("Failed to fetch exchange rates:", error)

    // Return cached data if available, even if stale
    if (cachedData) {
      console.warn("Using stale cached exchange rates")
      return cachedData
    }

    // Fallback rates if no cached data and API fails (CNY-based)
    console.warn("Using fallback exchange rates")
    return {
      rates: {
        USD: 0.1391, // 1 CNY ≈ 0.1391 USD
        EUR: 0.1287, // 1 CNY ≈ 0.1287 EUR
        GBP: 0.1103, // 1 CNY ≈ 0.1103 GBP
        JPY: 20.19, // 1 CNY ≈ 20.19 JPY
        KRW: 191.0, // 1 CNY ≈ 191.0 KRW
        HKD: 1.092, // 1 CNY ≈ 1.092 HKD
        SGD: 0.1789, // 1 CNY ≈ 0.1789 SGD
        AUD: 0.2139, // 1 CNY ≈ 0.2139 AUD
        CAD: 0.1904, // 1 CNY ≈ 0.1904 CAD
      },
      timestamp: Date.now(),
      lastUpdate: Date.now(),
    }
  }
}

// Function to force refresh rates (useful for manual refresh)
export async function refreshExchangeRates(): Promise<CachedRates> {
  cachedData = null // Clear cache to force refresh
  return getExchangeRates()
}

// Function to get currency metadata from API (for future use)
export async function getCurrencyMetadata(): Promise<Record<string, string>> {
  try {
    const response = await fetch(API_URL)
    const data: ApiResponse = await response.json()

    if (data.code === 200 && data.data?.rates) {
      const metadata: Record<string, string> = {}
      Object.entries(data.data.rates).forEach(([code, info]) => {
        metadata[code] = info.name
      })
      return metadata
    }
  } catch (error) {
    console.error("Failed to fetch currency metadata:", error)
  }

  return {}
}
