import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Clock, Instagram, Facebook } from "lucide-react"

export function Contact() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Contato & Localização</h2>
          <p className="text-xl text-gray-600">Venha nos visitar ou entre em contato</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Endereço</h3>
              <p className="text-gray-600 text-sm">
                Rua das Flores, 123
                <br />
                Centro - São Paulo/SP
                <br />
                CEP: 01234-567
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Telefone</h3>
              <p className="text-gray-600 text-sm">
                (11) 99999-9999
                <br />
                (11) 3333-4444
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Horário</h3>
              <p className="text-gray-600 text-sm">
                Seg - Sex: 9h às 18h
                <br />
                Sábado: 8h às 17h
                <br />
                Domingo: Fechado
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Instagram className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-semibold mb-2">Redes Sociais</h3>
              <div className="flex justify-center gap-4">
                <Instagram className="w-5 h-5 text-gray-600 hover:text-amber-600 cursor-pointer" />
                <Facebook className="w-5 h-5 text-gray-600 hover:text-amber-600 cursor-pointer" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.6333824!3d-23.5505199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjkiUyA0NsKwMzgnMDAuMiJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização da Barbearia Elite"
                ></iframe>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
