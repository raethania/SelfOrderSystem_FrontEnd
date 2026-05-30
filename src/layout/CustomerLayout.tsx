import Navbar from "@/components/ui/Navbar"
type CustomerLayoutProps = {
    children: React.ReactNode
    title: string
    subtitle: string
}

export default function CustomerLayout({ children, title, subtitle }: CustomerLayoutProps) {
    return (
        <div className="min-h-dvh flex flex-col md:flex-row">
            {/* Sidebar nav for desktop */}
            <Navbar />

            {/* Main content area */}
            <main className="flex-1 px-5 py-6 pb-28 md:pb-6 md:px-10 lg:px-16 xl:px-20">
                <div className="mx-auto max-w-5xl">
                    <header className="mb-6 md:mb-8">
                        <div className="mb-4">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold inline">{title}</h1>
                            <p className="text-zinc-700 mb-0 md:text-base lg:text-lg">{subtitle}</p>
                        </div>
                    </header>
                    {children}
                </div>
            </main>
        </div>
    )
}