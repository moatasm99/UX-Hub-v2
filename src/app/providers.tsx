import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { ThemeProvider } from "@/components/theme-provider"
import { ErrorBoundary } from '@/components/ErrorBoundary'

export function AppProviders({ children }: { children: ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 5 * 60 * 1000, // 5 minutes
                gcTime: 10 * 60 * 1000, // 10 minutes
                refetchOnWindowFocus: false,
                retry: 1, // Production hardening: 1 retry
            },
        },
    }))

    return (
        <ErrorBoundary>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                    {children}
                </ThemeProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    )
}
