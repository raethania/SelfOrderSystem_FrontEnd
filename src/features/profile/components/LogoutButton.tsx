import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { authApi } from "@/features/auth/api/authApi"
import { useAuthStore } from "@/store/authStore"
import { LogOut } from "lucide-react"

export default function LogoutButton() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const logout = useAuthStore((state) => state.logout)

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await authApi.logout()
        } catch {
            // Even if API fails, clear local state
        } finally {
            logout()
            navigate("/login")
        }
    }

    return (
        <Button
            variant="destructive"
            className="w-full py-6 rounded-xl text-base font-semibold gap-2 opacity-90 hover:opacity-100 transition-opacity"
            onClick={handleLogout}
            disabled={isLoading}
        >
            <LogOut size={18} />
            {isLoading ? "Logging out..." : "Log Out"}
        </Button>
    )
}
