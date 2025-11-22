import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    ArrowRight,
    CheckCircle2,
    Code2,
    Database,
    Layout,
    ShieldCheck,
    Zap,
} from 'lucide-react'
import { FeatureCard } from './FeatureCard'

export default function LandingPage() {
    const navigate = useNavigate()

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
    }

    const stagger = {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-blue-500/30">
            {/* Background Gradients */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-500/10 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
            </div>

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-slate-950/50 backdrop-blur-md">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                        <div className="size-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <Zap className="size-5 text-white fill-white" />
                        </div>
                        Spring Board
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            className="text-slate-300 hover:text-white hover:bg-white/10"
                            onClick={() => navigate('/login')}
                        >
                            Sign In
                        </Button>
                        <Button
                            className="bg-white text-slate-950 hover:bg-slate-200"
                            onClick={() => navigate('/login')}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 md:pt-48 md:pb-32 px-6">
                <div className="container mx-auto max-w-5xl text-center">
                    <motion.div
                        initial="initial"
                        animate="animate"
                        variants={stagger}
                        className="space-y-8"
                    >
                        <motion.div
                            variants={fadeIn}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-blue-300 mb-4"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            v1.0 is now available
                        </motion.div>

                        <motion.h1
                            variants={fadeIn}
                            className="text-5xl md:text-7xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
                        >
                            Build your next idea,
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                                faster than ever.
                            </span>
                        </motion.h1>

                        <motion.p
                            variants={fadeIn}
                            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                        >
                            The ultimate React starter kit. Authentication,
                            Database, UI Components, and more — all
                            pre-configured so you can focus on building.
                        </motion.p>

                        <motion.div
                            variants={fadeIn}
                            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                        >
                            <Button
                                size="lg"
                                className="h-12 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
                                onClick={() => navigate('/register')}
                            >
                                Start Building Now
                                <ArrowRight className="ml-2 size-4" />
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 px-8 text-base border-white/10 bg-white/5 hover:bg-white/10 text-white hover:text-white backdrop-blur-sm"
                                onClick={() =>
                                    window.open(
                                        'https://github.com/your-repo',
                                        '_blank'
                                    )
                                }
                            >
                                View on GitHub
                            </Button>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 py-24 bg-slate-950/50 border-t border-white/5">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Everything you need to ship
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Don't waste time setting up the basics. We've
                            handled the boring stuff so you can build the cool
                            stuff.
                        </p>
                    </div>

                    <motion.div
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={stagger}
                        className="grid md:grid-cols-3 gap-8"
                    >
                        <motion.div variants={fadeIn}>
                            <FeatureCard
                                icon={
                                    <ShieldCheck className="size-6 text-blue-400" />
                                }
                                title="Authentication"
                                description="Secure user authentication with JWTs, refresh tokens, and password reset flows built-in."
                            />
                        </motion.div>
                        <motion.div variants={fadeIn}>
                            <FeatureCard
                                icon={
                                    <Database className="size-6 text-purple-400" />
                                }
                                title="Prisma ORM"
                                description="Type-safe database access with Prisma. Connect to PostgreSQL, MySQL, or SQLite with ease."
                            />
                        </motion.div>
                        <motion.div variants={fadeIn}>
                            <FeatureCard
                                icon={
                                    <Layout className="size-6 text-pink-400" />
                                }
                                title="Modern UI"
                                description="Beautiful, accessible components built with Radix UI and styled with Tailwind CSS."
                            />
                        </motion.div>
                        <motion.div variants={fadeIn}>
                            <FeatureCard
                                icon={
                                    <Code2 className="size-6 text-green-400" />
                                }
                                title="TypeScript"
                                description="End-to-end type safety. Catch errors before they happen and enjoy superior autocomplete."
                            />
                        </motion.div>
                        <motion.div variants={fadeIn}>
                            <FeatureCard
                                icon={
                                    <Zap className="size-6 text-yellow-400" />
                                }
                                title="Vite Powered"
                                description="Lightning fast development server and optimized production builds."
                            />
                        </motion.div>
                        <motion.div variants={fadeIn}>
                            <FeatureCard
                                icon={
                                    <CheckCircle2 className="size-6 text-cyan-400" />
                                }
                                title="Best Practices"
                                description="Follows industry standards for folder structure, error handling, and state management."
                            />
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-12 border-t border-white/10 bg-slate-950">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
                    <p>© 2024 Spring Board. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Privacy
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Terms
                        </a>
                        <a
                            href="#"
                            className="hover:text-white transition-colors"
                        >
                            Twitter
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    )
}
