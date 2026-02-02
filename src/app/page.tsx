import { LogOut, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { redirect } from "next/navigation"
import { logout } from "@/actions/auth"
import { cookies } from "next/headers"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PetCardWrapper } from "@/components/pet-card-wrapper" // Client component for state
import { CreatePetModal } from "@/components/create-pet-modal"
import { prisma } from "@/lib/prisma"

import { jwtVerify } from "jose"

const secretKey = process.env.JWT_SECRET || "default-dev-secret"
const key = new TextEncoder().encode(secretKey)

interface DashboardProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Dashboard(props: DashboardProps) {
  const searchParams = await props.searchParams
  const query = typeof searchParams.q === 'string' ? searchParams.q : undefined
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value

  if (!session) {
    redirect("/login")
  }

  let userId: number
  try {
    const { payload } = await jwtVerify(session, key, { algorithms: ["HS256"] })
    userId = Number(payload.sub) || Number(payload.userId) // Fallback for old tokens if any
  } catch (error) {
    console.error(error)
    redirect("/login")
  }

  const pets = await prisma.pet.findMany({
    where: query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { ownerName: { contains: query, mode: 'insensitive' } }
      ]
    } : undefined,
    orderBy: { createdAt: 'desc' },
  })


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
    <div className="min-h-screen w-full bg-[#00060F] relative overflow-hidden text-slate-100 flex flex-col items-center p-3 md:p-8 font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-[-20%] left-[-20%] w-[90vw] h-[90vw] md:w-[80vw] md:h-[80vw] max-w-[1368px] max-h-[1482px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,102,255,0.2)_0%,rgba(0,32,79,0)_100%)] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[80vw] h-[70vw] md:w-[70vw] md:h-[60vw] max-w-[1295px] max-h-[841px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(0,102,255,0.45)_0%,rgba(0,32,79,0)_100%)] rounded-full blur-3xl pointer-events-none" />

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
        <form className="flex-1 relative">
            <div className="relative w-full flex items-center bg-transparent border-3 border-[#404A5C] rounded-[10px] h-14  focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-inner">
            <div className="bg-[#404A5C] rounded-l-[5px] w-12 h-13 flex items-center justify-center">
              <Search className="h-6 w-6 text-[#0F1629]" />
            </div>
                
                <Input 
                    name="q"
                    defaultValue={query}
                    placeholder="Buscar por pet ou dono..." 
                    className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-200 placeholder:text-slate-500 h-full text-base"
                />
                <Button type="submit" className="bg-[#404A5C] mr-2 hover:bg-slate-700 text-slate-200 font-medium px-6 rounded-[5px] h-10 shadow-sm">
                    Pesquisar
                </Button>
            </div>
        </form>

        <CreatePetModal />
      </div>

      {/* Grid */}
      {/* We need a client wrapper for the selection state */}
      <PetCardWrapper pets={formattedPets} currentUserId={userId} />

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
