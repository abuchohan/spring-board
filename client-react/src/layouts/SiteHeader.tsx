import { Separator } from '@/components/ui/separator'

interface SiteHeaderProps {
    title: string
}

export function SiteHeader({ title }: SiteHeaderProps) {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
            <div className="flex items-center gap-2 px-4">
                <Separator orientation="vertical" className="mr-2 h-4" />
                <h1 className="text-lg font-semibold">{title}</h1>
            </div>
        </header>
    )
}
