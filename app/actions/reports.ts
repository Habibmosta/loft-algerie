'use server'

import { createClient } from '@/utils/supabase/server'
import type { Database } from '@/lib/types'

type Transaction = Database['public']['Tables']['transactions']['Row']
type Loft = Database['public']['Tables']['lofts']['Row']

export interface MonthlyRevenueData {
  month: string
  revenue: number
  expenses: number
}

export interface LoftRevenueData {
  name: string
  revenue: number
  expenses: number
  net_profit: number
}

export async function getMonthlyRevenueData(): Promise<MonthlyRevenueData[]> {
  const supabase = await createClient()
  
  // Récupérer toutes les transactions de l'année en cours
  const currentYear = new Date().getFullYear()
  const startDate = `${currentYear}-01-01`
  const endDate = `${currentYear}-12-31`
  
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })
  
  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
  
  // Grouper par mois
  const monthlyData: { [key: number]: { revenue: number; expenses: number } } = {}
  
  transactions.forEach((transaction: Transaction) => {
    const month = new Date(transaction.date).getMonth() // 0-11
    
    if (!monthlyData[month]) {
      monthlyData[month] = { revenue: 0, expenses: 0 }
    }
    
    if (transaction.type === 'revenue') {
      monthlyData[month].revenue += transaction.amount
    } else if (transaction.type === 'expense') {
      monthlyData[month].expenses += transaction.amount
    }
  })
  
  // Créer le tableau des 12 mois avec les clés de traduction
  const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
  
  return monthKeys.map((monthKey, index) => ({
    month: monthKey, // Nous passerons la clé, la traduction se fera côté client
    revenue: monthlyData[index]?.revenue || 0,
    expenses: monthlyData[index]?.expenses || 0
  }))
}

export async function getLoftRevenueData(): Promise<LoftRevenueData[]> {
  const supabase = await createClient()
  
  // Récupérer tous les lofts avec leurs transactions
  const { data: lofts, error: loftsError } = await supabase
    .from('lofts')
    .select('id, name')
  
  if (loftsError) {
    console.error('Error fetching lofts:', error)
    return []
  }
  
  // Récupérer toutes les transactions de l'année en cours
  const currentYear = new Date().getFullYear()
  const startDate = `${currentYear}-01-01`
  const endDate = `${currentYear}-12-31`
  
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .gte('date', startDate)
    .lte('date', endDate)
  
  if (transactionsError) {
    console.error('Error fetching transactions:', transactionsError)
    return []
  }
  
  // Grouper les transactions par loft
  const loftData: { [key: string]: { revenue: number; expenses: number } } = {}
  
  transactions.forEach((transaction: Transaction) => {
    if (!transaction.loft_id) return
    
    const loftId = transaction.loft_id
    if (!loftData[loftId]) {
      loftData[loftId] = { revenue: 0, expenses: 0 }
    }
    
    if (transaction.type === 'revenue') {
      loftData[loftId].revenue += transaction.amount
    } else if (transaction.type === 'expense') {
      loftData[loftId].expenses += transaction.amount
    }
  })
  
  // Créer le résultat final
  return lofts.map((loft: Loft) => {
    const data = loftData[loft.id] || { revenue: 0, expenses: 0 }
    return {
      name: loft.name,
      revenue: data.revenue,
      expenses: data.expenses,
      net_profit: data.revenue - data.expenses
    }
  }).filter(loft => loft.revenue > 0 || loft.expenses > 0) // Filtrer les lofts sans transactions
    .sort((a, b) => b.net_profit - a.net_profit) // Trier par profit décroissant
}