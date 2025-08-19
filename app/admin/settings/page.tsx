"use client"

import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Clock, DollarSign, User } from "lucide-react"

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <AdminLayout currentPage="settings">
        <div className="space-y-6">
          {/* Business Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Informações da Barbearia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="business-name">Nome da Barbearia</Label>
                  <Input id="business-name" defaultValue="Barbearia Elite" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="business-phone">Telefone</Label>
                  <Input id="business-phone" defaultValue="(11) 99999-9999" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-address">Endereço</Label>
                <Input id="business-address" defaultValue="Rua das Flores, 123 - Centro - São Paulo/SP" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-description">Descrição</Label>
                <Textarea
                  id="business-description"
                  defaultValue="Transformando visual e autoestima há mais de 10 anos com cortes clássicos e modernos."
                  rows={3}
                />
              </div>

              <Button className="bg-amber-500 hover:bg-amber-600">Salvar Informações</Button>
            </CardContent>
          </Card>

          {/* Services & Pricing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Serviços e Preços
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Corte Tradicional</h4>
                    <p className="text-sm text-gray-600">45 minutos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-20" defaultValue="35" />
                    <span className="text-sm text-gray-600">R$</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Barba & Bigode</h4>
                    <p className="text-sm text-gray-600">30 minutos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-20" defaultValue="25" />
                    <span className="text-sm text-gray-600">R$</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Corte + Barba</h4>
                    <p className="text-sm text-gray-600">75 minutos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-20" defaultValue="55" />
                    <span className="text-sm text-gray-600">R$</span>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Corte Express</h4>
                    <p className="text-sm text-gray-600">25 minutos</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input className="w-20" defaultValue="25" />
                    <span className="text-sm text-gray-600">R$</span>
                  </div>
                </div>
              </div>

              <Button className="bg-amber-500 hover:bg-amber-600">Atualizar Preços</Button>
            </CardContent>
          </Card>

          {/* Working Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Horário de Funcionamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {[
                  { day: "Segunda-feira", start: "09:00", end: "18:00", enabled: true },
                  { day: "Terça-feira", start: "09:00", end: "18:00", enabled: true },
                  { day: "Quarta-feira", start: "09:00", end: "18:00", enabled: true },
                  { day: "Quinta-feira", start: "09:00", end: "18:00", enabled: true },
                  { day: "Sexta-feira", start: "09:00", end: "18:00", enabled: true },
                  { day: "Sábado", start: "08:00", end: "17:00", enabled: true },
                  { day: "Domingo", start: "09:00", end: "17:00", enabled: false },
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Switch defaultChecked={schedule.enabled} />
                      <span className="font-medium w-24">{schedule.day}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input type="time" defaultValue={schedule.start} className="w-32" disabled={!schedule.enabled} />
                      <span>às</span>
                      <Input type="time" defaultValue={schedule.end} className="w-32" disabled={!schedule.enabled} />
                    </div>
                  </div>
                ))}
              </div>

              <Button className="bg-amber-500 hover:bg-amber-600">Salvar Horários</Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Novos Agendamentos</h4>
                    <p className="text-sm text-gray-600">
                      Receber notificação por email quando houver novos agendamentos
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Lembrete de Agendamentos</h4>
                    <p className="text-sm text-gray-600">Enviar lembrete por email 1 dia antes do agendamento</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Relatórios Semanais</h4>
                    <p className="text-sm text-gray-600">Receber relatório semanal de agendamentos e receita</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <Button className="bg-amber-500 hover:bg-amber-600">Salvar Configurações</Button>
            </CardContent>
          </Card>

          {/* Account Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Configurações da Conta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email do Administrador</Label>
                  <Input id="admin-email" type="email" defaultValue="admin@barbearia.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-name">Nome do Administrador</Label>
                  <Input id="admin-name" defaultValue="Administrador" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-medium">Alterar Senha</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Senha Atual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova Senha</Label>
                    <Input id="new-password" type="password" />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button className="bg-amber-500 hover:bg-amber-600">Salvar Conta</Button>
                <Button variant="outline">Alterar Senha</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
