"use client"

import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Services } from "@/components/services"
import { Portfolio } from "@/components/portfolio"
import { Booking } from "@/components/booking"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="inicio">
        <Hero />
      </div>
      <div id="servicos">
        <Services />
      </div>
      <Portfolio />
      <Booking />
      <div id="contato">
        <Contact />
      </div>
      <Footer />
    </main>
  )
}
