// Global/International banks fallback for unsupported countries
export const globalBanks: string[] = [
  // International presence
  'HSBC', 'Citibank', 'Standard Chartered', 'Deutsche Bank', 
  'BNP Paribas', 'Santander', 'ING Bank', 'Barclays',
  
  // North America (20 banks)
  'Chase Bank', 'Bank of America', 'Wells Fargo', 'TD Bank', 
  'RBC Royal Bank', 'BMO Bank of Montreal', 'Scotia Bank', 'Capital One',
  'U.S. Bank', 'PNC Bank', 'Truist Bank', 'Goldman Sachs Bank',
  'Morgan Stanley', 'Fifth Third Bank', 'KeyBank', 'Regions Bank',
  'M&T Bank', 'Huntington Bank', 'SunTrust Bank', 'BB&T',
  
  // Europe (20 banks)
  'Credit Suisse', 'UBS', 'Lloyds Bank', 'Intesa Sanpaolo',
  'Crédit Agricole', 'Société Générale', 'UniCredit', 'Rabobank',
  'Commerzbank', 'ABN AMRO', 'NatWest', 'Credit Mutuel',
  'Banca Monte dei Paschi', 'Banco Bilbao Vizcaya', 'CaixaBank',
  'Nordea Bank', 'Swedbank', 'DNB Bank', 'Danske Bank', 'KBC Bank',
  
  // Asia (20 banks)
  'ICBC', 'China Construction Bank', 'Agricultural Bank of China', 'Bank of China',
  'Mitsubishi UFJ', 'HDFC Bank', 'ICICI Bank', 'State Bank of India',
  'Sumitomo Mitsui', 'DBS Bank', 'Mizuho Bank', 'Bank of Communications',
  'Postal Savings Bank of China', 'Industrial Bank', 'China Merchants Bank',
  'Ping An Bank', 'Bank of Tokyo-Mitsubishi', 'Resona Bank', 'SMBC',
  'OCBC Bank',
  
  // Africa (20 banks)
  'Standard Bank', 'FirstRand', 'Nedbank', 'Absa Group',
  'Ecobank', 'Access Bank', 'Zenith Bank', 'Equity Bank',
  'KCB Bank', 'Stanbic Bank', 'United Bank for Africa', 'GTBank',
  'Fidelity Bank', 'Union Bank', 'Sterling Bank', 'FCMB',
  'Diamond Trust Bank', 'I&M Bank', 'Family Bank', 'Cooperative Bank', 'Moniepoint', 'Kuda Bank', 'Providus Bank', 'Palmpay', 
  
  // South America (20 banks)
  'Banco do Brasil', 'Itaú Unibanco', 'Bradesco', 'Santander Brasil',
  'Banco de Chile', 'Bancolombia', 'BBVA Colombia', 'Banco Nacional',
  'Banesco', 'Banco Pichincha', 'Banco de Crédito del Perú', 'Interbank',
  'Banco Galicia', 'Banco Macro', 'Banco Santander Rio', 'BBVA Argentina',
  'Banco de Venezuela', 'Mercantil Bank', 'Banco Provincial', 'Banorte',
  
  // Australia/Oceania (20 banks)
  'Commonwealth Bank', 'Westpac', 'ANZ Bank', 'NAB',
  'ASB Bank', 'Bank of New Zealand', 'Kiwibank', 'Suncorp Bank',
  'Bendigo Bank', 'ING Australia', 'Macquarie Bank', 'Adelaide Bank',
  'Heritage Bank', 'Bank of Queensland', 'ME Bank', 'AMP Bank',
  'Teachers Mutual Bank', 'Newcastle Permanent', 'Bankwest', 'St.George Bank',
  
  'Other'
]

// Bank suggestions organized by country for location-based UX
export const banksByCountry: Record<string, string[]> = {
  // 🇺🇸 United States
  'US': [
    'Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank', 'Capital One',
    'PNC Bank', 'TD Bank', 'U.S. Bank', 'Truist Bank', 'Goldman Sachs Bank',
    'American Express', 'Discover Bank', 'Other'
  ],
  
  // 🇳🇬 Nigeria
  'NG': [
    'Access Bank', 'Ecobank Nigeria', 'FCMB', 'First Bank Nigeria', 
    'GTBank', 'Jaiz Bank', 'Keystone Bank', 'Kuda Bank', 'Palmpay', 'Polaris Bank', 
    'Providus Bank', 'UBA', 'Zenith Bank', 'Wema Bank', 'Union Bank', 
    'Stanbic IBTC Bank', 'Opay', 'Moniepoint'
  ],
  
  // 🇬🇧 United Kingdom
  'GB': [
    'Barclays', 'HSBC UK', 'Lloyds Bank', 'NatWest', 'Santander UK',
    'TSB Bank', 'Metro Bank', 'Nationwide', 'Halifax', 'Bank of Scotland',
    'Monzo', 'Starling Bank', 'Revolut', 'First Direct', 'Other'
  ],
  
  // 🇰🇪 Kenya
  'KE': [
    'Equity Bank', 'KCB Bank', 'Cooperative Bank', 'Standard Chartered Kenya',
    'Absa Bank Kenya', 'NCBA Bank', 'Diamond Trust Bank', 'I&M Bank',
    'Family Bank', 'Stanbic Bank Kenya', 'CBA Bank', 'HFC Bank', 'Other'
  ],
  
  // 🇿🇦 South Africa
  'ZA': [
    'Standard Bank', 'FNB', 'Absa Bank', 'Nedbank', 'Capitec Bank',
    'African Bank', 'Investec', 'TymeBank', 'Discovery Bank', 'Bidvest Bank',
    'Mercantile Bank', 'Other'
  ],
  
  // 🇬🇭 Ghana
  'GH': [
    'MTN MoMo', 'GCB Bank', 'Ecobank Ghana', 'Standard Chartered Ghana', 'Stanbic Bank Ghana',
    'Absa Bank Ghana', 'CalBank', 'Fidelity Bank Ghana', 'ADB Bank',
    'Republic Bank Ghana', 'Zenith Bank Ghana', 'Access Bank Ghana', 'Other'
  ],
  
  // 🇨🇦 Canada
  'CA': [
    'RBC Royal Bank', 'TD Canada Trust', 'Bank of Nova Scotia', 'BMO Bank of Montreal',
    'CIBC', 'National Bank of Canada', 'Desjardins', 'ATB Financial',
    'Tangerine', 'Simplii Financial', 'Other'
  ],
  
  // 🇮🇳 India
  'IN': [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra Bank',
    'Punjab National Bank', 'Bank of Baroda', 'Canara Bank', 'Union Bank of India',
    'Yes Bank', 'IndusInd Bank', 'IDFC First Bank', 'Paytm Payments Bank', 'Other'
  ],
  
  // 🇦🇺 Australia
  'AU': [
    'Commonwealth Bank', 'Westpac', 'ANZ Bank', 'NAB', 'Macquarie Bank',
    'ING Australia', 'Bendigo Bank', 'Bank of Queensland', 'Suncorp Bank',
    'Adelaide Bank', 'Heritage Bank', 'Other'
  ],
  
  // 🇦🇪 UAE
  'AE': [
    'Emirates NBD', 'First Abu Dhabi Bank', 'ADCB', 'Dubai Islamic Bank',
    'Mashreq Bank', 'RAK Bank', 'HSBC UAE', 'Standard Chartered UAE',
    'CBD Bank', 'ENBD Islamic', 'Abu Dhabi Islamic Bank', 'Other'
  ]
}

// Country name mapping for display
export const countryNames: Record<string, string> = {
  'US': 'United States',
  'NG': 'Nigeria', 
  'GB': 'United Kingdom',
  'KE': 'Kenya',
  'ZA': 'South Africa',
  'GH': 'Ghana',
  'CA': 'Canada',
  'IN': 'India',
  'AU': 'Australia',
  'AE': 'United Arab Emirates'
}

// Get user's country via IP geolocation
export const getUserCountry = async (): Promise<{ countryCode: string; countryName: string }> => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return {
      countryCode: data.country_code || 'US',
      countryName: data.country_name || countryNames[data.country_code] || 'United States'
    }
  } catch (error) {
    return {
      countryCode: 'US',
      countryName: 'United States'
    }
  }
}

// Get banks for a specific country
export const getBanksForCountry = (countryCode: string): string[] => {
  return banksByCountry[countryCode] || globalBanks
}

// Search banks with debounce support
export const searchBanks = (banks: string[], query: string): string[] => {
  if (!query.trim()) return banks
  
  const normalizedQuery = query.toLowerCase().trim()
  return banks.filter(bank => 
    bank.toLowerCase().includes(normalizedQuery)
  )
} 