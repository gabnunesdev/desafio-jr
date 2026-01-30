"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import Image from "next/image"
import { DatePickerFieldProps } from "./types"
import { ICONS, LABELS, PLACEHOLDERS } from "./constants"

function parseDateString(dateString: string): Date | undefined {
  if (!dateString || !/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
    return undefined
  }

  const parts = dateString.split("/")
  if (parts.length !== 3) return undefined

  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)

  return new Date(year, month - 1, day)
}

export function DatePickerField({ value, onChange, error }: DatePickerFieldProps) {
  const selectedDate = parseDateString(value)

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "dd/MM/yyyy"))
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="birthDate" className="text-slate-300 font-medium flex items-center gap-2">
        <Image src={ICONS.calendar} alt="" width={16} height={16} className="w-4 h-4 opacity-70" />
        {LABELS.birthDate}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal bg-[#0F1629] border-slate-700/50 hover:bg-[#0F1629] hover:text-slate-200 focus:border-blue-500 rounded-xl h-12 text-slate-200",
              !value && "text-slate-600"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
            {value || <span>{PLACEHOLDERS.selectDate}</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-[#0F1629] border-slate-700 text-slate-200" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            captionLayout="dropdown"
            locale={ptBR}
            className="bg-[#00060F] text-slate-200 rounded-md p-3 absolute top-0 left-0 border-[#404A5C] border-3"
            classNames={{
              selected: "text-black hover:text-black focus:bg-white focus:text-black font-bold",
              today: "font-bold",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-slate-300 hover:bg-slate-800 hover:text-white",
              outside: "text-slate-600 opacity-50",
              years_dropdown: "bg-orange-100 flex items-center justify-center h-8 w-full text-black",
              months_dropdown: "bg-black flex items-center justify-center h-8 w-full text-black",
              table: "border-collapse space-y-1",
              head_row: "flex justify-center",
              row: "flex w-full mt-2 justify-center",
              month_caption: "capitalize text-center"

            }}
          />
        </PopoverContent>
      </Popover>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  )
}
