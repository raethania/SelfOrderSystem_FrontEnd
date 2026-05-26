import * as React from "react"
import { Search as SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Search({ className, type = "text", ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full">
      <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-muted-foreground"/>

      <input
        type={type}
        data-slot="input"
        className={cn(
          "h-10 w-full rounded-full border border-input bg-transparent pl-15 pr-6 outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-xl",
          className
        )}
        placeholder="Search menu items..."
        {...props}
      />
    </div>
  )
}

export { Search }