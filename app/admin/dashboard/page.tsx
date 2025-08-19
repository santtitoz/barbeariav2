"use client"

import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, TrendingUp, DollarSign, User, Phone, Filter, Download, RefreshCw } from "lucide-react"

interface DashboardStats {
  totalAppointments: number
  todayAppointments: number
  weekAppointments: number
  monthAppointments: number
  totalClients: number
  monthlyRevenue: number
  weeklyRevenue: number
  pendingAppointments: number
  confirmedAppointments: number
  cancelledAppointments: number
}

interface AppointmentData {
  id: string
  name: string
  phone: string
  email: string
  service: string
  date: string
  time: string
  status: string
  notes?: string
  createdAt: any
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalAppointments: 0,
    todayAppointments: 0,
    weekAppointments: 0,
    monthAppointments: 0,
    totalClients: 0,
    monthlyRevenue: 0,
    weeklyRevenue: 0,
    pendingAppointments: 0,
    confirmedAppointments: 0,
    cancelledAppointments: 0,
  })
  const [appointments, setAppointments] = useState<AppointmentData[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<AppointmentData[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState("today")
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadDashboardData()
  }, [])

  useEffect(() => {
    filterAppointments()
  }, [appointments, dateFilter, statusFilter, searchTerm])

  const loadDashboardData = async () => {
    try {
      // Get all appointments
      const appointmentsRef = collection(db, "appointments")
      const appointmentsSnapshot = await getDocs(query(appointmentsRef, orderBy("createdAt", "desc")))
      const appointmentsData = appointmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AppointmentData[]

      setAppointments(appointmentsData)

      // Calculate dates
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)

      // Calculate stats
      const totalAppointments = appointmentsData.length
      const todayAppointments = appointmentsData.filter((apt) => apt.date === todayStr).length
      const weekAppointments = appointmentsData.filter((apt) => new Date(apt.date) >= weekStart).length
      const monthAppointments = appointmentsData.filter((apt) => new Date(apt.date) >= monthStart).length

      const pendingAppointments = appointmentsData.filter((apt) => apt.status === "pending").length
      const confirmedAppointments = appointmentsData.filter((apt) => apt.status === "confirmed").length
      const cancelledAppointments = appointmentsData.filter((apt) => apt.status === "cancelled").length

      // Get unique clients
      const uniqueClients = new Set(appointmentsData.map((apt) => apt.email))
      const totalClients = uniqueClients.size

      // Calculate revenue
      const monthlyRevenue = appointmentsData
        .filter((apt) => new Date(apt.date) >= monthStart && apt.status === "confirmed")
        .reduce((total, apt) => total + getServicePrice(apt.service), 0)

      const weeklyRevenue = appointmentsData
        .filter((apt) => new Date(apt.date) >= weekStart && apt.status === "confirmed")
        .reduce((total, apt) => total + getServicePrice(apt.service), 0)

      setStats({
        totalAppointments,
        todayAppointments,
        weekAppointments,
        monthAppointments,
        totalClients,
        monthlyRevenue,
        weeklyRevenue,
        pendingAppointments,
        confirmedAppointments,
        cancelledAppointments,
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterAppointments = () => {
    let filtered = appointments

    // Filter by date
    const today = new Date()
    const todayStr = today.toISOString().split("T")[0]

    switch (dateFilter) {
      case "today":
        filtered = filtered.filter((apt) => apt.date === todayStr)
        break
      case "week":
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
        filtered = filtered.filter((apt) => new Date(apt.date) >= weekStart)
        break
      case "month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        filtered = filtered.filter((apt) => new Date(apt.date) >= monthStart)
        break
      case "all":
      default:
        break
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          apt.phone.includes(searchTerm) ||
          apt.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredAppointments(filtered)
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

  const getServiceName = (serviceId: string) => {
    const names: { [key: string]: string } = {
      corte: "Corte Tradicional",
      barba: "Barba & Bigode",
      completo: "Corte + Barba",
      express: "Corte Express",
    }
    return names[serviceId] || serviceId
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>
    }
  }

  const exportData = () => {
    const csvContent = [
      ["Nome", "Telefone", "Email", "Serviço", "Data", "Horário", "Status", "Observações"].join(","),
      ...filteredAppointments.map((apt) =>
        [
          apt.name,
          apt.phone,
          apt.email,
          getServiceName(apt.service),
          apt.date,
          apt.time,
          apt.status,
          apt.notes || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `agendamentos_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="dashboard">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="dashboard">
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hoje</CardTitle>
                <Clock className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.todayAppointments}</div>
                <p className="text-xs text-muted-foreground">agendamentos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Esta Semana</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.weekAppointments}</div>
                <p className="text-xs text-muted-foreground">agendamentos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Este Mês</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{stats.monthAppointments}</div>
                <p className="text-xs text-muted-foreground">agendamentos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{stats.pendingAppointments}</div>
                <p className="text-xs text-muted-foreground">aguardando</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">R$ {stats.monthlyRevenue}</div>
                <p className="text-xs text-muted-foreground">confirmados</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros e Ações
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={loadDashboardData} size="sm">
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Atualizar
                  </Button>
                  <Button variant="outline" onClick={exportData} size="sm">
                    <Download className="w-4 h-4 mr-1" />
                    Exportar
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">Esta Semana</SelectItem>
                    <SelectItem value="month">Este Mês</SelectItem>
                    <SelectItem value="all">Todos</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setDateFilter("today")
                    setStatusFilter("all")
                  }}
                >
                  Limpar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appointments List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Agendamentos ({filteredAppointments.length})
                {dateFilter === "today" && ` - ${new Date().toLocaleDateString("pt-BR")}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAppointments.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Nenhum agendamento encontrado</p>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">{appointment.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">{appointment.phone}</span>
                          </div>
                          <div className="text-lg font-bold text-blue-600">
                            {appointment.date} - {appointment.time}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Serviço:</span> {getServiceName(appointment.service)} - R${" "}
                          {getServicePrice(appointment.service)}
                        </div>
                        {appointment.notes && (
                          <div className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Obs:</span> {appointment.notes}
                          </div>
                        )}
                      </div>
                      <div className="text-right">{getStatusBadge(appointment.status)}</div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
