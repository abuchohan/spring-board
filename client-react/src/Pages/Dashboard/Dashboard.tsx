import { Button } from '@/components/ui/button'
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar'
import { logoutUser } from '@/redux/auth/authThunks'
import { useAppDispatch } from '@/redux/hooks/hooks'
import { NavLink, Outlet, useNavigate } from 'react-router'

import { Home, Users, Settings } from 'lucide-react'
import { toast } from 'sonner'

const Dashboard = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const LogoutHandler = async () => {
        const res = await dispatch(logoutUser())
        if (res) {
            toast.info(`You've logged out`)
        }
        navigate('/login')
    }

    // Menu items for the sidebar
    const items = [
        { title: 'Dashboard', to: '/dashboard', icon: Home },
        { title: 'Users', to: '/dashboard/users', icon: Users },
        { title: 'Settings', to: '/dashboard/settings', icon: Settings },
    ]

    return (
        <>
            <SidebarProvider>
                <Sidebar collapsible="icon">
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupLabel>Menu</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {items.map((item) => (
                                        <SidebarMenuItem key={item.title}>
                                            <SidebarMenuButton asChild>
                                                <NavLink
                                                    to={item.to}
                                                    className={({
                                                        isActive,
                                                    }) =>
                                                        isActive
                                                            ? 'text-sidebar-primary'
                                                            : ''
                                                    }
                                                >
                                                    <item.icon />
                                                    <span>{item.title}</span>
                                                </NavLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                                <SidebarTrigger className="mb-4" />
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                </Sidebar>

                {/* === MAIN AREA === */}
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-semibold">Dashboard</h1>

                    <Button onClick={LogoutHandler} className="mb-4">
                        Log Out
                    </Button>
                    <Outlet />
                </main>
            </SidebarProvider>
        </>
    )
}

export default Dashboard
