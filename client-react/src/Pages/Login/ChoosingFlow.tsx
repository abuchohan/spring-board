import {
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
            <CardContent className="space-y-4 flex-col flex">
                <Button size={'lg'} disabled>
                    Sign in with Google
                </Button>
                <Button onClick={() => setFlow('login')}>
                    Sign in with Email
                </Button>
                <Button disabled>Sign in with SSO</Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
                <Separator />

                <p className="text-sm text-center text-muted-foreground">
                    Don’t have an account?
                    <a
                        href="#"
                        onClick={() => setFlow('register')}
                        className="text-primary hover:underline"
                    >
                        {' '}
                        Create one
                    </a>
                </p>
            </CardFooter>
        </>
    )
}

export default ChoosingFlow
