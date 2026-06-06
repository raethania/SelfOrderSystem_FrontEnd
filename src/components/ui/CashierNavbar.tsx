import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ClipboardList,
    Receipt,
    LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/features/auth/api/authApi";

type NavItemType = {
    icon: React.ReactNode;
    activeIcon: React.ReactNode;
    name: string;
    link: string;
};

const NavItems: NavItemType[] = [
    {
        icon: <ClipboardList size={20} />,
        activeIcon: <ClipboardList size={20} strokeWidth={2.5} />,
        name: "Orders",
        link: "/cashier/orders",
    },
    {
        icon: <Receipt size={20} />,
        activeIcon: <Receipt size={20} strokeWidth={2.5} />,
        name: "Transactions",
        link: "/cashier/transactions",
    },
];

export default function CashierNavbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        try {
            await authApi.logout();
        } catch {
            // Even if the API call fails, still clear local auth state
        } finally {
            logout();
            navigate("/login", { replace: true });
        }
    };

    const isActive = (link: string) => location.pathname.startsWith(link);

    return (
        <>
            {/* Mobile bottom navbar */}
            <nav className="flex md:hidden justify-around fixed bottom-0 right-0 left-0 bg-white/90 backdrop-blur-lg py-3 px-4 border-t border-t-border z-50">
                {NavItems.map((item, i) => {
                    const active = isActive(item.link);

                    return (
                        <Link
                            key={i}
                            to={item.link}
                            className={`flex flex-col items-center gap-0.5 transition-colors ${
                                active
                                    ? "text-primary"
                                    : "text-foreground/50 hover:text-foreground/80"
                            }`}
                        >
                            {active ? item.activeIcon : item.icon}
                            <p
                                className={`text-[10px] ${
                                    active ? "font-bold" : "font-medium"
                                }`}
                            >
                                {item.name}
                            </p>
                        </Link>
                    );
                })}
            </nav>

            {/* Desktop sidebar navbar */}
            <aside className="hidden md:flex flex-col w-60 lg:w-64 bg-white border-r border-border h-dvh sticky top-0 shrink-0">
                {/* Logo */}
                <div className="p-6 pb-4">
                    <h2 className="text-xl font-bold text-primary tracking-tight">
                        Numbas
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                        Cashier Panel
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex flex-col gap-1 px-3 flex-1">
                    {NavItems.map((item, i) => {
                        const active = isActive(item.link);

                        return (
                            <Link
                                key={i}
                                to={item.link}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                                    active
                                        ? "bg-primary/10 text-primary font-semibold"
                                        : "text-foreground/60 hover:bg-accent hover:text-foreground"
                                }`}
                            >
                                <span className="group-hover:scale-110 transition-transform">
                                    {active ? item.activeIcon : item.icon}
                                </span>
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User info + Logout */}
                <div className="px-3 pb-4 space-y-2">
                    {user && (
                        <div className="p-4 bg-accent/50 rounded-xl">
                            <p className="text-xs text-muted-foreground">
                                Logged in as
                            </p>
                            <p className="text-sm font-semibold text-foreground truncate">
                                {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {user.role}
                            </p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-foreground/60 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                    >
                        <span className="group-hover:scale-110 transition-transform">
                            <LogOut size={20} />
                        </span>
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
}
