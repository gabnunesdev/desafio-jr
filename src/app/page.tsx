"use client"

import { LogOut, Search, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/auth"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { PetCard } from "@/components/pet-card"

// Mock data to match the image
const pets = [
  { id: 1, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT", breed: "Persa", phone: "(81) 9 8240-2134", birthDate: "22/08/2020", age: "2 Anos" },
  { id: 2, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG", breed: "Dogue Alemão", phone: "(81) 9 8240-2134", birthDate: "15/05/2019", age: "3 Anos" },
  { id: 3, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT", breed: "Siamês", phone: "(81) 9 8240-2134", birthDate: "22/08/2020", age: "2 Anos" },
  { id: 4, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG", breed: "Vira-Lata", phone: "(81) 9 8240-2134", birthDate: "10/01/2022", age: "1 Ano" },
  { id: 5, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT", breed: "Persa", phone: "(81) 9 8240-2134", birthDate: "22/08/2020", age: "2 Anos" },
  { id: 6, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG", breed: "Dogue Alemão", phone: "(81) 9 8240-2134", birthDate: "15/05/2019", age: "3 Anos" },
  { id: 7, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT", breed: "Siamês", phone: "(81) 9 8240-2134", birthDate: "22/08/2020", age: "2 Anos" },
  { id: 8, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG", breed: "Vira-Lata", phone: "(81) 9 8240-2134", birthDate: "10/01/2022", age: "1 Ano" },
  { id: 9, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT", breed: "Persa", phone: "(81) 9 8240-2134", birthDate: "22/08/2020", age: "2 Anos" },
  { id: 10, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG", breed: "Dogue Alemão", phone: "(81) 9 8240-2134", birthDate: "15/05/2019", age: "3 Anos" },
  { id: 11, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT", breed: "Siamês", phone: "(81) 9 8240-2134", birthDate: "22/08/2020", age: "2 Anos" },
  { id: 12, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG", breed: "Vira-Lata", phone: "(81) 9 8240-2134", birthDate: "10/01/2022", age: "1 Ano" },
]

export default function Dashboard() {
  const router = useRouter()
  // Store ID of selected pet. Null means none selected.
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null)

  async function handleLogout() {
    await logout()
    toast.success("Saiu com sucesso")
    router.push("/login")
  }

  function handleSelectPet(id: number) {
     // Toggle selection
     setSelectedPetId(prevId => prevId === id ? null : id)
  }

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center p-4 md:p-8 font-sans">
      
      {/* Header */}
      <header className="w-full max-w-7xl flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-slate-200">SoftPet</h1>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleLogout}
          className="text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="h-6 w-6" />
        </Button>
      </header>

      {/* Controls */}
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 flex gap-2 relative">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <Input 
                    placeholder="" 
                    className="w-full pl-10 bg-slate-900/50 border-slate-800 text-slate-200 focus:border-blue-500/50 focus:ring-blue-500/20 rounded-lg h-12"
                />
            </div>
            
            <Button className="bg-slate-700 hover:bg-slate-600 text-slate-100 font-medium px-6 rounded-lg h-12">
                Pesquisar
            </Button>
        </div>

        <Button className="bg-[linear-gradient(90deg,#00CAFC_0%,#0056E2_100%)] hover:bg-blue-500 text-white font-semibold px-6 rounded-lg h-12 flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
           <div className="bg-white/20 rounded-full p-0.5">
               <Plus className="h-4 w-4" />
           </div>
           Cadastrar
        </Button>
      </div>

      {/* Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {pets.map((pet) => (
           <PetCard 
                key={pet.id} 
                pet={pet} 
                isSelected={selectedPetId === pet.id} 
                onSelect={handleSelectPet} 
            />
        ))}
      </div>

      {/* Pagination */}
      <div className="w-full max-w-7xl flex justify-end mt-8 items-center gap-2 text-slate-400 text-sm font-medium">
          <Button variant="ghost" size="icon" className="hover:text-white hover:bg-slate-800">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span>1 de 365</span>
          <Button variant="ghost" size="icon" className="hover:text-white hover:bg-slate-800">
            <ChevronRight className="h-5 w-5" />
          </Button>
      </div>

    </div>
  )
}
