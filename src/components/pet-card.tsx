import { useState } from "react"
import { ChevronDown, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { EditPetModal } from "./edit-pet-modal"

interface Pet {
    id: number
    name: string
    owner: string
    type: string
    breed?: string
    phone?: string
    birthDate?: string
    age?: string
    ownerId: number // Added ownerId
    ownerName?: string | null
    ownerPhone?: string | null
}

interface PetCardProps {
    pet: Pet
    isSelected: boolean
    onSelect: (id: number) => void
    currentUserId: number // Added currentUserId
}

export function PetCard({ pet, isSelected, onSelect, currentUserId }: PetCardProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const isOwner = currentUserId === pet.ownerId

    // Base classes
    const containerClasses = `
        relative
        bg-slate-900/50 
        transition-all duration-300 
        cursor-pointer 
        group
        ${isSelected 
            ? "border border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.5)] z-10 scale-[1.02] bg-slate-900" 
            : "border border-transparent hover:border-blue-500/50 hover:bg-slate-900"
        }
        rounded-xl
        overflow-hidden
    `

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent card selection when clicking edit
        setIsEditModalOpen(true)
    }

    return (
        <>
            <Card 
                className={containerClasses}
                onClick={() => onSelect(pet.id)}
            >
                <CardContent className="p-4">
                    {/* Header Section (Always Visible) */}
                    <div className="flex items-center gap-4">
                        {/* Icon Circle */}
                        <div className="rounded-full p-3 bg-[linear-gradient(90deg,#00CAFC_0%,#0056E2_100%)] flex items-center justify-center shrink-0">
                            {pet.type === 'CAT' ? (
                                <Image src="/cat-icon.svg" alt="Gato" width={32} height={32} className="h-8 w-8" />
                            ) : (
                                <Image src="/dog-icon.svg" alt="Cachorro" width={32} height={32} className="h-8 w-8" />
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <Image src="/collar-icon.svg" alt="Coleira" width={16} height={16} className="w-4 h-4 text-slate-200" />
                                <span className="truncate text-slate-200 font-bold text-sm">
                                    {pet.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Image src="/user-icon.svg" alt="Dono" width={20} height={20} className="w-4 h-4 text-slate-400" />
                                <span className="truncate text-slate-400 text-xs">
                                    {pet.owner}
                                </span>
                            </div>
                        </div>

                        {/* Chevron */}
                        <div className={`text-white transition-transform duration-300 ${isSelected ? "rotate-180" : "group-hover:text-slate-400"}`}>
                             <ChevronDown className="h-5 w-5" />
                        </div>
                    </div>

                     {/* Expanded Details Section */}
                    <div className={`
                        grid transition-all duration-300 ease-in-out text-sm text-slate-300 gap-3
                        ${isSelected ? "grid-rows-[1fr] opacity-100 mt-4 border-t border-slate-800 pt-4" : "grid-rows-[0fr] opacity-0 h-0 overflow-hidden"}
                    `}>
                        <div className="overflow-hidden space-y-3">
                             {/* Details Grid */}
                            <div className="space-y-2">
                                 <div className="flex items-center gap-2">
                                    <Image src="/dna.svg" alt="Raça" width={16} height={16} className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">Raça:</span> {pet.breed || "Não informada"}
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Image src="/phone.svg" alt="Telefone" width={16} height={16} className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">Telefone:</span> {pet.clone || pet.phone || "Não informado"}
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Image src="/calendar.svg" alt="Idade" width={16} height={16} className="w-4 h-4 text-slate-400" />
                                    <span className="font-medium">Idade:</span> {pet.age ? `${pet.age} (${pet.birthDate})` : pet.birthDate || "Não informado"}
                                 </div>
                            </div>

                            {/* Actions */}
                            {isOwner && (
                                <div className="flex flex-col gap-2 mt-4 pt-2">
                                    <Button 
                                        className="w-full bg-white text-blue-600 hover:bg-slate-100 font-semibold h-10 rounded-lg"
                                        onClick={handleEditClick}
                                    >
                                        <Image src="/edit.svg" alt="Editar" width={16} height={16} className="w-4 h-4 mr-2" /> Editar
                                    </Button>
                                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 font-semibold h-10 rounded-lg">
                                        <Trash2 className="w-4 h-4 mr-2" /> Remover
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>

                </CardContent>
            </Card>

            <EditPetModal 
                open={isEditModalOpen} 
                onOpenChange={setIsEditModalOpen} 
                pet={pet} 
            />
        </>
    )
}
