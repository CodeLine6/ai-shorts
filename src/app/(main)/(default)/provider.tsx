import { SidebarProvider } from '@/components/ui/sidebar'

function DashboardProvider({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
        {children}
    </SidebarProvider>

  )
}

export default DashboardProvider