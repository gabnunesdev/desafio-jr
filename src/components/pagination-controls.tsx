"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationControlsProps {
  totalPages: number
  currentPage: number
  totalCount: number
}

export function PaginationControls({
  totalPages,
  currentPage,
  totalCount,
}: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", page.toString())
    router.replace(`/?${params.toString()}`)
  }

  return (
    <div className="w-full max-w-7xl flex justify-end mt-8 items-center gap-2 text-slate-400 text-sm font-medium">
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <span>
        {currentPage} de {Math.max(1, totalPages)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-white hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  )
}
