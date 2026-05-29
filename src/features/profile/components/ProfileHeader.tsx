import { useAuthStore } from "@/store/authStore"

export default function ProfileHeader() {
    const user = useAuthStore((state) => state.user)

    const memberSince = user?.created_at
        ? new Date(user.created_at).getFullYear().toString()
        : "2024"

    const roleLabel = user?.role
        ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
        : "Customer"

    const initials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U"

    return (
        <div className="relative bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 md:p-8 text-white overflow-hidden mb-6">
            {/* Decorative circles */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />

            <div className="relative flex items-center gap-4 md:gap-6">
                {/* Avatar */}
                <div className="w-14 h-14 md:w-18 md:h-18 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-xl md:text-2xl font-bold shrink-0 ring-2 ring-white/30">
                    {initials}
                </div>

                <div className="min-w-0">
                    <h2 className="text-lg md:text-xl font-bold truncate">
                        {user?.name || "Guest User"}
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                        {roleLabel} · Since {memberSince}
                    </p>
                </div>
            </div>
        </div>
    )
}
