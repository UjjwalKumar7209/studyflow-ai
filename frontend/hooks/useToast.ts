import { useToast as useToastFromProvider } from '@/providers/ToastProvider'

export const useToast = useToastFromProvider
export type { ToastType } from '@/providers/ToastProvider'
