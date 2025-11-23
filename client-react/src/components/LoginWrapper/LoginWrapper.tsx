import { FieldDescription } from '@/components/ui/field'
import { GalleryVerticalEnd } from 'lucide-react'
import { Card } from '@/components/ui/card'

const LoginWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="flex w-full max-w-sm flex-col gap-6">
                    <div className="flex items-center gap-2 self-center font-medium">
                        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        Spring Board
                    </div>
                    <Card>{children}</Card>

                    <FieldDescription className="px-6 text-center">
                        By clicking continue, you agree to our{' '}
                        <a href="#">Terms of Service</a> and{' '}
                        <a href="#">Privacy Policy</a>.
                    </FieldDescription>
                </div>
            </div>
        </>
    )
}

export default LoginWrapper
