import { Search } from "@/components/ui/search"

export default function Homepage() {
  return (
    <div className="m-5">
        <header>
            <h1 className="text-xl mb-2">Table 03</h1>
            <p className="text-zinc-700 mb-4">Find your favorite meal</p>
            <Search/>
        </header>
        <div></div>
    </div>
  )
}
