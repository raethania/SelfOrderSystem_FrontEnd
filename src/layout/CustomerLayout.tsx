import { Search } from "@/components/ui/search"

type CustomerLayoutProps = {
    children: React.ReactNode
    title: string
    subtitle: string
}

export default function CustomerLayout({ children, title, subtitle }: CustomerLayoutProps) {
    return (
        <div className="m-10">
            <header className="mb-5">
                <h1 className="text-xl mb-2">{title}</h1>
                <p className="text-zinc-700 mb-4">{subtitle}</p>
                <Search />
            </header>
            {children}
        </div>
    )
}