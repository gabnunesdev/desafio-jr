"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Plus, X  } from "lucide-react"
import Image from "next/image"
import { createPet } from "@/actions/pet"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Validation schema matching server-side
const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  type: z.enum(["DOG", "CAT"], { message: "Selecione o tipo do animal" }),
  breed: z.string().min(2, "A raça deve ter pelo menos 2 caracteres"),
  ownerName: z.string().min(2, "O nome do dono deve ter pelo menos 2 caracteres"),
  ownerPhone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/, "Data inválida (DD/MM/AAAA)"),
})

type FormValues = z.infer<typeof formSchema>

export function CreatePetModal() {
  const [open, setOpen] = useState(false)
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
      type: "DOG", // Default to Dog
    },
  })

  // Watch type for styling radio buttons
  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedType = watch("type")

  async function onSubmit(data: FormValues) {
    setIsLoading(true)
    
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value)
    })

    const result = await createPet(null, formData)

    setIsLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success("Pet cadastrado com sucesso!")
      setOpen(false)
      reset()
      router.refresh()
    }
  }

  // Handle phone mask
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 11) value = value.slice(0, 11)
    
    if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`
    }
    if (value.length > 7) {
      value = `${value.slice(0, 9)}-${value.slice(9)}`
    }
    
    setValue("ownerPhone", value)
  }

  // Handle date mask
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 8) value = value.slice(0, 8)
    
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`
    }
    if (value.length > 5) {
      value = `${value.slice(0, 5)}/${value.slice(5)}`
    }
    
    setValue("birthDate", value)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[linear-gradient(90deg,#00CAFC_0%,#0056E2_100%)] hover:bg-blue-500 text-white font-semibold px-6 rounded-lg h-12 flex items-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.4)]">
           <div className="bg-white/20 rounded-full p-0.5">
               <Plus className="h-4 w-4" />
           </div>
           Cadastrar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-[linear-gradient(316.01deg,#0E0014_15.31%,#001E4D_86.58%)] border-cyan-500/50 text-slate-100 max-w-2xl p-0 gap-0 overflow-hidden shadow-[0px_0px_15px_10px_rgba(0,86,226,0.2)] rounded-[10px] border">
        
        {/* Header with Title */}
        <div className="p-8 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[linear-gradient(135deg,#00CAFC_0%,#0056E2_100%)] flex items-center justify-center shadow-lg shadow-blue-500/30">
                    <Plus className="h-7 w-7 text-white stroke-3" />
                </div>
                <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                    Cadastrar
                </DialogTitle>
            </div>
            {/* Custom Close Button */}
            <DialogClose className="text-slate-400 hover:text-white transition-colors">
                <X className="h-6 w-6" />
            </DialogClose>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 flex flex-col gap-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                
                {/* Nome */}
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300 font-medium flex items-center gap-2">
                        <Image src="/collar-icon.svg" alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
                        Nome
                    </Label>
                    <Input 
                        id="name" 
                        placeholder="Nome Sobrenome" 
                        {...register("name")}
                        className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
                    />
                    {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
                </div>

                {/* Animal (Radio) */}
                <div className="space-y-2">
                    <Label className="text-slate-300 font-medium flex items-center gap-2">
                        <Image src="/dna.svg" alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
                        Animal
                    </Label>
                    <RadioGroup 
                        defaultValue="DOG" 
                        onValueChange={(val) => setValue("type", val as "DOG" | "CAT")}
                        className="flex gap-4"
                    >
                        <div className="flex-1">
                            <RadioGroupItem value="DOG" id="dog" className="peer sr-only" />
                            <Label 
                                htmlFor="dog" 
                                className={`
                                    flex items-center justify-start px-4 gap-3 h-12 rounded-xl border cursor-pointer transition-all
                                    ${selectedType === 'DOG' 
                                        ? 'bg-transparent text-white border-white border-2 font-bold' 
                                        : 'bg-[#0F1629] text-gray-500 border-slate-700/50 hover:border-slate-600'
                                    }
                                `}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedType === 'DOG' ? 'border-white' : 'border-slate-500'}`}>
                                    {selectedType === 'DOG' && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                Cachorro
                            </Label>
                        </div>
                        <div className="flex-1">
                            <RadioGroupItem value="CAT" id="cat" className="peer sr-only" />
                            <Label 
                                htmlFor="cat" 
                                className={`
                                    flex items-center justify-start px-4 gap-3 h-12 rounded-xl border cursor-pointer transition-all
                                    ${selectedType === 'CAT' 
                                        ? 'bg-transparent text-white border-white border-2 font-bold' 
                                        : 'bg-[#0F1629] text-gray-500 border-slate-700/50 hover:border-slate-600'
                                    }
                                `}
                            >
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedType === 'CAT' ? 'border-white' : 'border-slate-500'}`}>
                                    {selectedType === 'CAT' && <div className="w-2 h-2 rounded-full bg-white" />}
                                </div>
                                Gato
                            </Label>
                        </div>
                    </RadioGroup>
                </div>

                {/* Dono */}
                <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-slate-300 font-medium flex items-center gap-2">
                        <Image src="/user-icon.svg" alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
                        Dono
                    </Label>
                     <Input 
                        id="ownerName" 
                        placeholder="Nome Sobrenome" 
                        {...register("ownerName")}
                        className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
                    />
                    {errors.ownerName && <p className="text-red-400 text-xs">{errors.ownerName.message}</p>}
                </div>

                {/* Raça */}
                <div className="space-y-2">
                    <Label htmlFor="breed" className="text-slate-300 font-medium flex items-center gap-2">
                        <Image src="/dna.svg" alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
                        Raça
                    </Label>
                     <Input 
                        id="breed" 
                        placeholder="Raça" 
                        {...register("breed")}
                        className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
                    />
                    {errors.breed && <p className="text-red-400 text-xs">{errors.breed.message}</p>}
                </div>

                {/* Telefone */}
                <div className="space-y-2">
                    <Label htmlFor="ownerPhone" className="text-slate-300 font-medium flex items-center gap-2">
                        <Image src="/phone.svg" alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
                        Telefone
                    </Label>
                     <Input 
                        id="ownerPhone" 
                        placeholder="(00) 0 0000-0000" 
                        {...register("ownerPhone")}
                        onChange={handlePhoneChange}
                        className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
                    />
                    {errors.ownerPhone && <p className="text-red-400 text-xs">{errors.ownerPhone.message}</p>}
                </div>

                {/* Nascimento */}
                <div className="space-y-2">
                    <Label htmlFor="birthDate" className="text-slate-300 font-medium flex items-center gap-2">
                        <Image src="/calendar.svg" alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
                        Nascimento (Aproximado)
                    </Label>
                     <Input 
                        id="birthDate" 
                        placeholder="22/08/2020" 
                        {...register("birthDate")}
                        onChange={handleDateChange}
                        className="bg-[#0F1629] border-slate-700/50 focus:border-blue-500 rounded-xl h-12 text-slate-200 placeholder:text-slate-600"
                    />
                    {errors.birthDate && <p className="text-red-400 text-xs">{errors.birthDate.message}</p>}
                </div>

            </div>

             {/* Footer Actions */}
             <div className="flex gap-4 mt-4 pt-2">
                <DialogClose asChild>
                    <Button type="button" variant="outline" className="flex-1 bg-white hover:bg-slate-100 text-blue-600 border-none font-bold h-12 rounded-lg">
                        <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center mr-2">
                            <ChevronLeftIcon className="w-3 h-3 stroke-3" />
                        </div>
                        Voltar
                    </Button>
                </DialogClose>
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="flex-1 bg-[linear-gradient(90deg,#00CAFC_0%,#0056E2_100%)] hover:bg-blue-600 text-white font-bold h-12 rounded-lg shadow-lg shadow-blue-500/20"
                >
                    <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center mr-2">
                        <Plus className="w-3 h-3 text-white stroke-4" />
                    </div>
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                </Button>
             </div>

        </form>
      </DialogContent>
    </Dialog>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="m15 18-6-6 6-6"/>
        </svg>
    )
}
