import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { updatePet } from "@/actions/pet"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { formSchema } from "./validation"
import { FormValues, PetType } from "./types"
import { FormField } from "./form-field"
import { PetTypeSelector } from "./pet-type-selector"
import { DatePickerField } from "./date-picker-field"
import { ModalHeader } from "./modal-header"
import { ModalFooter } from "./modal-footer"
import { ICONS, LABELS, PLACEHOLDERS } from "./constants"

interface EditPetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pet: any // Using any for simplicity as Pet definition varies, but ideally imported
}

function applyPhoneMask(value: string): string {
  const numbers = value.replace(/\D/g, "").slice(0, 11)
  
  if (numbers.length <= 2) return numbers
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
  
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`
}

export function EditPetModal({ open, onOpenChange, pet }: EditPetModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "DOG",
    },
  })

  // Pre-fill form when pet changes or modal opens
  useEffect(() => {
    if (pet && open) {
        reset({
            name: pet.name,
            type: (pet.type as PetType) || "DOG",
            breed: pet.breed || "",
            ownerName: pet.ownerName || pet.owner || "", // Support both structures
            ownerPhone: pet.ownerPhone || pet.phone || "",
            birthDate: pet.birthDate || "",
        })
    }
  }, [pet, open, reset])

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = watch("type")
  const birthDate = watch("birthDate")

  async function onSubmit(data: FormValues) {
    if (!pet) return
    setIsLoading(true)

    const formData = new FormData()
    formData.append("id", pet.id.toString()) // Critical for update
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const result = await updatePet(null, formData)
    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Pet atualizado com sucesso!")
      onOpenChange(false)
      router.refresh()
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue("ownerPhone", applyPhoneMask(e.target.value))
  }

  const handleTypeChange = (value: PetType) => {
    setValue("type", value)
  }

  const handleDateChange = (value: string) => {
    setValue("birthDate", value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95%] md:w-full bg-[linear-gradient(316.01deg,#0E0014_15.31%,#001E4D_86.58%)] border-cyan-500/50 text-slate-100 max-w-2xl p-0 gap-0 overflow-hidden shadow-[0px_0px_15px_10px_rgba(0,86,226,0.2)] rounded-[10px] border"
      >
        <ModalHeader />

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 md:p-8 flex flex-col gap-5 md:gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 md:gap-y-6">
            <FormField label={LABELS.name} icon={ICONS.collar} error={errors.name?.message}>
              <Input
                id="name"
                placeholder={PLACEHOLDERS.name}
                {...register("name")}
                className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
              />
            </FormField>

            <PetTypeSelector value={selectedType} onChange={handleTypeChange} />

            <FormField label={LABELS.owner} icon={ICONS.user} error={errors.ownerName?.message}>
              <Input
                id="ownerName"
                placeholder={PLACEHOLDERS.ownerName}
                {...register("ownerName")}
                className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
              />
            </FormField>

            <FormField label={LABELS.breed} icon={ICONS.dna} error={errors.breed?.message}>
              <Input
                id="breed"
                placeholder={PLACEHOLDERS.breed}
                {...register("breed")}
                className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
              />
            </FormField>

            <FormField label={LABELS.phone} icon={ICONS.phone} error={errors.ownerPhone?.message}>
              <Input
                id="ownerPhone"
                placeholder={PLACEHOLDERS.phone}
                {...register("ownerPhone")}
                onChange={handlePhoneChange}
                className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
              />
            </FormField>

            <DatePickerField value={birthDate} onChange={handleDateChange} error={errors.birthDate?.message} />
          </div>

          <ModalFooter isLoading={isLoading} />
        </form>
      </DialogContent>
    </Dialog>
  )
}
