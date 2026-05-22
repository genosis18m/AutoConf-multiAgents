import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'
import { MobileNav } from './MobileNav'

export function Layout() {
  return (
    <div className="flex flex-col h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — hidden on mobile, visible md+ */}
        <div className="hidden md:flex md:flex-shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
      {/* Mobile bottom nav — only visible on small screens */}
      <div className="block md:hidden">
        <MobileNav />
      </div>
    </div>
  )
}
