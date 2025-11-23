import { SiteHeader } from '@/layouts/SiteHeader'
import type { ReactNode } from 'react'

interface PageWrapperProps {
    title: string
    children: ReactNode
}

export function PageWrapper({ title, children }: PageWrapperProps) {
    return (
        <>
            <SiteHeader title={title} />
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
        </>
    )
}
