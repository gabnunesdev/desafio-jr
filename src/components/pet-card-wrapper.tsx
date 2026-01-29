"use client"

import { useState } from "react"
import { PetCard } from "@/components/pet-card"

interface Pet {
    id: number
    name: string
    owner: string // Mapped from ownerName or relation
    type: string | "DOG" | "CAT"
    breed?: string | null
    phone?: string | null
    birthDate?: string | null
    age?: string
    ownerName?: string | null
    ownerPhone?: string | null
}

export function PetCardWrapper({ pets }: { pets: Pet[] }) {
    const [selectedPetId, setSelectedPetId] = useState<number | null>(null)

    function handleSelectPet(id: number) {
        setSelectedPetId(prevId => prevId === id ? null : id)
    }

    return (
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            {pets.map((pet) => {
                // Adapt Prisma data to PetCard interface
                const adaptedPet = {
                    id: pet.id,
                    name: pet.name,
                    owner: pet.ownerName || "Desconhecido", // Use specific owner field
                    type: String(pet.type), // Validate enum if needed
                    breed: pet.breed || undefined,
                    phone: pet.ownerPhone || undefined,
                    birthDate: pet.birthDate || undefined,
                    age: pet.age
                }

                return (
                    <PetCard 
                        key={pet.id} 
                        pet={adaptedPet} 
                        isSelected={selectedPetId === pet.id} 
                        onSelect={handleSelectPet} 
                    />
                )
            })}
             {pets.length === 0 && (
                <div className="col-span-full h-64 flex items-center justify-center text-slate-500">
                    Nenhum pet cadastrado.
                </div>
            )}
        </div>
    )
}
