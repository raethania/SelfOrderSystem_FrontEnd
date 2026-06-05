import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/ui/Navbar"

type OrderDetailLayoutProps = {
    children: React.ReactNode
    title?: string
    backLabel?: string
    backTo?: string
    rightAction?: React.ReactNode
}

/**
 * Layout reusable untuk halaman detail — mirip struktur SpecialInstruction
 * yang menggunakan Card sebagai container, tapi diperluas untuk full page.
 * Digunakan oleh OrderHistoryDetailPage dan page detail lainnya.
 */
export default function OrderDetailLayout({
    children,
    title = "Order Detail",
    backLabel = "Orders",
    backTo,
    rightAction,
}: OrderDetailLayoutProps) {
    const navigate = useNavigate()

    const handleBack = () => {
        if (backTo) navigate(backTo)
        else navigate(-1)
    }

    return (
        <div className="min-h-dvh bg-background flex flex-col md:flex-row">
            {/* Sidebar nav (desktop) */}
            <Navbar />

            {/* Main area */}
            <div className="flex-1 flex flex-col min-h-dvh">
                {/* Sticky top bar */}
                <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border px-5 py-3 flex items-center gap-3 md:px-10 lg:px-16">
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={handleBack}
                        className="rounded-full shrink-0 text-muted-foreground hover:text-foreground"
                        aria-label="Kembali"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Button>

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-1.5 text-sm min-w-0">
                        <span
                            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors truncate"
                            onClick={handleBack}
                        >
                            {backLabel}
                        </span>
                        <span className="text-muted-foreground/50">›</span>
                        <span className="font-medium text-foreground truncate">{title}</span>
                    </nav>

                    {/* Right action */}
                    {rightAction && (
                        <div className="ml-auto flex items-center">
                            {rightAction}
                        </div>
                    )}
                </header>

                {/* Page content */}
                <main className="flex-1 px-5 py-6 md:px-10 lg:px-16 xl:px-20 pb-10">
                    <div className="mx-auto max-w-5xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
