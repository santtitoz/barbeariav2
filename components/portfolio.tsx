"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PortfolioImage {
  id: string
  url: string
  category: string
  alt: string
}

const defaultImages = [
  { id: "1", category: "cortes", alt: "Corte clássico masculino", url: "/placeholder.svg?height=300&width=300" },
  { id: "2", category: "barbas", alt: "Barba bem aparada", url: "/placeholder.svg?height=300&width=300" },
  { id: "3", category: "cortes", alt: "Corte moderno fade", url: "/placeholder.svg?height=300&width=300" },
  { id: "4", category: "barbas", alt: "Barba e bigode estilizados", url: "/placeholder.svg?height=300&width=300" },
  { id: "5", category: "cortes", alt: "Corte social elegante", url: "/placeholder.svg?height=300&width=300" },
  { id: "6", category: "barbas", alt: "Barba longa bem cuidada", url: "/placeholder.svg?height=300&width=300" },
  { id: "7", category: "cortes", alt: "Corte degradê moderno", url: "/placeholder.svg?height=300&width=300" },
  { id: "8", category: "barbas", alt: "Barba curta definida", url: "/placeholder.svg?height=300&width=300" },
]

export function Portfolio() {
  const [filter, setFilter] = useState("todos")
  const [images, setImages] = useState<PortfolioImage[]>(defaultImages)

  useEffect(() => {
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      if (!db) return

      const portfolioSnapshot = await getDocs(collection(db, "portfolio"))
      if (portfolioSnapshot.empty) {
        // Se não há imagens no banco, usar as padrão
        return
      }

      const portfolioData = portfolioSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PortfolioImage[]

      setImages(portfolioData)
    } catch (error) {
      console.error("Error loading portfolio:", error)
      // Em caso de erro, manter as imagens padrão
    }
  }

  const filteredImages = filter === "todos" ? images : images.filter((img) => img.category === filter)

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Portfolio</h2>
          <p className="text-xl text-gray-600 mb-8">Confira alguns dos nossos trabalhos mais recentes</p>

          <div className="flex justify-center gap-4 mb-8">
            <Button
              variant={filter === "todos" ? "default" : "outline"}
              onClick={() => setFilter("todos")}
              className={filter === "todos" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              Todos
            </Button>
            <Button
              variant={filter === "cortes" ? "default" : "outline"}
              onClick={() => setFilter("cortes")}
              className={filter === "cortes" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              Cortes
            </Button>
            <Button
              variant={filter === "barbas" ? "default" : "outline"}
              onClick={() => setFilter("barbas")}
              className={filter === "barbas" ? "bg-amber-500 hover:bg-amber-600" : ""}
            >
              Barbas
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-square bg-gray-200">
                <img
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg?height=300&width=300"
                  }}
                />
              </div>
            </Card>
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhuma imagem encontrada para esta categoria.</p>
          </div>
        )}
      </div>
    </section>
  )
}
