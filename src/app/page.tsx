"use client"

import { LogOut, Search, Plus, Cat, Dog, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { logout } from "@/actions/auth"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { toast } from "sonner"

// Mock data to match the image
const pets = [
  { id: 1, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT" },
  { id: 2, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG" },
  { id: 3, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT" },
  { id: 4, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG" },
  { id: 5, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT" },
  { id: 6, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG" },
  { id: 7, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT" },
  { id: 8, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG" },
  { id: 9, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT" },
  { id: 10, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG" },
  { id: 11, name: "Simba Farias", owner: "Emmanuel Farias", type: "CAT" },
  { id: 12, name: "Scooby Doo", owner: "Emmanuel Farias", type: "DOG" },
]

export default function Dashboard() {
  const router = useRouter()

  async function handleLogout() {
    await logout()
    toast.success("Saiu com sucesso")
    router.push("/login")
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

        <Button className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 rounded-lg h-12 flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
           <div className="bg-white/20 rounded-full p-0.5">
               <Plus className="h-4 w-4" />
           </div>
           Cadastrar
        </Button>
      </div>

      {/* Grid */}
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {pets.map((pet) => (
          <Card key={pet.id} className="bg-slate-900/50 border-none shadow-none hover:bg-slate-900 transition-colors cursor-pointer group">
            <CardContent className="p-4 flex items-center gap-4">
               {/* Icon Circle */}
               <div className={`rounded-full p-3 ${pet.type === 'CAT' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                  {pet.type === 'CAT' ? <Cat className="h-6 w-6" /> : <Dog className="h-6 w-6" />}
               </div>
               
               {/* Info */}
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     {/* Placeholder icon from Figma */}
                     <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                        {/* Add Pet/Collar Icon here */}
                     </div>
                     <span className="truncate text-slate-200 font-bold text-sm">
                        {pet.name}
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     {/* Placeholder icon from Figma */}
                     <div className="w-5 h-5 shrink-0 flex items-center justify-center">
                        {/* Add User Icon here */}
                     </div>
                     <span className="truncate text-slate-400 text-xs">
                        {pet.owner}
                     </span>
                  </div>
               </div>

               {/* Chevron */}
               <div className="text-slate-600 group-hover:text-slate-400">
                  <ChevronDown className="h-5 w-5" />
               </div>
            </CardContent>
          </Card>
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
