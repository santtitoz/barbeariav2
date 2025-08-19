import { Scissors, Instagram, Facebook, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-amber-500 rounded-lg">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Barbearia Elite</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transformando visual e autoestima há mais de 10 anos com cortes clássicos e modernos.
            </p>
            <div className="flex gap-4">
              <Instagram className="w-5 h-5 text-gray-400 hover:text-amber-500 cursor-pointer transition-colors" />
              <Facebook className="w-5 h-5 text-gray-400 hover:text-amber-500 cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Corte Tradicional</li>
              <li>Barba & Bigode</li>
              <li>Corte + Barba</li>
              <li>Corte Express</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Horários</h3>
            <ul className="space-y-2 text-gray-400">
              <li>Segunda - Sexta: 9h às 18h</li>
              <li>Sábado: 8h às 17h</li>
              <li>Domingo: Fechado</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Rua das Flores, 123 - Centro</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">(11) 99999-9999</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Barbearia Elite. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
