import { ReactNode } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

interface SafeQueryProps<T> {
    data: T | undefined;
    isLoading: boolean;
    error: Error | null;
    children: (data: T) => ReactNode;
    loadingFallback?: ReactNode;
    errorFallback?: ReactNode;
    isEmpty?: boolean;
    emptyFallback?: ReactNode;
}

export function SafeQuery<T>({
    data,
    isLoading,
    error,
    children,
    loadingFallback,
    errorFallback,
    isEmpty,
    emptyFallback
}: SafeQueryProps<T>) {
    if (isLoading) {
        return loadingFallback || (
            <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in duration-500">
                <div className="relative">
                    <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
                    <div className="absolute inset-0 bg-purple-500/20 blur-xl animate-pulse rounded-full" />
                </div>
                <p className="text-sm font-bold text-slate-400 tracking-wide uppercase">Syncing data...</p>
            </div>
        );
    }

    if (error) {
        return errorFallback || (
            <div className="p-6 bg-red-50 dark:bg-red-900/10 border-2 border-red-100 dark:border-red-900/20 rounded-2xl flex items-start gap-4 animate-in slide-in-from-top-2 duration-300">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                    <h4 className="font-black text-red-900 dark:text-red-200 text-sm">Query Failed</h4>
                    <p className="text-xs text-red-700 dark:text-red-400 mt-1 font-medium">{error.message || 'An unexpected error occurred while fetching data.'}</p>
                </div>
            </div>
        );
    }

    if (isEmpty || !data) {
        return emptyFallback || (
            <div className="py-12 text-center bg-slate-50 dark:bg-slate-900/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in duration-300">
                <p className="text-slate-400 font-bold italic">No data available at the moment.</p>
            </div>
        );
    }

    return <>{children(data)}</>;
}
