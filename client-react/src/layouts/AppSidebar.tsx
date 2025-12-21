'use client'

import * as React from 'react'
import {
    IconDashboard,
    IconInnerShadowTop,
    IconLasso,
    IconUsers,
    IconBrandDeezer,
} from '@tabler/icons-react'

import { NavMain } from '@/layouts/SidebarMain'

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar'
import { NavUser } from '@/layouts/SidebarUsers'

const data = {
    user: {
        name: 'shadcn',
        email: 'm@example.com',
        avatar: '/avatars/shadcn.jpg',
    },
    navMain: [
        {
            title: 'Dashboard',
            url: '/dashboard',
            icon: IconDashboard,
        },
        {
            title: 'Users',
            url: '/dashboard/users',
            icon: IconUsers,
        },
        {
            title: 'Transactions',
            url: '/dashboard/transactions',
            icon: IconLasso,
        },
        {
            title: 'Voice Tagging',
            url: '/dashboard/voice-tagging',
            icon: IconBrandDeezer,
        },
    ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar {...props}>
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
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    )
}
