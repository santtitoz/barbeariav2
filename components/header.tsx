"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Scissors, Menu, X, Settings, User, LogOut } from "lucide-react"
import { AuthModal } from "@/components/auth/auth-modal"
import { useAuth } from "@/contexts/auth-context"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const { user, logout, isAdmin } = useAuth()

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  const handleAuthClick = (mode: "login" | "register") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  const handleLogout = async () => {
    await logout()
    setIsMenuOpen(false)
  }

  return (
    <>
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Barbearia Elite</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => scrollToSection("inicio")}
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                Início
              </button>
              <button
                onClick={() => scrollToSection("servicos")}
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                Serviços
              </button>
              <button
                onClick={() => scrollToSection("portfolio")}
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                Portfolio
              </button>
              <button
                onClick={() => scrollToSection("contato")}
                className="text-gray-700 hover:text-amber-600 transition-colors"
              >
                Contato
              </button>

              {user ? (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={() => scrollToSection("agendamento")}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  >
                    Agendar
                  </Button>

                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4" />
                    <span className="text-gray-700">{user.displayName || user.email?.split("@")[0]}</span>
                  </div>

                  {isAdmin && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open("/admin/dashboard", "_blank")}
                      className="text-gray-500 hover:text-amber-600 p-2"
                      title="Painel Administrativo"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-red-600 p-2"
                    title="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => handleAuthClick("login")}
                    className="text-gray-700 hover:text-amber-600"
                  >
                    Entrar
                  </Button>
                  <Button
                    onClick={() => handleAuthClick("register")}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                  >
                    Criar Conta
                  </Button>
                </div>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col gap-4">
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="text-left text-gray-700 hover:text-amber-600 transition-colors"
                >
                  Início
                </button>
                <button
                  onClick={() => scrollToSection("servicos")}
                  className="text-left text-gray-700 hover:text-amber-600 transition-colors"
                >
                  Serviços
                </button>
                <button
                  onClick={() => scrollToSection("portfolio")}
                  className="text-left text-gray-700 hover:text-amber-600 transition-colors"
                >
                  Portfolio
                </button>
                <button
                  onClick={() => scrollToSection("contato")}
                  className="text-left text-gray-700 hover:text-amber-600 transition-colors"
                >
                  Contato
                </button>

                {user ? (
                  <>
                    <Button
                      onClick={() => scrollToSection("agendamento")}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-semibold w-fit"
                    >
                      Agendar
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <User className="w-4 h-4" />
                      {user.displayName || user.email?.split("@")[0]}
                    </div>

                    {isAdmin && (
                      <button
                        onClick={() => window.open("/admin/dashboard", "_blank")}
                        className="flex items-center gap-2 text-left text-gray-500 hover:text-amber-600 transition-colors text-sm"
                      >
                        <Settings className="w-4 h-4" />
                        Painel Administrativo
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-left text-gray-500 hover:text-red-600 transition-colors text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => handleAuthClick("login")}
                      className="text-left text-gray-700 hover:text-amber-600 w-fit"
                    >
                      Entrar
                    </Button>
                    <Button
                      onClick={() => handleAuthClick("register")}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-semibold w-fit"
                    >
                      Criar Conta
                    </Button>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode={authMode} />
    </>
  )
}
