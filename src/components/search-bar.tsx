"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

export function SearchBar() {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace } = useRouter()
  
  // Local state for immediate input feedback
  const [term, setTerm] = useState(searchParams.get("q")?.toString() || "")

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams)
      const currentQuery = params.get("q") || ""
      
      // Prevent infinite loop: only update if term is different from URL
      if (term === currentQuery) return

      if (term) {
        params.set("q", term)
      } else {
        params.delete("q")
      }
      
      // Reset to page 1 on new search
      params.delete("page")
      
      replace(`${pathname}?${params.toString()}`)
    }, 500) // 500ms delay

    return () => clearTimeout(delayDebounceFn)
  }, [term, pathname, replace, searchParams])

  return (
    <div className="flex-1 relative">
      <div className="relative w-full flex items-center bg-transparent border-3 border-[#404A5C] rounded-[10px] h-14 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all shadow-inner">
        <div className="bg-[#404A5C] rounded-l-[5px] w-12 h-13 flex items-center justify-center">
          <Search className="h-6 w-6 text-[#0F1629]" />
        </div>
        
        <Input 
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Buscar por pet ou dono..." 
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-slate-200 placeholder:text-slate-500 h-full text-base"
        />
        <Button 
            className="bg-[#404A5C] mr-2 hover:bg-slate-700 text-slate-200 font-medium px-6 rounded-[5px] h-10 shadow-sm"
            onClick={() => {
                // Force update immediately on click if needed, though debounce handles it.
                // Mostly visual here since typing already triggers search.
                const params = new URLSearchParams(searchParams)
                if (term) {
                    params.set("q", term)
                } else {
                    params.delete("q")
                }
                replace(`${pathname}?${params.toString()}`)
            }}
        >
            Pesquisar
        </Button>
      </div>
    </div>
  )
}
