import * as z from "zod"
import { formSchema } from "./validation"

export type FormValues = z.infer<typeof formSchema>

export type PetType = "DOG" | "CAT"

export interface FormFieldProps {
  label: string
  icon: string
  error?: string
  children: React.ReactNode
}

export interface PetTypeSelectorProps {
  value: PetType
  onChange: (value: PetType) => void
}

export interface DatePickerFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
}
