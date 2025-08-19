"use client"

import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Mail, Calendar, Search } from "lucide-react"

interface Client {
  id: string
  name: string
  phone: string
  email: string
  totalAppointments: number
  lastAppointment: string
  totalSpent: number
  status: "active" | "inactive"
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [filteredClients, setFilteredClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadClients()
  }, [])

  useEffect(() => {
    filterClients()
  }, [clients, searchTerm])

  const loadClients = async () => {
    try {
      const appointmentsRef = collection(db, "appointments")
      const snapshot = await getDocs(appointmentsRef)
      const appointments = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

      // Group appointments by client
      const clientsMap = new Map<string, Client>()

      appointments.forEach((appointment: any) => {
        const clientKey = appointment.email

        if (!clientsMap.has(clientKey)) {
          clientsMap.set(clientKey, {
            id: clientKey,
            name: appointment.name,
            phone: appointment.phone,
            email: appointment.email,
            totalAppointments: 0,
            lastAppointment: appointment.date,
            totalSpent: 0,
            status: "active",
          })
        }

        const client = clientsMap.get(clientKey)!
        client.totalAppointments++

        // Update last appointment if this one is more recent
        if (appointment.date > client.lastAppointment) {
          client.lastAppointment = appointment.date
        }

        // Calculate total spent
        const servicePrice = getServicePrice(appointment.service)
        if (appointment.status === "confirmed") {
          client.totalSpent += servicePrice
        }

        // Determine status based on last appointment
        const lastAppointmentDate = new Date(client.lastAppointment)
        const threeMonthsAgo = new Date()
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

        client.status = lastAppointmentDate > threeMonthsAgo ? "active" : "inactive"
      })

      const clientsArray = Array.from(clientsMap.values()).sort((a, b) => b.totalAppointments - a.totalAppointments)

      setClients(clientsArray)
    } catch (error) {
      console.error("Error loading clients:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterClients = () => {
    let filtered = clients

    if (searchTerm) {
      filtered = filtered.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.phone.includes(searchTerm) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredClients(filtered)
  }

  const getServicePrice = (serviceId: string) => {
    const prices: { [key: string]: number } = {
      corte: 35,
      barba: 25,
      completo: 55,
      express: 25,
    }
    return prices[serviceId] || 0
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-100 text-green-800">Ativo</Badge>
    ) : (
      <Badge className="bg-gray-100 text-gray-800">Inativo</Badge>
    )
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="clients">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="clients">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.filter((c) => c.status === "active").length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {clients.reduce((total, client) => total + client.totalSpent, 0)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Média por Cliente</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R${" "}
                  {clients.length > 0
                    ? Math.round(clients.reduce((total, client) => total + client.totalSpent, 0) / clients.length)
                    : 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card>
            <CardHeader>
              <CardTitle>Buscar Clientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nome, telefone ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clients List */}
          <div className="grid gap-4">
            {filteredClients.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">Nenhum cliente encontrado</p>
                </CardContent>
              </Card>
            ) : (
              filteredClients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium text-lg">{client.name}</span>
                          </div>
                          {getStatusBadge(client.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {client.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {client.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            Último: {client.lastAppointment}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
                        <div className="text-center lg:text-right">
                          <div className="text-sm text-gray-500">Agendamentos</div>
                          <div className="text-xl font-bold">{client.totalAppointments}</div>
                        </div>
                        <div className="text-center lg:text-right">
                          <div className="text-sm text-gray-500">Total Gasto</div>
                          <div className="text-xl font-bold text-green-600">R$ {client.totalSpent}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
