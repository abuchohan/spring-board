import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { AuthFlow } from './LoginPage'

const ChoosingFlow = ({ setFlow }: { setFlow: (flow: AuthFlow) => void }) => {
    return (
        <>
            <CardHeader>
                <CardTitle className="text-2xl font-semibold text-center">
                    Login to Spring-Board
                </CardTitle>
                <CardDescription className="text-center">
                    Select an option to continue
                </CardDescription>
            </CardHeader>
            <div className="h-4" />

            <CardContent className="space-y-4 flex-col flex">
                <Button className="hover:cursor-pointer" size={'lg'} disabled>
                    Sign in with Google
                </Button>
                <Button
                    className="hover:cursor-pointer"
                    size={'lg'}
                    onClick={() => setFlow('login')}
                >
                    Sign in with Email
                </Button>
                <Button className="hover:cursor-pointer" disabled size={'lg'}>
                    Sign in with SSO
                </Button>
            </CardContent>
            <div className="h-4" />

            <CardFooter className="flex flex-col space-y-3">
                <p className="text-sm text-center text-muted-foreground">
                    Don’t have an account?{' '}
                    <a
                        href="#"
                        onClick={() => setFlow('register')}
                        className="text-primary hover:underline"
                    >
                        Create one
                    </a>
                </p>
            </CardFooter>
        </>
    )
}

export default ChoosingFlow
