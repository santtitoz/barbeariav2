"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Clock, Save, Power, PowerOff } from "lucide-react"

interface WorkingHours {
  enabled: boolean
  start: string
  end: string
}

interface ScheduleConfig {
  monday: WorkingHours
  tuesday: WorkingHours
  wednesday: WorkingHours
  thursday: WorkingHours
  friday: WorkingHours
  saturday: WorkingHours
  sunday: WorkingHours
  isOpen: boolean
  closedMessage: string
}

const defaultSchedule: ScheduleConfig = {
  monday: { enabled: true, start: "09:00", end: "18:00" },
  tuesday: { enabled: true, start: "09:00", end: "18:00" },
  wednesday: { enabled: true, start: "09:00", end: "18:00" },
  thursday: { enabled: true, start: "09:00", end: "18:00" },
  friday: { enabled: true, start: "09:00", end: "18:00" },
  saturday: { enabled: true, start: "08:00", end: "17:00" },
  sunday: { enabled: false, start: "09:00", end: "17:00" },
  isOpen: true,
  closedMessage: "Barbearia temporariamente fechada",
}

const dayNames = {
  monday: "Segunda-feira",
  tuesday: "Terça-feira",
  wednesday: "Quarta-feira",
  thursday: "Thursday",
  friday: "Sexta-feira",
  saturday: "Sábado",
  sunday: "Domingo",
}

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleConfig>(defaultSchedule)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSchedule()
  }, [])

  const loadSchedule = async () => {
    try {
      const scheduleDoc = await getDoc(doc(db, "settings", "schedule"))
      if (scheduleDoc.exists()) {
        setSchedule({ ...defaultSchedule, ...scheduleDoc.data() })
      }
    } catch (error) {
      console.error("Error loading schedule:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveSchedule = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "settings", "schedule"), schedule)
      alert("Configurações salvas com sucesso!")
    } catch (error) {
      console.error("Error saving schedule:", error)
      alert("Erro ao salvar configurações")
    } finally {
      setSaving(false)
    }
  }

  const updateDaySchedule = (day: keyof typeof dayNames, field: keyof WorkingHours, value: any) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }))
  }

  const toggleBarbershop = async () => {
    const newStatus = !schedule.isOpen
    setSchedule((prev) => ({ ...prev, isOpen: newStatus }))

    try {
      await setDoc(doc(db, "settings", "schedule"), { ...schedule, isOpen: newStatus })
    } catch (error) {
      console.error("Error updating barbershop status:", error)
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="schedule">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="schedule">
        <div className="space-y-6">
          {/* Status da Barbearia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {schedule.isOpen ? (
                  <Power className="w-5 h-5 text-green-600" />
                ) : (
                  <PowerOff className="w-5 h-5 text-red-600" />
                )}
                Status da Barbearia
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Barbearia {schedule.isOpen ? "Aberta" : "Fechada"}</h3>
                  <p className="text-sm text-gray-600">
                    {schedule.isOpen ? "Clientes podem fazer agendamentos" : "Agendamentos temporariamente suspensos"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={schedule.isOpen ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {schedule.isOpen ? "ABERTA" : "FECHADA"}
                  </Badge>
                  <Button
                    onClick={toggleBarbershop}
                    className={schedule.isOpen ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
                  >
                    {schedule.isOpen ? "Fechar Barbearia" : "Abrir Barbearia"}
                  </Button>
                </div>
              </div>

              {!schedule.isOpen && (
                <div className="mt-4 space-y-2">
                  <Label htmlFor="closedMessage">Mensagem para Clientes</Label>
                  <Input
                    id="closedMessage"
                    value={schedule.closedMessage}
                    onChange={(e) => setSchedule((prev) => ({ ...prev, closedMessage: e.target.value }))}
                    placeholder="Mensagem exibida quando a barbearia está fechada"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Horários de Funcionamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horários de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(dayNames).map(([day, dayName]) => (
                  <div key={day} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch
                        checked={schedule[day as keyof typeof dayNames].enabled}
                        onCheckedChange={(checked) =>
                          updateDaySchedule(day as keyof typeof dayNames, "enabled", checked)
                        }
                      />
                      <span className="font-medium w-32">{dayName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={schedule[day as keyof typeof dayNames].start}
                        onChange={(e) => updateDaySchedule(day as keyof typeof dayNames, "start", e.target.value)}
                        className="w-32"
                        disabled={!schedule[day as keyof typeof dayNames].enabled}
                      />
                      <span>às</span>
                      <Input
                        type="time"
                        value={schedule[day as keyof typeof dayNames].end}
                        onChange={(e) => updateDaySchedule(day as keyof typeof dayNames, "end", e.target.value)}
                        className="w-32"
                        disabled={!schedule[day as keyof typeof dayNames].enabled}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={saveSchedule}
                  disabled={saving}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Salvando..." : "Salvar Horários"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resumo dos Horários */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo dos Horários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(dayNames).map(([day, dayName]) => {
                  const daySchedule = schedule[day as keyof typeof dayNames]
                  return (
                    <div key={day} className="p-3 border rounded-lg">
                      <div className="font-medium">{dayName}</div>
                      {daySchedule.enabled ? (
                        <div className="text-sm text-green-600">
                          {daySchedule.start} - {daySchedule.end}
                        </div>
                      ) : (
                        <div className="text-sm text-red-600">Fechado</div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
