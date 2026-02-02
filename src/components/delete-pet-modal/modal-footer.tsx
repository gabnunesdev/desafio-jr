import { Button } from "@/components/ui/button"
import { DialogClose } from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"
import { LABELS } from "./constants"

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

interface ModalFooterProps {
  isLoading: boolean
}

export function ModalFooter({ isLoading }: ModalFooterProps) {
  return (
    <div className="flex gap-4 mt-4 pt-2">
      <DialogClose asChild>
        <Button
          type="button"
          variant="outline"
          className="flex-1 bg-white hover:bg-slate-100 text-blue-600 border-none font-bold h-12 rounded-lg"
        >
          <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center mr-2">
            <ChevronLeftIcon className="w-3 h-3 stroke-3" />
          </div>
          {LABELS.back}
        </Button>
      </DialogClose>
      <Button
        type="submit"
        disabled={isLoading}
        className="flex-1 bg-[#ED254E] hover:bg-[#ED254E]/90 text-white font-bold h-12 rounded-lg shadow-lg shadow-[#ED254E]/20"
      >
        <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2">
            <Trash2 className="w-3 h-3 text-white stroke-4" />
        </div>
        {isLoading ? LABELS.registering : LABELS.register}
      </Button>
    </div>
  )
}
