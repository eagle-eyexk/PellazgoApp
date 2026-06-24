import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import AdminGate from './AdminGate';
import { clearAdminSession } from '@/lib/adminAuth';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Tag, BarChart3,
  Settings, Menu, X, FolderTree, FileText, AlertTriangle, Globe, LogOut
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/nothranted' },
  { icon: Package, label: 'Products', to: '/nothranted/products' },
  { icon: FolderTree, label: 'Categories', to: '/nothranted/categories' },
  { icon: ShoppingCart, label: 'Orders', to: '/nothranted/orders' },
  { icon: Users, label: 'Customers', to: '/nothranted/customers' },
  { icon: Tag, label: 'Offers', to: '/nothranted/offers' },
  { icon: BarChart3, label: 'Analytics', to: '/nothranted/analytics' },
  { icon: AlertTriangle, label: 'Errors', to: '/nothranted/errors' },
  { icon: FileText, label: 'Blog', to: '/nothranted/blog' },
  { icon: Settings, label: 'Settings', to: '/nothranted/settings' },
];

export default function AdminLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearAdminSession();
    window.location.reload();
  };

  return (
    <AdminGate>
      <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f3]">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading text-lg">Pellazgo Admin</span>
          <Link to="/" className="text-xs text-white/50 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" /> Site
          </Link>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0f0f0f] border-r border-white/10
            transform transition-transform lg:transform-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h1 className="font-heading text-lg text-white">Pellazgo</h1>
                <p className="text-[10px] font-body tracking-widest uppercase text-white/30 mt-0.5">Admin Panel</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="p-3 space-y-0.5">
              {navItems.map(item => {
                const isActive = item.to === '/nothranted'
                  ? location.pathname === '/nothranted'
                  : location.pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-body transition-colors ${
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 flex flex-col gap-2">
              <Link to="/" className="flex items-center gap-2 text-xs font-body text-white/40 hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5" />
                Shko te Dyqani
              </Link>
              <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-body text-red-400/60 hover:text-red-400 transition-colors">
                <LogOut className="w-3.5 h-3.5" />
                Lock Panel
              </button>
            </div>
          </aside>

          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}

          {/* Main content */}
          <main className="flex-1 min-h-screen lg:min-w-0">
            <div className="p-4 md:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminGate>
  );
}
