import CashierNavbar from "@/components/ui/CashierNavbar";

type CashierLayoutProps = {
    children: React.ReactNode;
    title: string;
    subtitle: string;
};

export default function CashierLayout({
    children,
    title,
    subtitle,
}: CashierLayoutProps) {
    return (
        <div className="min-h-dvh flex flex-col md:flex-row bg-background">
            {/* Sidebar nav for desktop / bottom nav for mobile */}
            <CashierNavbar />

            {/* Main content area */}
            <main className="flex-1 px-5 py-6 pb-28 md:pb-6 md:px-10 lg:px-16 xl:px-20">
                <div className="mx-auto max-w-6xl">
                    <header className="mb-6 md:mb-8">
                        <div className="mb-4">
                            <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold inline text-foreground">
                                {title}
                            </h1>
                            <p className="text-muted-foreground mt-1 md:text-base lg:text-lg">
                                {subtitle}
                            </p>
                        </div>
                    </header>
                    {children}
                </div>
            </main>
        </div>
    );
}
