"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/admin/protected-route"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { doc, getDoc, setDoc, collection, addDoc, getDocs, deleteDoc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { Scissors, Save, Plus, Edit, Trash2, Upload, ImageIcon } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number
}

interface BarbershopInfo {
  name: string
  description: string
  phone: string
  address: string
  instagram: string
  facebook: string
}

interface PortfolioImage {
  id: string
  url: string
  category: string
  alt: string
}

export default function BarbershopPage() {
  const [services, setServices] = useState<Service[]>([])
  const [barbershopInfo, setBarbershopInfo] = useState<BarbershopInfo>({
    name: "Barbearia Elite",
    description: "Transformando visual e autoestima há mais de 10 anos com cortes clássicos e modernos.",
    phone: "(11) 99999-9999",
    address: "Rua das Flores, 123 - Centro - São Paulo/SP",
    instagram: "@barbearia_elite",
    facebook: "Barbearia Elite",
  })
  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 0,
    duration: 30,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // Load barbershop info
      const infoDoc = await getDoc(doc(db, "settings", "barbershop"))
      if (infoDoc.exists()) {
        setBarbershopInfo({ ...barbershopInfo, ...infoDoc.data() })
      }

      // Load services
      const servicesSnapshot = await getDocs(collection(db, "services"))
      const servicesData = servicesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[]
      setServices(servicesData)

      // Load portfolio images
      const portfolioSnapshot = await getDocs(collection(db, "portfolio"))
      const portfolioData = portfolioSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PortfolioImage[]
      setPortfolioImages(portfolioData)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const saveBarbershopInfo = async () => {
    setSaving(true)
    try {
      await setDoc(doc(db, "settings", "barbershop"), barbershopInfo)
      alert("Informações da barbearia salvas com sucesso!")
    } catch (error) {
      console.error("Error saving barbershop info:", error)
      alert("Erro ao salvar informações")
    } finally {
      setSaving(false)
    }
  }

  const addService = async () => {
    if (!newService.name || !newService.description || newService.price <= 0) {
      alert("Preencha todos os campos do serviço")
      return
    }

    try {
      const docRef = await addDoc(collection(db, "services"), newService)
      setServices([...services, { id: docRef.id, ...newService }])
      setNewService({ name: "", description: "", price: 0, duration: 30 })
      alert("Serviço adicionado com sucesso!")
    } catch (error) {
      console.error("Error adding service:", error)
      alert("Erro ao adicionar serviço")
    }
  }

  const updateService = async (service: Service) => {
    try {
      await updateDoc(doc(db, "services", service.id), {
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
      })
      setServices(services.map((s) => (s.id === service.id ? service : s)))
      setEditingService(null)
      alert("Serviço atualizado com sucesso!")
    } catch (error) {
      console.error("Error updating service:", error)
      alert("Erro ao atualizar serviço")
    }
  }

  const deleteService = async (serviceId: string) => {
    try {
      await deleteDoc(doc(db, "services", serviceId))
      setServices(services.filter((s) => s.id !== serviceId))
      alert("Serviço excluído com sucesso!")
    } catch (error) {
      console.error("Error deleting service:", error)
      alert("Erro ao excluir serviço")
    }
  }

  const uploadImage = async (file: File, category: string) => {
    if (!storage) {
      alert("Storage não disponível")
      return
    }

    try {
      const imageRef = ref(storage, `portfolio/${Date.now()}_${file.name}`)
      await uploadBytes(imageRef, file)
      const url = await getDownloadURL(imageRef)

      const portfolioData = {
        url,
        category,
        alt: `${category} - ${file.name}`,
      }

      const docRef = await addDoc(collection(db, "portfolio"), portfolioData)
      setPortfolioImages([...portfolioImages, { id: docRef.id, ...portfolioData }])
      alert("Imagem adicionada ao portfolio!")
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Erro ao fazer upload da imagem")
    }
  }

  const deleteImage = async (imageId: string) => {
    try {
      await deleteDoc(doc(db, "portfolio", imageId))
      setPortfolioImages(portfolioImages.filter((img) => img.id !== imageId))
      alert("Imagem removida do portfolio!")
    } catch (error) {
      console.error("Error deleting image:", error)
      alert("Erro ao remover imagem")
    }
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <AdminLayout currentPage="barbershop">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          </div>
        </AdminLayout>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <AdminLayout currentPage="barbershop">
        <div className="space-y-6">
          {/* Informações da Barbearia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scissors className="w-5 h-5" />
                Informações da Barbearia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Barbearia</Label>
                  <Input
                    id="name"
                    value={barbershopInfo.name}
                    onChange={(e) => setBarbershopInfo({ ...barbershopInfo, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={barbershopInfo.phone}
                    onChange={(e) => setBarbershopInfo({ ...barbershopInfo, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  value={barbershopInfo.address}
                  onChange={(e) => setBarbershopInfo({ ...barbershopInfo, address: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={barbershopInfo.description}
                  onChange={(e) => setBarbershopInfo({ ...barbershopInfo, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={barbershopInfo.instagram}
                    onChange={(e) => setBarbershopInfo({ ...barbershopInfo, instagram: e.target.value })}
                    placeholder="@barbearia_elite"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={barbershopInfo.facebook}
                    onChange={(e) => setBarbershopInfo({ ...barbershopInfo, facebook: e.target.value })}
                    placeholder="Barbearia Elite"
                  />
                </div>
              </div>

              <Button
                onClick={saveBarbershopInfo}
                disabled={saving}
                className="bg-amber-500 hover:bg-amber-600 text-black font-bold"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Salvando..." : "Salvar Informações"}
              </Button>
            </CardContent>
          </Card>

          {/* Gerenciar Serviços */}
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Serviços</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Adicionar Novo Serviço */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-4">Adicionar Novo Serviço</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input
                    placeholder="Nome do serviço"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  />
                  <Input
                    placeholder="Descrição"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Preço (R$)"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  />
                  <Input
                    type="number"
                    placeholder="Duração (min)"
                    value={newService.duration}
                    onChange={(e) => setNewService({ ...newService, duration: Number(e.target.value) })}
                  />
                </div>
                <Button onClick={addService} className="mt-4 bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Serviço
                </Button>
              </div>

              {/* Lista de Serviços */}
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.id} className="p-4 border rounded-lg">
                    {editingService?.id === service.id ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            value={editingService.name}
                            onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                          />
                          <Input
                            value={editingService.description}
                            onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                          />
                          <Input
                            type="number"
                            value={editingService.price}
                            onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                          />
                          <Input
                            type="number"
                            value={editingService.duration}
                            onChange={(e) => setEditingService({ ...editingService, duration: Number(e.target.value) })}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => updateService(editingService)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Salvar
                          </Button>
                          <Button variant="outline" onClick={() => setEditingService(null)}>
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{service.name}</h4>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <div className="flex gap-4 mt-2">
                            <Badge>R$ {service.price}</Badge>
                            <Badge variant="outline">{service.duration} min</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setEditingService(service)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Excluir Serviço</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o serviço "{service.name}"?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteService(service.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Gerenciar Portfolio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Gerenciar Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload de Imagens */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <h3 className="font-medium mb-4">Adicionar Imagens ao Portfolio</h3>
                <div className="flex gap-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        const category = prompt("Categoria da imagem (cortes/barbas):")
                        if (category) {
                          uploadImage(file, category)
                        }
                      }
                    }}
                    className="hidden"
                    id="portfolio-upload"
                  />
                  <label htmlFor="portfolio-upload">
                    <Button asChild className="bg-blue-600 hover:bg-blue-700">
                      <span>
                        <Upload className="w-4 h-4 mr-2" />
                        Adicionar Imagem
                      </span>
                    </Button>
                  </label>
                </div>
              </div>

              {/* Grid de Imagens */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {portfolioImages.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt}
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=128&width=128"
                      }}
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="destructive" onClick={() => deleteImage(image.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge className="text-xs">{image.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              {portfolioImages.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma imagem no portfolio. Adicione algumas imagens para mostrar seus trabalhos!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ProtectedRoute>
  )
}
