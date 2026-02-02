import { Label } from "@/components/ui/label"
import Image from "next/image"
import { FormFieldProps } from "./types"

export function FormField({ label, icon, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label className="text-slate-300 font-medium flex items-center gap-2">
        <Image src={icon} alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
        {label}
      </Label>
      {children}
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
