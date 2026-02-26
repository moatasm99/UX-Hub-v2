import { Link } from 'react-router-dom'

export default function NotFoundPage() {
    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
            <span className="text-7xl">404</span>
            <h1 className="text-2xl font-bold text-gray-800">Page Not Found</h1>
            <p className="text-gray-500">
                The page you're looking for doesn't exist or has been moved.
            </p>
            <Link
                to="/"
                className="mt-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
                Go Home
            </Link>
        </div>
    )
}
