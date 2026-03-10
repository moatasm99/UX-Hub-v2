import { LoadingSkeleton } from '../LoadingSkeleton'

export function PageHeaderSkeleton() {
    return (
        <section className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
                <div className="flex justify-center">
                    <LoadingSkeleton className="h-8 w-64 rounded-full" />
                </div>
                <div className="flex justify-center">
                    <LoadingSkeleton className="h-12 md:h-14 w-3/4 max-w-lg rounded-md" />
                </div>
                <div className="flex justify-center">
                    <LoadingSkeleton className="h-6 w-full max-w-xl rounded" />
                </div>
            </div>
        </section>
    )
}
