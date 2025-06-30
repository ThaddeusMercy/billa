import { Building2, Bitcoin, Smartphone } from "lucide-react"

// Payment method categories
export const categories = [
  {
    id: 'bank',
    title: 'Bank Account',
    description: 'Connect your bank account for direct transfers',
    icon: Building2,
    color: 'bg-blue-50 border-blue-200 text-blue-700',
    iconColor: 'text-blue-600'
  },
  {
    id: 'crypto',
    title: 'Cryptocurrency',
    description: 'Add crypto wallets for digital payments',
    icon: Bitcoin,
    color: 'bg-orange-50 border-orange-200 text-orange-700',
    iconColor: 'text-orange-600'
  },
  {
    id: 'digital',
    title: 'Digital Wallet',
    description: 'PayPal, Venmo, Apple Pay and more',
    icon: Smartphone,
    color: 'bg-purple-50 border-purple-200 text-purple-700',
    iconColor: 'text-purple-600'
  }
]

// Cryptocurrency networks
export const cryptoNetworks = [
  { value: 'bitcoin', label: 'Bitcoin (BTC)', icon: '₿' },
  { value: 'ethereum', label: 'Ethereum (ETH)', icon: '⟠' },
  { value: 'binance', label: 'Binance Smart Chain (BSC)', icon: '🟡' },
  { value: 'polygon', label: 'Polygon (MATIC)', icon: '🟣' },
  { value: 'solana', label: 'Solana (SOL)', icon: '🌌' },
  { value: 'cardano', label: 'Cardano (ADA)', icon: '🔵' },
  { value: 'xrpl', label: 'XRP Ledger (XRP)', icon: '💧' },
  { value: 'stellar', label: 'Stellar (XLM)', icon: '⭐' },
  { value: 'avalanche', label: 'Avalanche (AVAX)', icon: '🏔️' },
  { value: 'algorand', label: 'Algorand (ALGO)', icon: '🔷' },
  { value: 'cosmos', label: 'Cosmos (ATOM)', icon: '🌌' },
  { value: 'polkadot', label: 'Polkadot (DOT)', icon: '🔴' },
  { value: 'chainlink', label: 'Chainlink (LINK)', icon: '🔗' },
  { value: 'litecoin', label: 'Litecoin (LTC)', icon: '🥈' },
  { value: 'dogecoin', label: 'Dogecoin (DOGE)', icon: '🐕' },
  { value: 'tron', label: 'Tron (TRX)', icon: '🎯' },
  { value: 'near', label: 'NEAR Protocol (NEAR)', icon: '🔺' },
  { value: 'fantom', label: 'Fantom (FTM)', icon: '👻' },
  { value: 'harmony', label: 'Harmony (ONE)', icon: '🎵' },
  { value: 'terra', label: 'Terra Classic (LUNC)', icon: '🌍' },
  { value: 'other', label: 'Other', icon: '💰' }
]

// Crypto icon mapping function
export const getCryptoIcon = (network: string) => {
  const cryptoIcons: Record<string, string> = {
    bitcoin: '₿',
    ethereum: '⟠', 
    binance: '🟡',
    polygon: '🟣',
    solana: '🌌',
    cardano: '🔵',
    xrpl: '💧',
    stellar: '⭐',
    avalanche: '🏔️',
    algorand: '🔷',
    cosmos: '🌌',
    polkadot: '🔴',
    chainlink: '🔗',
    litecoin: '🥈',
    dogecoin: '🐕',
    tron: '🎯',
    near: '🔺',
    fantom: '👻',
    harmony: '🎵',
    terra: '🌍',
    other: '💰'
  }
  return cryptoIcons[network.toLowerCase()] || '💰'
}

// Digital wallet options
export const digitalWallets = [
  { value: 'paypal', label: 'PayPal', icon: '💳' },
  { value: 'venmo', label: 'Venmo', icon: '💙' },
  { value: 'cashapp', label: 'Cash App', icon: '💚' },
  { value: 'zelle', label: 'Zelle', icon: '🏦' },
  { value: 'applepay', label: 'Apple Pay', icon: '🍎' },
  { value: 'googlepay', label: 'Google Pay', icon: '🔷' },
  { value: 'mtnmomo', label: 'MTN MoMo', icon: '📱' },
  { value: 'opay', label: 'OPay', icon: '🟢' },
  { value: 'stripe', label: 'Stripe', icon: '🔷' },
  { value: 'other', label: 'Other', icon: '📱' }
]

// Color options for payment method cards
export const colorOptions = [
  { value: 'blue', name: 'Blue', bg: 'bg-blue-500', border: 'border-blue-500', preview: 'bg-blue-50 border-blue-200' },
  { value: 'green', name: 'Green', bg: 'bg-green-500', border: 'border-green-500', preview: 'bg-green-50 border-green-200' },
  { value: 'orange', name: 'Orange', bg: 'bg-orange-500', border: 'border-orange-500', preview: 'bg-orange-50 border-orange-200' },
  { value: 'purple', name: 'Purple', bg: 'bg-purple-500', border: 'border-purple-500', preview: 'bg-purple-50 border-purple-200' },
  { value: 'emerald', name: 'Emerald', bg: 'bg-emerald-500', border: 'border-emerald-500', preview: 'bg-emerald-50 border-emerald-200' },
  { value: 'pink', name: 'Pink', bg: 'bg-pink-500', border: 'border-pink-500', preview: 'bg-pink-50 border-pink-200' },
  { value: 'indigo', name: 'Indigo', bg: 'bg-indigo-500', border: 'border-indigo-500', preview: 'bg-indigo-50 border-indigo-200' },
  { value: 'red', name: 'Red', bg: 'bg-red-500', border: 'border-red-500', preview: 'bg-red-50 border-red-200' }
]

// Default icon mapping function
export const getDefaultIcon = (category: string | null) => {
  switch (category) {
    case 'bank':
      return '🏦'
    case 'crypto':
      return '₿'
    case 'digital':
      return '💳'
    default:
      return '💳'
  }
} 