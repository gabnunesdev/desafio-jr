"use client"

import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Image from "next/image"
import { PetTypeSelectorProps, PetType } from "./types"
import { ICONS, LABELS } from "./constants"

const PET_OPTIONS: Array<{ value: PetType; label: string; id: string }> = [
  { value: "DOG", label: "Cachorro", id: "dog" },
  { value: "CAT", label: "Gato", id: "cat" },
]

export function PetTypeSelector({ value, onChange }: PetTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300 font-medium flex items-center gap-2">
        <Image src={ICONS.dna} alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
        {LABELS.animal}
      </Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
        {PET_OPTIONS.map((option) => (
          <div key={option.value} className="flex-1">
            <RadioGroupItem value={option.value} id={option.id} className="peer sr-only" />
            <Label
              htmlFor={option.id}
              className={`
                flex items-center justify-start px-4 gap-3 h-12 rounded-xl border cursor-pointer transition-all
                ${
                  value === option.value
                    ? "bg-transparent text-white border-white border-2 font-bold"
                    : "bg-[#0F1629] text-gray-500 border-slate-700/50 hover:border-slate-600"
                }
              `}
            >
              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                  value === option.value ? "border-white" : "border-slate-500"
                }`}
              >
                {value === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
