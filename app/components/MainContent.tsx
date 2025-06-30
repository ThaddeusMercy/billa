"use client"

import React, { useState, useEffect } from 'react';
import { EditIcon, Trash2, Plus, Building2, Bitcoin, Copy, Check, X, AlertTriangle, Eye, Filter, GripVertical } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useAuthContext } from '@/contexts/AuthContext';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';

const MainContent = () => {
  const router = useRouter()
  const { 
    user, 
    profile, 
    paymentMethods: initialPaymentMethods, 
    setPaymentMethods, 
    loading: authLoading 
  } = useAuthContext()
  
  const { 
    paymentMethods, 
    loading: methodsLoading, 
    deletePaymentMethod, 
    reorderPaymentMethods 
  } = usePaymentMethods(initialPaymentMethods || [], setPaymentMethods)

  const [copied, setCopied] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [methodToDelete, setMethodToDelete] = useState<any>(null)
  const [filter, setFilter] = useState<'all' | 'bank' | 'crypto' | 'digital'>('all')
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [draggedOver, setDraggedOver] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // The useEffect for refetching is no longer needed here as useAuth handles all initial data loading.

  const getDisplayUsername = () => {
    return profile?.username || user?.email?.split('@')[0] || 'user'
  }

  const getDisplayUrl = () => {
    if (!isClient) return `yourdomain.com/${getDisplayUsername()}`
    return `${window.location.host}/${getDisplayUsername()}`
  }

  const getShareableUrl = () => {
    if (!isClient) return `https://yourdomain.com/${getDisplayUsername()}`
    return `${window.location.origin}/${getDisplayUsername()}`
  }

  const getMethodIcon = (method: any) => {
    if (method.icon_type === 'emoji' && method.icon_value) {
      return <span className="text-lg">{method.icon_value}</span>
    }
    
    // Default icons based on category
    if (method.category === 'bank') {
      return <Building2 className="h-5 w-5" />
    }
    if (method.category === 'crypto') {
      return <Bitcoin className="h-5 w-5" />
    }
    if (method.category === 'digital') {
      return <span className="text-lg">💳</span>
    }
    
    return <span className="text-lg">💳</span>
  }

  const filterPaymentMethods = (methods: any[]) => {
    if (filter === 'all') return methods
    return methods.filter(method => method.category === filter)
  }

  const filteredPaymentMethods = filterPaymentMethods(paymentMethods || [])

  const getFilterLabel = (filterType: string) => {
    switch(filterType) {
      case 'all': return 'All Methods'
      case 'bank': return 'Banks'
      case 'crypto': return 'Cryptocurrency'
      case 'digital': return 'Digital Wallets'
      default: return 'All Methods'
    }
  }

  const handleDragStart = (e: React.DragEvent, methodId: string) => {
    setDraggedItem(methodId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/html', methodId)
  }

  const handleDragOver = (e: React.DragEvent, methodId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggedOver(methodId)
  }

  const handleDragLeave = () => {
    setDraggedOver(null)
  }

  const handleDrop = async (e: React.DragEvent, targetMethodId: string) => {
    e.preventDefault()
    setDraggedOver(null)
    
    if (!draggedItem || draggedItem === targetMethodId) {
      setDraggedItem(null)
      return
    }

    const sourceIndex = filteredPaymentMethods.findIndex(m => m.id === draggedItem)
    const targetIndex = filteredPaymentMethods.findIndex(m => m.id === targetMethodId)
    
    if (sourceIndex === -1 || targetIndex === -1) {
      setDraggedItem(null)
      return
    }

    // Create new order array
    const newOrder = [...filteredPaymentMethods]
    const [movedItem] = newOrder.splice(sourceIndex, 1)
    newOrder.splice(targetIndex, 0, movedItem)

    try {
      await reorderPaymentMethods(newOrder)
    } catch (error) {
      console.error('Reorder failed:', error)
      // Force refetch to ensure UI is in sync with server state
      // refetch()
    }

    setDraggedItem(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDraggedOver(null)
  }

  const handleCopy = async () => {
    try {
      if (typeof window === 'undefined') return
      
      const shareableUrl = getShareableUrl()
      const displayUrl = getDisplayUrl()
      
      await navigator.clipboard.writeText(shareableUrl)
      setCopied(true)
      toast.success('Link copied!', {
        description: displayUrl
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleEdit = (paymentId: string) => {
    const method = paymentMethods.find(m => m.id === paymentId)
    if (method) {
      const serializableData = {
        id: method.id,
        type: method.type,
        category: method.category,
        identifier: method.identifier,
        bank_name: method.bank_name,
        account_number: method.account_number,
        account_name: method.account_name,
        routing_number: method.routing_number,
        coin_name: method.coin_name,
        network: method.network,
        wallet_address: method.wallet_address,
        digital_wallet_type: method.digital_wallet_type,
        digital_wallet_id: method.digital_wallet_id,
        selected_color: method.selected_color,
        tag: method.tag
      }
      
      const editData = encodeURIComponent(JSON.stringify(serializableData))
      router.push(`/add-payment?edit=${paymentId}&data=${editData}`)
    }
  }

  const handleDelete = (paymentId: string) => {
    const method = paymentMethods.find(m => m.id === paymentId)
    if (method) {
      setMethodToDelete(method)
      setDeleteModalOpen(true)
    }
  }

  const confirmDelete = async () => {
    if (methodToDelete) {
      try {
        await deletePaymentMethod(methodToDelete.id)
        setDeleteModalOpen(false)
        setMethodToDelete(null)
      } catch (error) {
        // Error is already handled in the hook
      }
    }
  }

  const cancelDelete = () => {
    setDeleteModalOpen(false)
    setMethodToDelete(null)
  }

  if (methodsLoading) {
    return (
      <div className="flex-1 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
            <p className="text-black/60">Loading payment methods...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 pt-16 sm:pt-20 lg:pt-8">
      {/* Header with Title and Billa Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3 sm:gap-0 mt-4 sm:mt-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-black">Dashboard</h1>
          <p className="text-black/60 text-sm sm:text-base">Manage your payment methods</p>
        </div>
        <div className="relative group">
          <div className="flex items-center gap-2 px-3 py-1.5 sm:py-1 bg-green-100 text-green-700 rounded-full text-xs sm:text-sm font-medium cursor-pointer">
            <span className="truncate max-w-[180px] sm:max-w-none">{getDisplayUrl()}</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-green-200 rounded transition-colors flex-shrink-0"
              title="Copy link"
            >
              {copied ? (
                <Check className="h-3 w-3 text-green-600" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </button>
          </div>
          <div className="absolute top-full right-0 mt-2 px-3 py-2 bg-black text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 hidden sm:block">
            Your unique payment link - share this to receive money
            <div className="absolute bottom-full right-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-black"></div>
          </div>
        </div>
      </div>

      {/* Single column layout */}
      <div className="max-w-4xl space-y-4 sm:space-y-6">
        {/* Add Payment Method Section */}
        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/10 text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Plus className="h-6 w-6 sm:h-8 sm:w-8 text-black/40" />
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-black mb-2">Add Your First Payment Method</h2>
            <p className="text-black/60 mb-4 sm:mb-6 text-sm sm:text-base">Add at least one payment method to start receiving money</p>
            <Link href="/add-payment">
              <Button className="bg-black text-white px-6 py-2.5 sm:py-2 rounded-lg hover:bg-black/90 w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-4 sm:p-6 border border-black/10">
            {/* Title */}
            <h2 className="text-lg font-semibold text-black mb-3 sm:mb-4">Payment Methods</h2>
            
            {/* Filter and Add Method Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
              {/* Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                {[
                  { value: 'all', label: 'All', count: paymentMethods.length },
                  { value: 'bank', label: 'Banks', count: paymentMethods.filter(m => m.category === 'bank').length },
                  { value: 'crypto', label: 'Crypto', count: paymentMethods.filter(m => m.category === 'crypto').length },
                  { value: 'digital', label: 'Digital', count: paymentMethods.filter(m => m.category === 'digital').length }
                ].map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => setFilter(filterOption.value as 'all' | 'bank' | 'crypto' | 'digital')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
                      filter === filterOption.value
                        ? 'bg-black text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                    }`}
                  >
                    <span>{filterOption.label}</span>
                    {filterOption.count > 0 && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        filter === filterOption.value
                          ? 'bg-white/20 text-white'
                          : 'bg-white text-gray-500'
                      }`}>
                        {filterOption.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Add Method Button */}
              <Link href="/add-payment">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-black/20 text-black/70 hover:bg-black/5 w-full sm:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Method
                </Button>
              </Link>
            </div>
            
            <div className="space-y-2 sm:space-y-3">
              {filteredPaymentMethods.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Filter className="h-5 w-5 sm:h-6 sm:w-6 text-black/40" />
                  </div>
                  <p className="text-black/60 text-sm">No {getFilterLabel(filter).toLowerCase()} found</p>
                  <p className="text-black/40 text-xs mt-1">Try selecting a different filter or add a new payment method</p>
                </div>
              ) : (
                <>
                  {filteredPaymentMethods.map((method) => (
                    <div 
                      key={method.id} 
                      draggable={filteredPaymentMethods.length > 1}
                      onDragStart={(e) => handleDragStart(e, method.id)}
                      onDragOver={(e) => handleDragOver(e, method.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, method.id)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center justify-between p-3 sm:p-4 border rounded-xl transition-all relative cursor-move
                        ${draggedItem === method.id ? 'opacity-50 scale-95' : ''}
                        ${draggedOver === method.id ? 'border-blue-400 bg-blue-50' : 'border-black/10 hover:bg-black/5'}
                        ${filteredPaymentMethods.length <= 1 ? 'cursor-default' : 'cursor-move'}
                      `}
                    >
                      {/* Tag display */}
                      {method.tag && (
                        <div className="absolute top-0 right-0">
                          <div className="px-2 py-1 rounded-[4px] text-xs font-medium bg-gray-100 text-gray-600 border">
                            {method.tag}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                        {/* Drag Handle */}
                        {filteredPaymentMethods.length > 1 && (
                          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 hidden sm:block">
                            <GripVertical className="h-4 w-4" />
                          </div>
                        )}
                        
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-black/5 rounded-lg flex items-center justify-center flex-shrink-0">
                          <div className="text-black flex items-center justify-center">
                            {getMethodIcon(method)}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="font-medium text-black text-sm sm:text-base block truncate">{method.type}</span>
                          <p className="text-xs sm:text-sm text-black/60 truncate">{method.identifier}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button 
                          onClick={() => handleEdit(method.id)}
                          className="p-1.5 sm:p-2 text-black/60 hover:text-black hover:bg-black/5 rounded-lg transition-colors"
                          title="Edit payment method"
                        >
                          <EditIcon size={14} className="sm:w-4 sm:h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(method.id)}
                          className="p-1.5 sm:p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete payment method"
                        >
                          <Trash2 size={14} className="sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}

        {/* Preview Button */}
        <div>
          <Link href="/preview">
            <Button className="bg-black hover:bg-black/90 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl flex items-center justify-center gap-2 w-full sm:w-auto">
              <Eye className="h-4 w-4" />
              Preview Your Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-black">Delete Payment Method</h3>
            </div>
            
            <p className="text-black/70 mb-2">
              Are you sure you want to delete <span className="font-medium">{methodToDelete?.type}</span>?
            </p>
            <p className="text-sm text-red-600 mb-6">
              This action cannot be undone. You'll need to re-add this payment method if you want to use it again.
            </p>
            
            <div className="flex gap-3">
              <Button
                onClick={cancelDelete}
                variant="outline"
                className="flex-1 border-black/20 text-black/70 hover:bg-black/5"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent; 