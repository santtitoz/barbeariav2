"use client"

import { Button } from "@/components/ui/button"
import { Scissors, Star } from "lucide-react"

export function Hero() {
  const scrollToBooking = () => {
    document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-black/20"></div>
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: "url('/placeholder.svg?height=1080&width=1920')",
        }}
      ></div>

      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-amber-500 rounded-full">
            <Scissors className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
          BARBEARIA ELITE
        </h1>

        <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
          Cortes clássicos e modernos com a precisão que você merece. Mais de 10 anos transformando visual e autoestima.
        </p>

        <div className="flex items-center justify-center gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
          ))}
          <span className="ml-2 text-lg font-semibold">4.9/5 - 500+ clientes</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-4 text-lg"
            onClick={scrollToBooking}
          >
            Agendar Horário
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg"
            onClick={() => document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ver Portfolio
          </Button>
        </div>
      </div>
    </section>
  )
}
