import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { deletePet } from "@/actions/pet"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formSchema } from "./validation"
import { FormValues, PetType } from "./types"
import { FormField } from "./form-field"
import { PetTypeSelector } from "./pet-type-selector"
import { ModalHeader } from "./modal-header"
import { ModalFooter } from "./modal-footer"
import { ICONS, LABELS,  } from "./constants"
// Define compatible interface for the Pet data passed from PetCard
interface PetUI {
  id: number
  name: string
  type: string | "DOG" | "CAT"
  breed?: string | null
  ownerName?: string | null
  owner?: string // from PetCard
  ownerPhone?: string | null
  phone?: string // from PetCard
  birthDate?: string | null
}

interface DeletePetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pet: PetUI | null
}


export function DeletePetModal({ open, onOpenChange, pet }: DeletePetModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    
    handleSubmit,
    
    watch,
    reset,
    
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "DOG",
    },
  })

  useEffect(() => {
    if (pet && open) {
        reset({
            name: pet.name,
            type: (pet.type as PetType) || "DOG",
            breed: pet.breed || "",
            ownerName: pet.ownerName || pet.owner || "",
            ownerPhone: pet.ownerPhone || pet.phone || "",
            birthDate: pet.birthDate || "",
        })
    }
  }, [pet, open, reset])

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = watch("type")

  async function onSubmit() {
    if (!pet) return
    setIsLoading(true)

    const result = await deletePet(pet.id)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Pet removido com sucesso!")
      onOpenChange(false)
      router.refresh()
    }
  }

  // Inputs are read-only, so no change handlers needed really, but keeping them for form consistency doesn't hurt, 
  // though we will disable the inputs.

  const disabledInputClass = "bg-[#404A5C] border-none rounded-xl h-12 text-white placeholder:text-slate-400 opacity-100 cursor-not-allowed"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95%] md:w-full bg-[linear-gradient(316.01deg,#0E0014_15.31%,#001E4D_86.58%)] border-cyan-500/50 text-slate-100 max-w-2xl p-0 gap-0 overflow-hidden shadow-[0px_0px_15px_10px_rgba(0,86,226,0.2)] rounded-[10px] border"
      >
        <ModalHeader />

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-8 flex flex-col gap-5 md:gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-6">
            <FormField label={LABELS.name} icon={ICONS.collar} error={undefined}>
              <Input
                value={pet?.name || ""}
                disabled
                className={disabledInputClass}
              />
            </FormField>

            {/* PetTypeSelector restored with read-only feel via the component update */}
            <PetTypeSelector value={selectedType} onChange={() => {}} />

            <FormField label={LABELS.owner} icon={ICONS.user} error={undefined}>
              <Input
                value={pet?.ownerName || pet?.owner || ""}
                disabled
                className={disabledInputClass}
              />
            </FormField>

            <FormField label={LABELS.breed} icon={ICONS.dna} error={undefined}>
              <Input
                value={pet?.breed || ""}
                disabled
                className={disabledInputClass}
              />
            </FormField>

            <FormField label={LABELS.phone} icon={ICONS.phone} error={undefined}>
              <Input
                value={pet?.ownerPhone || pet?.phone || ""}
                disabled
                className={disabledInputClass}
              />
            </FormField>

            <FormField label={LABELS.birthDate} icon={ICONS.calendar} error={undefined}>
                <Input 
                    value={pet?.birthDate || ""}
                    disabled
                    className={disabledInputClass}
                />
            </FormField>
          </div>

          <div className="text-center font-bold text-white text-lg mt-2">
            Tem certeza que deseja remover esse pet?
          </div>

          <ModalFooter isLoading={isLoading} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
