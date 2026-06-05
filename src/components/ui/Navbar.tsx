import { Link, useLocation } from "react-router-dom"
import { House, ClipboardList, Clock, User } from "lucide-react"

type NavbarItemType = {
    icon: React.ReactNode
    activeIcon: React.ReactNode
    name: string
    link: string
}

const NavbarItems: NavbarItemType[] = [
    {
        icon: <House size={20} />,
        activeIcon: <House size={20} strokeWidth={2.5} />,
        name: "Home",
        link: "/customer/home",
    },
    {
        icon: <ClipboardList size={20} />,
        activeIcon: <ClipboardList size={20} strokeWidth={2.5} />,
        name: "Orders",
        link: "/customer/new-order",
    },
    {
        icon: <Clock size={20} />,
        activeIcon: <Clock size={20} strokeWidth={2.5} />,
        name: "History",
        link: "/customer/history",
    },
    {
        icon: <User size={20} />,
        activeIcon: <User size={20} strokeWidth={2.5} />,
        name: "Profile",
        link: "/customer/profile",
    },
]

export default function Navbar() {
    const location = useLocation()

    return (
        <>
            {/* Mobile bottom navbar */}
            <nav className="flex md:hidden justify-between fixed bottom-0 right-0 left-0 bg-white/90 backdrop-blur-lg py-3 px-6 border-t border-t-border z-50">
                {NavbarItems.map((navbar, i) => {
                    const isActive = location.pathname === navbar.link

                    return (
                        <Link
                            key={i}
                            to={navbar.link}
                            className={`flex flex-col items-center gap-0.5 transition-colors ${
                                isActive
                                    ? "text-primary"
                                    : "text-foreground/50 hover:text-foreground/80"
                            }`}
                        >
                            {isActive ? navbar.activeIcon : navbar.icon}
                            <p className={`text-[11px] ${isActive ? "font-bold" : "font-medium"}`}>
                                {navbar.name}
                            </p>
                        </Link>
                    )
                })}
            </nav>

            {/* Desktop sidebar navbar */}
            <aside className="hidden md:flex flex-col w-60 lg:w-64 bg-white border-r border-border min-h-dvh sticky top-0 shrink-0">
                <div className="p-6 pb-4">
                    <h2 className="text-xl font-bold text-primary tracking-tight">Numbas</h2>
                    <p className="text-xs text-muted-foreground mt-1">Self Order System</p>
                </div>

                <nav className="flex flex-col gap-1 px-3 flex-1">
                    {NavbarItems.map((navbar, i) => {
                        const isActive = location.pathname === navbar.link

                        return (
                            <Link
                                key={i}
                                to={navbar.link}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    isActive
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-foreground/60 hover:bg-accent hover:text-foreground"
                                }`}
                            >
                                <span className="group-hover:scale-110 transition-transform">
                                    {isActive ? navbar.activeIcon : navbar.icon}
                                </span>
                                <span className="text-sm">{navbar.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 mx-3 mb-4 bg-accent/50 rounded-xl">
                    <p className="text-xs text-muted-foreground">Table</p>
                    <p className="text-sm font-semibold text-foreground">03</p>
                </div>
            </aside>
        </>
    )
}
