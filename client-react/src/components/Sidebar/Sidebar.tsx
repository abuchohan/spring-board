import * as React from 'react'
import {
    IconChartBar,
    IconDashboard,
    IconFolder,
    IconInnerShadowTop,
    IconListDetails,
    IconSettings,
    IconUsers,
} from '@tabler/icons-react'

import { NavMain } from '@/components/Sidebar/SidebarMain'
import { NavSecondary } from '@/components/Sidebar/SidebarSecondary'
import { NavUser } from '@/components/Sidebar/SidebarUsers'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '#',
            icon: IconDashboard,
        },
        {
            title: 'Lifecycle',
            url: '#',
            icon: IconListDetails,
        },
        {
            title: 'Analytics',
            url: '#',
            icon: IconChartBar,
        },
        {
            title: 'Projects',
            url: '#',
            icon: IconFolder,
        },
        {
            title: 'Team',
            url: '#',
            icon: IconUsers,
        },
    ],

    navSecondary: [
        {
            title: 'Settings',
            url: '#',
            icon: IconSettings,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            asChild
                            className="data-[slot=sidebar-menu-button]:p-1.5!"
                        >
                            <a href="#">
                                <IconInnerShadowTop className="size-5" />
                                <span className="text-base font-semibold">
                                    Spring Board
                                </span>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavSecondary items={data.navSecondary} className="mt-auto" />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
        </Sidebar>
    )
}
