import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Link } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle/ThemeToggle'

const LoginPage = () => {
    return (
        <>
            <ThemeToggle />
            <div className="flex items-center justify-center min-h-screen px-4">
                <Card className="w-full max-w-sm shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-3">
                        <Button className="w-full">Sign in</Button>

                        <Separator />

                        <p className="text-sm text-center text-muted-foreground">
                            Don’t have an account?{' '}
                            <Link
                                to="/register"
                                className="text-primary hover:underline"
                            >
                                Create one
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </>
    )
}

export default LoginPage
