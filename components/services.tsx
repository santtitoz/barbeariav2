"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Scissors, RadarIcon as Razor, Sparkles, Clock } from "lucide-react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
}

const defaultServices = [
  {
    id: "corte",
    name: "Corte Tradicional",
    description: "Cortes clássicos com técnicas tradicionais de barbearia",
    price: 35,
    duration: 45,
  },
  {
    id: "barba",
    name: "Barba & Bigode",
    description: "Aparar e modelar barba com navalha e produtos premium",
    price: 25,
    duration: 30,
  },
  {
    id: "completo",
    name: "Corte + Barba",
    description: "Pacote completo para um visual impecável",
    price: 55,
    duration: 75,
  },
  {
    id: "express",
    name: "Corte Express",
    description: "Corte rápido para quem tem pressa, sem perder a qualidade",
    price: 25,
    duration: 25,
  },
]

const getServiceIcon = (index: number) => {
  const icons = [Scissors, Razor, Sparkles, Clock]
  return icons[index % icons.length]
}

export function Services() {
  const [services, setServices] = useState<Service[]>(defaultServices)

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    try {
      if (!db) return

      const servicesSnapshot = await getDocs(collection(db, "services"))
      if (servicesSnapshot.empty) {
        // Se não há serviços no banco, usar os padrão
        return
      }

      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[]

      setServices(servicesData)
    } catch (error) {
      console.error("Error loading services:", error)
      // Em caso de erro, manter os serviços padrão
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Nossos Serviços</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Oferecemos uma gama completa de serviços para cuidar do seu visual
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = getServiceIcon(index)
            return (
              <Card key={service.id} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-amber-600">R$ {service.price}</span>
                    <span className="text-sm text-gray-500">{service.duration} min</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
