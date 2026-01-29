import { LogOut, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { redirect } from "next/navigation"
import { logout } from "@/actions/auth"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PetCardWrapper } from "@/components/pet-card-wrapper" // Client component for state
import { CreatePetModal } from "@/components/create-pet-modal"
import { prisma } from "@/lib/prisma"

export default async function Dashboard() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) {
    redirect("/login")
  }

  // Verify session/Get User ID if needed for specific fetching, 
  // currently we fetch all or just user's? Requirement: "Create... only owner can edit/delete". 
  // Usually dashboard shows all pets or user's pets? The image suggests a list. 
  // Let's fetch ALL pets for now, or filter by user if it's a personal dashboard. 
  // "Fluxo de Cadastro... O card irá receber infor...". 
  // Given the login context, it's likely a user dashboard.
  // I will fetch pets for the logged in user as per common practice, 
  // OR fetch all if it's a shared system. The mock showed multiple owners "Emmanuel Farias". 
  // I'll fetch ALL pets but mark ownership logic later if needed. 
  // Actually, let's just fetch all for this "Desafio Jr".

  const pets = await prisma.pet.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Calculate age helper
  const calculateAge = (birthDateString?: string) => {
    if (!birthDateString) return undefined
    const [day, month, year] = birthDateString.split('/').map(Number)
    if (!day || !month || !year) return undefined
    const birth = new Date(year, month - 1, day)
    const today = new Date()
    let age = today.getFullYear() - birth.getFullYear()
    const m = today.getMonth() - birth.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--
    }
    return `${age} Anos`
  }

  const formattedPets = pets.map(p => ({
    ...p,
    owner: p.ownerName || "Desconhecido", 
    age: calculateAge(p.birthDate || undefined)
  }))

  async function handleLogout() {
    "use server"
    await logout()
  }

  return (
    <div className="min-h-screen w-full bg-[#00060F] relative overflow-hidden text-slate-100 flex flex-col items-center p-4 md:p-8 font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] max-w-[1368px] max-h-[1482px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,102,255,0.2)_0%,rgba(0,32,79,0)_100%)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[60vw] max-w-[1295px] max-h-[841px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,102,255,0.45)_0%,rgba(0,32,79,0)_100%)] rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="w-full max-w-7xl flex items-center justify-between mb-8 z-10 relative">
        <h1 className="text-3xl font-bold text-slate-200">SoftPet</h1>
        <form action={handleLogout}>
            <Button 
            variant="ghost" 
            size="icon" 
            type="submit"
            className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
            <LogOut className="h-6 w-6" />
            </Button>
        </form>
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

        <CreatePetModal />
      </div>

      {/* Grid */}
      {/* We need a client wrapper for the selection state */}
      <PetCardWrapper pets={formattedPets} />

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
