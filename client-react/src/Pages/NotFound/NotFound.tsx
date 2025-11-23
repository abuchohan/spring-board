import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="min-h-svh bg-slate-950 text-white flex items-center justify-center px-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            <div className="relative z-10 mx-auto max-w-md text-center">
                {/* 404 Number */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        404
                    </h1>
                    <div className="mt-2 h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full" />
                </div>

                {/* Message */}
                <div className="space-y-4 mb-8">
                    <h2 className="text-3xl font-semibold tracking-tight text-white">
                        Page Not Found
                    </h2>
                    <p className="text-slate-400 text-lg">
                        Oops! The page you're looking for doesn't exist. It
                        might have been moved or deleted.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="gap-2 border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white backdrop-blur-sm"
                    >
                        <ArrowLeft className="size-4" />
                        Go Back
                    </Button>
                    <Button
                        onClick={() => navigate('/')}
                        className="gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25"
                    >
                        <Home className="size-4" />
                        Back to Home
                    </Button>
                </div>

                {/* Decorative Element */}
                <div className="mt-12 text-slate-600">
                    <svg
                        className="mx-auto size-32"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    )
}
