"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Scissors, Calendar, Users, BarChart3, Settings, LogOut, Menu, X, Clock, Store } from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
  currentPage: string
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "appointments", label: "Agendamentos", icon: Calendar },
  { id: "clients", label: "Clientes", icon: Users },
  { id: "users", label: "Usuários", icon: Users },
  { id: "barbershop", label: "Barbearia", icon: Store },
  { id: "schedule", label: "Horários", icon: Clock },
  { id: "settings", label: "Configurações", icon: Settings },
]

export function AdminLayout({ children, currentPage }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { logout, user } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:h-screen lg:flex-shrink-0
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header da Sidebar */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Scissors className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">Admin Panel</span>
            </div>
            <button className="lg:hidden p-1 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Menu de navegação */}
          <nav className="flex-1 py-4 px-3 overflow-y-auto">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <a
                  key={item.id}
                  href={`/admin/${item.id}`}
                  className={`
                    flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors
                    ${
                      currentPage === item.id
                        ? "bg-amber-50 text-amber-700 border-r-2 border-amber-500"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </a>
              ))}
            </div>
          </nav>

          {/* Footer da Sidebar - Perfil do usuário */}
          <div className="border-t border-gray-200 bg-white p-4 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-bold">{user?.email?.charAt(0).toUpperCase() || "A"}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.displayName || "Administrador"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || "admin@barbearia.com"}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button className="lg:hidden p-2 rounded-md hover:bg-gray-100" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentPage === "dashboard"
                ? "Dashboard"
                : currentPage === "appointments"
                  ? "Agendamentos"
                  : currentPage === "clients"
                    ? "Clientes"
                    : currentPage === "users"
                      ? "Usuários"
                      : currentPage === "barbershop"
                        ? "Barbearia"
                        : currentPage === "schedule"
                          ? "Horários"
                          : "Configurações"}
            </h1>
          </div>

          {/* Indicador do usuário no header para mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{user?.email?.charAt(0).toUpperCase() || "A"}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
