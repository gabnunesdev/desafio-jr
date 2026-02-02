import { DialogClose, DialogTitle } from "@/components/ui/dialog"
import { Trash2, X } from "lucide-react"
import { LABELS } from "./constants"

export function ModalHeader() {
  return (
    <div className="p-5 md:p-8 pb-0 flex items-center justify-between">
      <div className="flex items-center gap-3 md:gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[linear-gradient(135deg,#00CAFC_0%,#0056E2_100%)] flex items-center justify-center shadow-lg shadow-blue-500/30">
          <Trash2 className="h-6 w-6 md:h-7 md:w-7 text-white stroke-3" />
        </div>
        <DialogTitle className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
          {LABELS.register}
        </DialogTitle>
      </div>
      <DialogClose className="text-slate-400 hover:text-white transition-colors">
        <X className="h-6 w-6" />
      </DialogClose>
    </div>
  )
}
