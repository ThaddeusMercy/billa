"use client"

export const dynamic = 'force-dynamic'

import { useState, useRef, useCallback, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { 
  ArrowLeft, 
  Building2,
  Wallet, 
  Smartphone,
  CreditCard,
  Bitcoin,
  DollarSign,
  Check,
  AlertCircle,
  Plus,
  Search,
  ChevronUp,
  ChevronDown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useAuthContext } from "@/contexts/AuthContext"
import { usePaymentMethods } from "@/hooks/usePaymentMethods"
import { getUserCountry, getBanksForCountry, globalBanks, searchBanks } from "@/utils/banks"
import { categories, cryptoNetworks, getCryptoIcon, digitalWallets, colorOptions, getDefaultIcon } from "./data"

function AddPaymentPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { paymentMethods, setPaymentMethods } = useAuthContext()
  const { addPaymentMethod, updatePaymentMethod, loading: isSubmitting } = usePaymentMethods(paymentMethods, setPaymentMethods)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    bankName: '',
    customBankName: '',
    accountNumber: '',
    accountName: '',
    routingNumber: '',
    coinName: '',
    network: '',
    customNetwork: '',
    walletAddress: '',
    digitalWalletType: '',
    digitalWalletId: '',
    customDigitalWallet: '',
    tag: ''
  })
  const [selectedColor, setSelectedColor] = useState('blue')
  const [bankTypes, setBankTypes] = useState<string[]>([])
  const [userCountry, setUserCountry] = useState<string>('US')
  const [loadingBanks, setLoadingBanks] = useState(false)
  const [isTestMode, setIsTestMode] = useState(false)
  const [bankSearchQuery, setBankSearchQuery] = useState('')
  const [filteredBanks, setFilteredBanks] = useState<string[]>([])
  const [showBankDropdown, setShowBankDropdown] = useState(false)
  const [cryptoSearchQuery, setCryptoSearchQuery] = useState('')
  const [filteredCryptos, setFilteredCryptos] = useState<{ value: string; label: string; icon: string }[]>([])
  const [showCryptoDropdown, setShowCryptoDropdown] = useState(false)
  const [digitalWalletSearchQuery, setDigitalWalletSearchQuery] = useState('')
  const [filteredDigitalWallets, setFilteredDigitalWallets] = useState<{ value: string; label: string; icon: string }[]>([])
  const [showDigitalWalletDropdown, setShowDigitalWalletDropdown] = useState(false)
  const [isCountryTesterCollapsed, setIsCountryTesterCollapsed] = useState(true)

  // Edit mode detection and data parsing
  const editId = searchParams.get('edit')
  const isEditMode = Boolean(editId)
  const editData = searchParams.get('data')

  // Load banks based on user location or URL parameter
  useEffect(() => {
    const loadBanksByLocation = async () => {
      setLoadingBanks(true)
      try {
        // Check for testing override via URL parameter
        const testCountry = searchParams.get('country')
        
        let countryCode: string
        let countryName: string
        
        if (testCountry && getBanksForCountry(testCountry.toUpperCase()).length > 0) {
          // Use test country from URL
          countryCode = testCountry.toUpperCase()
          countryName = `${testCountry.toUpperCase()} (Testing Mode)`
          setIsTestMode(true)
        } else {
          // Use real geolocation
          const result = await getUserCountry()
          countryCode = result.countryCode
          countryName = result.countryName
          setIsTestMode(false)
        }
        
        setUserCountry(countryCode)
        setBankTypes(getBanksForCountry(countryCode))
        
        // Show user which country was detected (only in add mode)
        if (!isEditMode) {
          const toastType = isTestMode ? 'info' : 'success'
          toast[toastType](`Banks loaded for ${countryName}`, {
            description: `Found ${getBanksForCountry(countryCode).length - 1} popular banks`
          })
        }
      } catch (error) {
        // Fallback to US banks
        setUserCountry('US')
        setBankTypes(getBanksForCountry('US'))
        setIsTestMode(false)
        console.log('Location detection failed, using US banks')
      } finally {
        setLoadingBanks(false)
      }
    }
    
    loadBanksByLocation()
  }, [searchParams, isEditMode])

  // Debounce bank search
  useEffect(() => {
    const timer = setTimeout(() => {
      const banksForCountry = getBanksForCountry(userCountry);
      if (bankSearchQuery.trim()) {
        // Combine country-specific and global banks for a comprehensive search
        const allBanksToSearch = [...new Set([...banksForCountry, ...globalBanks])];
        const filtered = searchBanks(allBanksToSearch, bankSearchQuery);
        setFilteredBanks(filtered);
      } else {
        // Show only country-specific banks when not searching
        setFilteredBanks(banksForCountry);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [bankSearchQuery, userCountry, bankTypes]);

  // Initialize filtered banks when bankTypes changes
  useEffect(() => {
    setFilteredBanks(bankTypes)
  }, [bankTypes])

  // Debounce crypto search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (cryptoSearchQuery.trim()) {
        const filtered = cryptoNetworks.filter(crypto => 
          crypto.label.toLowerCase().includes(cryptoSearchQuery.toLowerCase()) ||
          crypto.value.toLowerCase().includes(cryptoSearchQuery.toLowerCase())
        )
        setFilteredCryptos(filtered)
      } else {
        setFilteredCryptos(cryptoNetworks)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [cryptoSearchQuery])

  // Initialize filtered cryptos when component mounts
  useEffect(() => {
    setFilteredCryptos(cryptoNetworks)
  }, [])

  // Debounce digital wallet search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (digitalWalletSearchQuery.trim()) {
        const filtered = digitalWallets.filter(wallet => 
          wallet.label.toLowerCase().includes(digitalWalletSearchQuery.toLowerCase()) ||
          wallet.value.toLowerCase().includes(digitalWalletSearchQuery.toLowerCase())
        )
        setFilteredDigitalWallets(filtered)
      } else {
        setFilteredDigitalWallets(digitalWallets)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [digitalWalletSearchQuery])

  // Initialize filtered digital wallets when component mounts
  useEffect(() => {
    setFilteredDigitalWallets(digitalWallets)
  }, [])

  useEffect(() => {
    if (isEditMode && editData) {
      try {
        const paymentMethod = JSON.parse(decodeURIComponent(editData))
        
        // Set the category based on the payment method
        setSelectedCategory(paymentMethod.category)
        
        // Pre-fill form data based on the actual data structure
        if (paymentMethod.category === 'crypto') {
          const networkValue = paymentMethod.network || 'bitcoin'
          const isCustomNetwork = !cryptoNetworks.find(n => n.value === networkValue)
          
          setFormData(prev => ({
            ...prev,
            coinName: paymentMethod.coin_name || paymentMethod.type,
            network: isCustomNetwork ? 'other' : networkValue,
            customNetwork: isCustomNetwork ? networkValue : '',
            walletAddress: paymentMethod.wallet_address || paymentMethod.identifier
          }))
        } else if (paymentMethod.category === 'bank') {
          const bankName = paymentMethod.bank_name || paymentMethod.type
          const currentBanks = getBanksForCountry(userCountry)
          const isCustomBank = !currentBanks.includes(bankName)
          
          setFormData(prev => ({
            ...prev,
            bankName: isCustomBank ? 'Other' : bankName,
            customBankName: isCustomBank ? bankName : '',
            accountNumber: paymentMethod.account_number || '',
            accountName: paymentMethod.account_name || '',
            routingNumber: paymentMethod.routing_number || ''
          }))
        } else if (paymentMethod.category === 'digital') {
          const digitalWalletType = paymentMethod.digital_wallet_type || paymentMethod.type.toLowerCase().replace(' ', '')
          const isCustomWallet = !digitalWallets.find(w => w.value === digitalWalletType)
          
          setFormData(prev => ({
            ...prev,
            digitalWalletType: isCustomWallet ? 'other' : digitalWalletType,
            customDigitalWallet: isCustomWallet ? (paymentMethod.digital_wallet_type || paymentMethod.type) : '',
            digitalWalletId: paymentMethod.digital_wallet_id || paymentMethod.identifier
          }))
        }
        
        // Set color if available
        if (paymentMethod.selected_color) {
          setSelectedColor(paymentMethod.selected_color)
        }
        
        // Set tag if available
        if (paymentMethod.tag) {
          setFormData(prev => ({
            ...prev,
            tag: paymentMethod.tag
          }))
        }
      } catch (error) {
        console.error('Error parsing edit data:', error)
        toast.error('Error loading payment method data')
      }
    }
  }, [isEditMode, editData])

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      let paymentMethodData: any = {
        category: selectedCategory,
        selected_color: selectedColor,
        icon_type: 'emoji',
        icon_value: getDefaultIcon(selectedCategory),
        tag: formData.tag || null,
      }

      if (selectedCategory === 'bank') {
        const bankName = formData.bankName === 'Other' ? formData.customBankName : formData.bankName
        paymentMethodData = {
          ...paymentMethodData,
          type: bankName,
          label: bankName,
          identifier: `****${formData.accountNumber.slice(-4)}`,
          bank_name: bankName,
          account_number: formData.accountNumber,
          account_name: formData.accountName,
          routing_number: formData.routingNumber || null,
        }
      } else if (selectedCategory === 'crypto') {
        const network = cryptoNetworks.find(n => n.value === formData.network)
        const networkName = formData.network === 'other' ? formData.customNetwork : (network?.label || formData.network)
        const networkIcon = formData.network === 'other' ? '💰' : getCryptoIcon(formData.network)
        
        paymentMethodData = {
          ...paymentMethodData,
          type: networkName,
          label: networkName,
          identifier: `${formData.walletAddress.slice(0, 6)}...${formData.walletAddress.slice(-6)}`,
          coin_name: networkName,
          network: formData.network === 'other' ? formData.customNetwork : formData.network,
          wallet_address: formData.walletAddress,
          icon_value: networkIcon,
        }
      } else if (selectedCategory === 'digital') {
        const wallet = digitalWallets.find(w => w.value === formData.digitalWalletType)
        const walletName = formData.digitalWalletType === 'other' ? formData.customDigitalWallet : (wallet?.label || formData.digitalWalletType)
        const walletIcon = formData.digitalWalletType === 'other' ? '💳' : (wallet?.icon || '💳')
        
        paymentMethodData = {
          ...paymentMethodData,
          type: walletName,
          label: walletName,
          identifier: formData.digitalWalletId,
          digital_wallet_type: formData.digitalWalletType === 'other' ? formData.customDigitalWallet : formData.digitalWalletType,
          digital_wallet_id: formData.digitalWalletId,
          icon_value: walletIcon,
        }
      }

      if (isEditMode && editId) {
        await updatePaymentMethod(editId, paymentMethodData)
      } else {
        await addPaymentMethod(paymentMethodData)
      }
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error saving payment method:', error)
    }
  }

  const isFormValid = () => {
    if (selectedCategory === 'bank') {
      const bankNameValid = formData.bankName === 'Other' ? formData.customBankName.trim() : formData.bankName
      return bankNameValid && formData.accountNumber && formData.accountName
    }
    if (selectedCategory === 'crypto') {
      const networkValid = formData.network === 'other' ? formData.customNetwork.trim() : formData.network
      return networkValid && formData.walletAddress
    }
    if (selectedCategory === 'digital') {
      const walletTypeValid = formData.digitalWalletType === 'other' ? formData.customDigitalWallet.trim() : formData.digitalWalletType
      return walletTypeValid && formData.digitalWalletId
    }
    return false
  }

  const resetForm = () => {
    setSelectedCategory(null)
    setSelectedType(null)
    setSelectedColor('blue')
    setFormData({
      bankName: '',
      customBankName: '',
      accountNumber: '',
      accountName: '',
      routingNumber: '',
      coinName: '',
      network: '',
      customNetwork: '',
      walletAddress: '',
      digitalWalletType: '',
      digitalWalletId: '',
      customDigitalWallet: '',
      tag: ''
    })
  }

  // Country Testing Interface Component
  const CountryTester = () => {
    const countries = [
      // Supported countries
      { code: 'US', name: 'United States', flag: '🇺🇸', supported: true },
      { code: 'NG', name: 'Nigeria', flag: '🇳🇬', supported: true },
      { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', supported: true },
      { code: 'KE', name: 'Kenya', flag: '🇰🇪', supported: true },
      { code: 'ZA', name: 'South Africa', flag: '🇿🇦', supported: true },
      { code: 'GH', name: 'Ghana', flag: '🇬🇭', supported: true },
      { code: 'CA', name: 'Canada', flag: '🇨🇦', supported: true },
      { code: 'IN', name: 'India', flag: '🇮🇳', supported: true },
      { code: 'AU', name: 'Australia', flag: '🇦🇺', supported: true },
      { code: 'AE', name: 'UAE', flag: '🇦🇪', supported: true },
      
      // Unsupported countries (to test global banks)
      { code: 'DE', name: 'Germany', flag: '🇩🇪', supported: false },
      { code: 'FR', name: 'France', flag: '🇫🇷', supported: false },
      { code: 'JP', name: 'Japan', flag: '🇯🇵', supported: false },
      { code: 'BR', name: 'Brazil', flag: '🇧🇷', supported: false },
      { code: 'MX', name: 'Mexico', flag: '🇲🇽', supported: false },
      { code: 'XX', name: 'Global Banks', flag: '🌍', supported: false }
    ]

    if (process.env.NODE_ENV !== 'development') return null

    return (
      <div className="fixed bottom-4 right-4 bg-white border-2 border-gray-200 rounded-xl shadow-lg z-50 transition-all duration-200">
        {isCountryTesterCollapsed ? (
          // Collapsed State
          <div className="p-2">
            <button
              onClick={() => setIsCountryTesterCollapsed(false)}
              className="flex items-center gap-2 text-xs font-medium text-gray-600 hover:text-gray-800 transition-colors"
              title="Expand Country Tester"
            >
              <span>🧪</span>
              <span className="hidden sm:inline">Country Tester</span>
              <ChevronUp className="h-3 w-3" />
            </button>
            <div className="text-[10px] text-gray-500 text-center mt-1">
              {isTestMode ? 
                `${userCountry}${bankTypes === globalBanks ? ' (Global)' : ''}` : 
                'Auto'}
            </div>
          </div>
        ) : (
          // Expanded State
          <div className="p-3 sm:p-4 max-w-xs sm:max-w-sm">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="font-bold text-xs sm:text-sm">🧪 Country Tester</h3>
              <div className="flex items-center gap-2">
                <a 
                  href="/add-payment" 
                  className="text-xs text-blue-600 hover:underline"
                  title="Reset to auto-detect"
                >
                  Reset
                </a>
                <button
                  onClick={() => setIsCountryTesterCollapsed(true)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  title="Collapse Country Tester"
                >
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            </div>
            
            {/* Supported Countries */}
            <div className="mb-2 sm:mb-3">
              <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2">Supported Countries:</p>
              <div className="grid grid-cols-3 sm:grid-cols-2 gap-1 text-xs">
                {countries.filter(c => c.supported).map(country => (
                  <a
                    key={country.code}
                    href={`/add-payment?country=${country.code.toLowerCase()}`}
                    className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded text-center transition-colors ${
                      userCountry === country.code && isTestMode
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-blue-100 text-gray-700'
                    }`}
                    title={`Test ${country.name} banks`}
                  >
                    <span className="text-[10px] sm:text-xs">{country.flag} {country.code}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Unsupported Countries */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2">Test Global Banks:</p>
              <div className="grid grid-cols-3 sm:grid-cols-2 gap-1 text-xs">
                {countries.filter(c => !c.supported).map(country => (
                  <a
                    key={country.code}
                    href={`/add-payment?country=${country.code.toLowerCase()}`}
                    className={`px-1.5 py-1 sm:px-2 sm:py-1 rounded text-center transition-colors ${
                      userCountry === country.code && isTestMode
                        ? 'bg-orange-500 text-white'
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200'
                    }`}
                    title={`Test global banks (${country.name})`}
                  >
                    <span className="text-[10px] sm:text-xs">
                      {country.flag} {country.code === 'XX' ? 'Global' : country.code}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-2 text-xs text-gray-500 text-center">
              {isTestMode ? 
                `Testing: ${userCountry}${bankTypes === globalBanks ? ' (Global Banks)' : ''}` : 
                'Auto-detected'}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <CountryTester />
      <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:p-6 space-y-6 sm:space-y-8 min-h-screen">
        {/* Header */}
        <div className="space-y-3 sm:space-y-0">
          {/* Back button - separate row on mobile */}
          <div className="sm:hidden">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                if (isEditMode) {
                  router.back()
                } else if (selectedCategory) {
                  resetForm()
                } else {
                  router.back()
                }
              }}
              className="text-black/60 hover:text-black -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Back</span>
            </Button>
          </div>

          {/* Title section - full width on mobile, with back button on desktop */}
          <div className="flex items-center gap-4">
            {/* Back button - only on desktop */}
            <div className="hidden sm:block">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  if (isEditMode) {
                    router.back()
                  } else if (selectedCategory) {
                    resetForm()
                  } else {
                    router.back()
                  }
                }}
                className="text-black/60 hover:text-black shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isEditMode ? 'Back' : (selectedCategory ? 'Back to Categories' : 'Back')}
              </Button>
            </div>

            {/* Title and description */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-2xl font-bold text-black leading-tight">
                {isEditMode ? 'Edit Payment Method' : 'Add Payment Method'}
              </h1>
              <p className="text-sm sm:text-base text-black/60 mt-1 leading-relaxed">
                {isEditMode ? 'Update your payment information' : 'Choose how you want to receive payments'}
              </p>
            </div>
          </div>
        </div>

        {(!selectedCategory && !isEditMode) ? (
          /* Category Selection */
          <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
            <div className="grid gap-3 sm:gap-4">
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 transition-all hover:scale-[1.02] active:scale-[0.98] ${category.color} hover:shadow-md`}
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shrink-0">
                        <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${category.iconColor}`} />
                      </div>
                      <div className="text-left flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg">{category.title}</h3>
                        <p className="text-xs sm:text-sm opacity-80 mt-0.5">{category.description}</p>
                      </div>
                      <div className="shrink-0">
                        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-current rounded-full flex items-center justify-center opacity-60">
                          <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          /* Form Based on Category */
          <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-0">
            <div className="bg-black/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full overflow-hidden">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shrink-0">
                  {selectedCategory === 'bank' && <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />}
                  {selectedCategory === 'crypto' && <Bitcoin className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />}
                  {selectedCategory === 'digital' && <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-black">
                  {categories.find(c => c.id === selectedCategory)?.title}
                </h2>
              </div>

              {selectedCategory === 'bank' && (
                <div className="space-y-4 w-full">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Bank Name</label>
                    
                    {/* Search Input */}
                    <div className="relative mb-2 w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={bankSearchQuery}
                        onChange={(e) => setBankSearchQuery(e.target.value)}
                        onFocus={() => setShowBankDropdown(true)}
                        placeholder={`Search banks ${userCountry ? `(${userCountry})` : ''}...`}
                        className="w-full pl-10 rounded-xl border-black/20 text-base sm:text-sm"
                        disabled={loadingBanks}
                      />
                    </div>

                    {/* Custom Dropdown */}
                    {showBankDropdown && !loadingBanks && (
                      <div className="relative w-full">
                        <div className="absolute top-0 left-0 right-0 bg-white border border-black/20 rounded-xl shadow-lg max-h-40 sm:max-h-48 overflow-y-auto z-10">
                          {filteredBanks.length > 0 ? (
                            filteredBanks.map((bank) => (
                              <button
                                key={bank}
                                onClick={() => {
                                  setFormData({...formData, bankName: bank, customBankName: bank !== 'Other' ? '' : formData.customBankName})
                                  setBankSearchQuery(bank)
                                  setShowBankDropdown(false)
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm sm:text-base ${
                                  formData.bankName === bank ? 'bg-blue-50 text-blue-700' : ''
                                }`}
                              >
                                {bank}
                                {bank === 'Other' && ' (Not listed)'}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-sm">
                              No banks found. Try "Other" to add custom bank.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Click outside to close dropdown */}
                    {showBankDropdown && (
                      <div 
                        className="fixed inset-0 z-5"
                        onClick={() => setShowBankDropdown(false)}
                      />
                    )}

                    {/* Help text */}
                    {formData.bankName !== 'Other' && (
                      <p className="text-xs text-black/50 mt-2 leading-relaxed">
                        {loadingBanks ? "Loading banks..." : 
                         bankTypes === globalBanks ? 
                         "Showing international banks • Don't see your local bank? Select 'Other'" :
                         "Showing local banks • Type to search globally • Don't see your bank? Select 'Other'"}
                      </p>
                    )}
                  </div>

                  {formData.bankName === 'Other' && (
                    <div className="animate-in slide-in-from-top duration-300 w-full">
                      <label className="block text-sm font-medium text-black/70 mb-2">Enter Bank Name</label>
                      <Input
                        value={formData.customBankName}
                        onChange={(e) => setFormData({...formData, customBankName: e.target.value})}
                        placeholder="Enter your bank name"
                        className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                      />
                    </div>
                  )}

                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Account Number</label>
                    <Input
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                      placeholder="Enter your account number"
                      className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Account Name</label>
                    <Input
                      value={formData.accountName}
                      onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                      placeholder="Your full name as it appears on account"
                      className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Routing Number (Optional)</label>
                    <Input
                      value={formData.routingNumber}
                      onChange={(e) => setFormData({...formData, routingNumber: e.target.value})}
                      placeholder="9-digit routing number"
                      className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Tag (Optional)</label>
                    <Input
                      value={formData.tag}
                      onChange={(e) => setFormData({...formData, tag: e.target.value})}
                      placeholder="e.g. shoes, vacation, business"
                      className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                      maxLength={20}
                    />
                    <p className="text-xs text-black/50 mt-1 leading-relaxed">
                      Add a tag to categorize this payment method for easy identification
                    </p>
                  </div>
                </div>
              )}

              {selectedCategory === 'crypto' && (
                <div className="space-y-4 w-full">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Cryptocurrency</label>
                    
                    {/* Search Input */}
                    <div className="relative mb-2 w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={cryptoSearchQuery}
                        onChange={(e) => setCryptoSearchQuery(e.target.value)}
                        onFocus={() => setShowCryptoDropdown(true)}
                        placeholder="Search cryptocurrency networks..."
                        className="w-full pl-10 rounded-xl border-black/20 text-base sm:text-sm"
                      />
                    </div>

                    {/* Custom Dropdown */}
                    {showCryptoDropdown && (
                      <div className="relative w-full">
                        <div className="absolute top-0 left-0 right-0 bg-white border border-black/20 rounded-xl shadow-lg max-h-40 sm:max-h-48 overflow-y-auto z-10">
                          {filteredCryptos.length > 0 ? (
                            filteredCryptos.map((crypto) => (
                              <button
                                key={crypto.value}
                                onClick={() => {
                                  setFormData({...formData, network: crypto.value, customNetwork: crypto.value !== 'other' ? '' : formData.customNetwork})
                                  setCryptoSearchQuery(crypto.label)
                                  setShowCryptoDropdown(false)
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm sm:text-base ${
                                  formData.network === crypto.value ? 'bg-orange-50 text-orange-700' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{crypto.icon}</span>
                                  <span>{crypto.label}</span>
                                  {crypto.value === 'other' && ' (Not listed)'}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-sm">
                              No networks found. Try "Other" to add custom network.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Click outside to close dropdown */}
                    {showCryptoDropdown && (
                      <div 
                        className="fixed inset-0 z-5"
                        onClick={() => setShowCryptoDropdown(false)}
                      />
                    )}

                    {/* Help text */}
                    <p className="text-xs text-black/50 mt-2 leading-relaxed">
                      Don't see your network? Select 'Other' to add a custom network
                    </p>
                  </div>

                  {formData.network === 'other' && (
                    <div className="animate-in slide-in-from-top duration-300 w-full">
                      <label className="block text-sm font-medium text-black/70 mb-2">Enter Network Name</label>
                      <Input
                        value={formData.customNetwork}
                        onChange={(e) => setFormData({...formData, customNetwork: e.target.value})}
                        placeholder="Enter the network name (e.g., Arbitrum, Optimism)"
                        className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                      />
                    </div>
                  )}

                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Wallet Address</label>
                    <Input
                      value={formData.walletAddress}
                      onChange={(e) => setFormData({...formData, walletAddress: e.target.value})}
                      placeholder="Enter your wallet address"
                      className="w-full rounded-xl border-black/20 font-mono text-sm break-all"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Tag (Optional)</label>
                    <Input
                      value={formData.tag}
                      onChange={(e) => setFormData({...formData, tag: e.target.value})}
                      placeholder="e.g. shoes, vacation, business"
                      className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                      maxLength={20}
                    />
                    <p className="text-xs text-black/50 mt-1 leading-relaxed">
                      Add a tag to categorize this payment method for easy identification
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 sm:p-4 w-full">
                    <div className="flex gap-3">
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-blue-700">
                        <p className="font-medium mb-1">Important:</p>
                        <p className="leading-relaxed">Make sure this wallet address is correct. Payments sent to wrong addresses cannot be recovered.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedCategory === 'digital' && (
                <div className="space-y-4 w-full">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Digital Wallet</label>
                    
                    {/* Search Input */}
                    <div className="relative mb-2 w-full">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={digitalWalletSearchQuery}
                        onChange={(e) => setDigitalWalletSearchQuery(e.target.value)}
                        onFocus={() => setShowDigitalWalletDropdown(true)}
                        placeholder="Search digital wallets..."
                        className="w-full pl-10 rounded-xl border-black/20 text-base sm:text-sm"
                      />
                    </div>

                    {/* Custom Dropdown */}
                    {showDigitalWalletDropdown && (
                      <div className="relative w-full">
                        <div className="absolute top-0 left-0 right-0 bg-white border border-black/20 rounded-xl shadow-lg max-h-40 sm:max-h-48 overflow-y-auto z-10">
                          {filteredDigitalWallets.length > 0 ? (
                            filteredDigitalWallets.map((wallet) => (
                              <button
                                key={wallet.value}
                                onClick={() => {
                                  setFormData({...formData, digitalWalletType: wallet.value, customDigitalWallet: wallet.value !== 'other' ? '' : formData.customDigitalWallet})
                                  setDigitalWalletSearchQuery(wallet.label)
                                  setShowDigitalWalletDropdown(false)
                                }}
                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm sm:text-base ${
                                  formData.digitalWalletType === wallet.value ? 'bg-purple-50 text-purple-700' : ''
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{wallet.icon}</span>
                                  <span>{wallet.label}</span>
                                  {wallet.value === 'other' && ' (Not listed)'}
                                </div>
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-500 text-sm">
                              No wallets found. Try "Other" to add custom wallet.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Click outside to close dropdown */}
                    {showDigitalWalletDropdown && (
                      <div 
                        className="fixed inset-0 z-5"
                        onClick={() => setShowDigitalWalletDropdown(false)}
                      />
                    )}

                    {/* Help text */}
                    <p className="text-xs text-black/50 mt-2 leading-relaxed">
                      Don't see your wallet? Select 'Other' to add a custom wallet
                    </p>
                  </div>

                  {formData.digitalWalletType === 'other' && (
                    <div className="animate-in slide-in-from-top duration-300 w-full">
                      <label className="block text-sm font-medium text-black/70 mb-2">Enter Wallet Name</label>
                      <Input
                        value={formData.customDigitalWallet}
                        onChange={(e) => setFormData({...formData, customDigitalWallet: e.target.value})}
                        placeholder="Enter the wallet name (e.g., Revolut, Wise, Skrill)"
                        className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                      />
                    </div>
                  )}

                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">
                      {formData.digitalWalletType === 'paypal' ? 'PayPal Email' :
                       formData.digitalWalletType === 'venmo' ? 'Venmo Username' :
                       formData.digitalWalletType === 'cashapp' ? 'Cash App Tag' :
                       formData.digitalWalletType === 'other' ? 'Account ID or Email' :
                       'Account ID or Email'}
                    </label>
                    <Input
                      value={formData.digitalWalletId}
                      onChange={(e) => setFormData({...formData, digitalWalletId: e.target.value})}
                      placeholder={
                        formData.digitalWalletType === 'paypal' ? 'your.email@example.com' :
                        formData.digitalWalletType === 'venmo' ? '@username' :
                        formData.digitalWalletType === 'cashapp' ? '$cashtag' :
                        formData.digitalWalletType === 'other' ? 'Enter your account identifier' :
                        'Enter your account identifier'
                      }
                      className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                    />
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-black/70 mb-2">Tag (Optional)</label>
                    <Input
                      value={formData.tag}
                      onChange={(e) => setFormData({...formData, tag: e.target.value})}
                      placeholder="e.g. shoes, vacation, business"
                      className="w-full rounded-xl border-black/20 text-base sm:text-sm"
                      maxLength={20}
                    />
                    <p className="text-xs text-black/50 mt-1 leading-relaxed">
                      Add a tag to categorize this payment method for easy identification
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Color Selection */}
            <div className="bg-black/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 w-full overflow-hidden">
              <h3 className="text-base sm:text-lg font-semibold text-black mb-3 sm:mb-4">Choose Color</h3>
              <p className="text-xs sm:text-sm text-black/60 mb-3 sm:mb-4">Select a color for your payment method card</p>
              
              <div className="flex flex-wrap gap-2 mb-4 w-full">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`relative w-10 h-10 sm:w-8 sm:h-8 rounded-full ${color.bg} transition-all hover:scale-110 active:scale-95 ${
                      selectedColor === color.value 
                        ? 'ring-2 ring-offset-2 ring-black/30 scale-110' 
                        : ''
                    }`}
                    title={color.name}
                  >
                    {selectedColor === color.value && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="space-y-2 w-full">
                <p className="text-sm font-medium text-black/70">Preview:</p>
                <div className={`w-full p-4 rounded-xl sm:rounded-2xl border-2 transition-all ${colorOptions.find(c => c.value === selectedColor)?.preview} relative overflow-hidden`}>
                  {/* Tag display */}
                  {formData.tag && (
                    <div className="absolute top-0 right-0 z-10">
                      <div className={`px-2 py-1 rounded-[4px] text-xs font-semibold bg-white/95 backdrop-blur-sm shadow-sm border border-white/50 ${selectedColor === 'blue' ? 'text-blue-700' : selectedColor === 'green' ? 'text-green-700' : selectedColor === 'orange' ? 'text-orange-700' : selectedColor === 'purple' ? 'text-purple-700' : selectedColor === 'emerald' ? 'text-emerald-700' : selectedColor === 'pink' ? 'text-pink-700' : selectedColor === 'indigo' ? 'text-indigo-700' : 'text-red-700'}`}>
                        {formData.tag}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm shrink-0">
                      {selectedCategory === 'bank' && <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />}
                      {selectedCategory === 'crypto' && (
                        <span className="text-lg sm:text-xl">
                          {formData.network === 'other' ? '💰' : (formData.network ? getCryptoIcon(formData.network) : '💰')}
                        </span>
                      )}
                      {selectedCategory === 'digital' && <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-semibold text-sm sm:text-base truncate ${selectedColor === 'blue' ? 'text-blue-700' : selectedColor === 'green' ? 'text-green-700' : selectedColor === 'orange' ? 'text-orange-700' : selectedColor === 'purple' ? 'text-purple-700' : selectedColor === 'emerald' ? 'text-emerald-700' : selectedColor === 'pink' ? 'text-pink-700' : selectedColor === 'indigo' ? 'text-indigo-700' : 'text-red-700'}`}>
                        {selectedCategory === 'bank' ? (formData.bankName === 'Other' ? formData.customBankName || 'Your Bank' : formData.bankName || 'Bank Name') :
                         selectedCategory === 'crypto' ? (
                           formData.network === 'other' ? (formData.customNetwork || 'Custom Network') : 
                           (formData.network ? cryptoNetworks.find(n => n.value === formData.network)?.label : 'Cryptocurrency')
                         ) :
                         selectedCategory === 'digital' ? (formData.digitalWalletType ? (formData.digitalWalletType === 'other' ? (formData.customDigitalWallet || 'Custom Wallet') : digitalWallets.find(w => w.value === formData.digitalWalletType)?.label) : 'Digital Wallet') :
                         'Payment Method'}
                      </h4>
                      <p className={`text-xs sm:text-sm opacity-80 truncate ${selectedColor === 'blue' ? 'text-blue-700' : selectedColor === 'green' ? 'text-green-700' : selectedColor === 'orange' ? 'text-orange-700' : selectedColor === 'purple' ? 'text-purple-700' : selectedColor === 'emerald' ? 'text-emerald-700' : selectedColor === 'pink' ? 'text-pink-700' : selectedColor === 'indigo' ? 'text-indigo-700' : 'text-red-700'}`}>
                        {selectedCategory === 'bank' ? (formData.accountNumber || 'Account number') :
                         selectedCategory === 'crypto' ? (formData.walletAddress ? `${formData.walletAddress.slice(0, 6)}...${formData.walletAddress.slice(-4)}` : 'Wallet address') :
                         selectedCategory === 'digital' ? (formData.digitalWalletId || 'Account identifier') :
                         'Payment details'}
                      </p>
                      {selectedCategory === 'bank' && (
                        <p className={`text-xs opacity-60 mt-1 truncate ${selectedColor === 'blue' ? 'text-blue-700' : selectedColor === 'green' ? 'text-green-700' : selectedColor === 'orange' ? 'text-orange-700' : selectedColor === 'purple' ? 'text-purple-700' : selectedColor === 'emerald' ? 'text-emerald-700' : selectedColor === 'pink' ? 'text-pink-700' : selectedColor === 'indigo' ? 'text-indigo-700' : 'text-red-700'}`}>
                          {formData.accountName || 'Account holder name'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid() || isSubmitting}
                className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 sm:py-3 text-base font-medium min-h-[48px] sm:min-h-[auto]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    <span className="truncate">
                      {isEditMode ? 'Updating Payment Method...' : 'Adding Payment Method...'}
                    </span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">
                      {isEditMode ? 'Update Payment Method' : 'Add Payment Method'}
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AddPaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddPaymentPageContent />
    </Suspense>
  )
}