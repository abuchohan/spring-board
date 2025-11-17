import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useNavigate } from 'react-router'

export default function LandingPage() {
    const navigate = useNavigate()
    return (
        <div className="relative min-h-screen w-full bg-black text-white overflow-hidden flex flex-col items-center justify-center px-4">
            {/* Radial glow background */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[600px] w-[1200px] rounded-full bg-blue-500/20 blur-[180px]" />
            </div>

            {/* Header */}
            <header className="absolute top-0 left-0 w-full flex items-center justify-between p-6">
                <h1 className="text-xl font-semibold tracking-tight">
                    Spring-Board
                </h1>
                <Button variant="outline" onClick={() => navigate('/login')}>
                    Login
                </Button>
            </header>

            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto mt-24">
                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                    Give your big idea the <br /> design it deserves
                </h1>
                <p className="text-muted-foreground text-base md:text-lg mb-8">
                    A modern UI starter powered by React, Shadcn UI, and
                    Tailwind — crafted to help your product stand out.
                </p>

                {/* Email Capture */}
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
                    <Input
                        type="email"
                        placeholder="Email address"
                        className="w-72 bg-white/10 border-white/20 text-white placeholder:text-white/40"
                    />
                    <Button className="w-full sm:w-auto">Get Started</Button>
                </div>

                <p className="text-xs text-muted-foreground mt-3">
                    Free and open source.
                </p>
            </div>

            {/* Bottom Glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[200px] rounded-t-full bg-blue-500/10 blur-3xl" />
        </div>
    )
}
