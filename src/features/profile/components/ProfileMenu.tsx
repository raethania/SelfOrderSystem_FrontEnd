import { Card } from "@/components/ui/card"
import {
    Store,
    CreditCard,
    Printer,
    Bell,
    HelpCircle,
    ChevronRight,
} from "lucide-react"

interface MenuItem {
    icon: React.ReactNode
    title: string
    subtitle: string
}

const menuItems: MenuItem[] = [
    {
        icon: <Store size={20} className="text-primary" />,
        title: "Restaurant Settings",
        subtitle: "Name, address, branding",
    },
    {
        icon: <CreditCard size={20} className="text-primary" />,
        title: "Payment Settings",
        subtitle: "Methods, fees, taxes",
    },
    {
        icon: <Printer size={20} className="text-primary" />,
        title: "Printer Settings",
        subtitle: "Receipt & kitchen printer",
    },
    {
        icon: <Bell size={20} className="text-primary" />,
        title: "Notifications",
        subtitle: "Alerts, sounds, vibration",
    },
    {
        icon: <HelpCircle size={20} className="text-primary" />,
        title: "Help & Support",
        subtitle: "FAQ, contact, tutorials",
    },
]

export default function ProfileMenu() {
    return (
        <Card className="p-2 md:p-3 mb-6">
            <div className="divide-y divide-border">
                {menuItems.map((item, i) => (
                    <button
                        key={i}
                        className="flex items-center gap-4 w-full px-3 py-3.5 md:py-4 hover:bg-accent/50 rounded-lg transition-colors text-left group cursor-pointer"
                    >
                        <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors">
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm md:text-base font-medium text-foreground">
                                {item.title}
                            </p>
                            <p className="text-xs md:text-sm text-muted-foreground">
                                {item.subtitle}
                            </p>
                        </div>
                        <ChevronRight
                            size={18}
                            className="text-muted-foreground shrink-0 group-hover:translate-x-0.5 transition-transform"
                        />
                    </button>
                ))}
            </div>
        </Card>
    )
}
