import { useState } from 'react'
import { toast } from 'sonner'
import { PaymentMethod, supabase } from '@/lib/supabase'

export const usePaymentMethods = (
  initialMethods: PaymentMethod[], 
  setMethods: (methods: PaymentMethod[] | ((prev: PaymentMethod[]) => PaymentMethod[])) => void
) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const addPaymentMethod = async (paymentMethodData: Omit<PaymentMethod, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data: paymentMethod, error } = await supabase
        .from('payment_methods')
        .insert({ ...paymentMethodData, user_id: user.id })
        .select()
        .single()

      if (error) throw new Error(error.message)

      setMethods(prev => [...prev, paymentMethod].sort((a, b) => (a.display_order || 0) - (b.display_order || 0)))
      toast.success('Payment method added successfully!')
      return paymentMethod
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add payment method'
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    setLoading(true)
    try {
      const { data: paymentMethod, error } = await supabase
        .from('payment_methods')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw new Error(error.message)

      setMethods(prev => 
        prev.map(pm => pm.id === id ? paymentMethod : pm)
          .sort((a, b) => (a.display_order || 0) - (b.display_order || 0))
      )
      toast.success('Payment method updated successfully!')
      return paymentMethod
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update payment method'
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deletePaymentMethod = async (id: string) => {
    setLoading(true)
    const originalMethods = [...initialMethods]
    setMethods(prev => prev.filter(pm => pm.id !== id))
    
    try {
      const { error } = await supabase
        .from('payment_methods')
        .delete()
        .eq('id', id)

      if (error) {
        setMethods(originalMethods)
        throw new Error(error.message)
      }
      
      toast.success('Payment method deleted successfully!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete payment method'
      toast.error(errorMessage)
      setMethods(originalMethods)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const reorderPaymentMethods = async (newOrder: PaymentMethod[]) => {
    const originalOrder = [...initialMethods]
    setMethods(newOrder) // Optimistic update
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const updatePromises = newOrder.map((method, index) => 
        supabase
          .from('payment_methods')
          .update({ display_order: index + 1 })
          .eq('id', method.id)
          .eq('user_id', user.id)
      )

      const results = await Promise.all(updatePromises)
      const firstError = results.find(res => res.error)

      if (firstError) {
        throw new Error('Failed to reorder payment methods. Please try again.')
      }
      
      const updatedOrderWithDisplay = newOrder.map((method, index) => ({ ...method, display_order: index + 1 }))
      setMethods(updatedOrderWithDisplay)
      toast.success('Payment methods reordered successfully!')
    } catch (err) {
      setMethods(originalOrder) // Revert on error
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder payment methods'
      toast.error(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { 
    paymentMethods: initialMethods,
    loading, 
    error,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    reorderPaymentMethods,
    refetch: () => {} // No-op, refetch is now handled by useAuth
  }
} 