"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MessageSquare, Lock } from "lucide-react"
import { collection, addDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { AuthModal } from "@/components/auth/auth-modal"

const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

const services = [
  { id: "corte", name: "Corte Tradicional", price: 35 },
  { id: "barba", name: "Barba & Bigode", price: 25 },
  { id: "completo", name: "Corte + Barba", price: 55 },
  { id: "express", name: "Corte Express", price: 25 },
]

export function Booking() {
  const { user, userProfile } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    service: "",
    date: "",
    time: "",
    notes: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      setAuthModalOpen(true)
      return
    }

    setIsSubmitting(true)

    try {
      await addDoc(collection(db, "appointments"), {
        ...formData,
        name: user.displayName || userProfile?.name || "Cliente",
        phone: userProfile?.phone || "",
        email: user.email,
        userId: user.uid,
        createdAt: new Date(),
        status: "pending",
      })

      setSubmitted(true)
      setFormData({
        service: "",
        date: "",
        time: "",
        notes: "",
      })
    } catch (error) {
      console.error("Erro ao agendar:", error)
      alert("Erro ao agendar. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <section id="agendamento" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center p-8">
              <CardContent>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Agendamento Confirmado!</h3>
                <p className="text-gray-600 mb-6">
                  Seu agendamento foi recebido com sucesso. Entraremos em contato em breve para confirmar.
                </p>
                <Button onClick={() => setSubmitted(false)} className="bg-amber-500 hover:bg-amber-600">
                  Fazer Novo Agendamento
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <>
      <section id="agendamento" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Agende seu Horário</h2>
            <p className="text-xl text-gray-600">
              {user
                ? "Preencha o formulário abaixo para agendar seu horário"
                : "Faça login ou crie uma conta para agendar seu horário"}
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            {!user ? (
              <Card className="text-center p-8">
                <CardContent>
                  <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-amber-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Login Necessário</h3>
                  <p className="text-gray-600 mb-6">Para agendar um horário, você precisa estar logado em sua conta.</p>
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={() => setAuthModalOpen(true)}
                      className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
                    >
                      Fazer Login
                    </Button>
                    <Button variant="outline" onClick={() => setAuthModalOpen(true)}>
                      Criar Conta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-amber-500" />
                    Dados do Agendamento
                  </CardTitle>
                  <p className="text-sm text-gray-600">Logado como: {user.displayName || user.email}</p>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Serviço</Label>
                      <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service.id} value={service.id}>
                              {service.name} - R$ {service.price}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="date">Data Preferida</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange("date", e.target.value)}
                          required
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Horário Preferido
                        </Label>
                        <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                          <SelectContent>
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes" className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4" />
                        Observações (opcional)
                      </Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => handleInputChange("notes", e.target.value)}
                        placeholder="Alguma observação especial sobre o corte ou serviço..."
                        rows={3}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Agendando..." : "Confirmar Agendamento"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode="login" />
    </>
  )
}
