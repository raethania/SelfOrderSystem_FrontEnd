import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiClient from "@/services/apiClient"
import { ENDPOINTS } from "@/services/endpoints"
import { useAuthStore } from "@/store/authStore"
import type { AuthResponse } from "@/types/auth.types"
import type { ApiResponse } from "@/types/api.types"

export default function RegisterForm() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfirmation] = useState("")

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({})

    const navigate = useNavigate()
    const setAuth = useAuthStore(state => state.setAuth)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== passwordConfirmation) {
            setError("Passwords do not match")
            return
        }

        setIsLoading(true)
        setError(null)
        setFieldErrors({})

        try {
            const response = await apiClient.post(ENDPOINTS.auth.register, {
                name,
                email,
                password,
                password_confirmation: passwordConfirmation
            }) as ApiResponse<AuthResponse>

            const { user, token } = response.data
            setAuth(user, token)

            if (user.role === 'admin') navigate('/admin/products')
            else if (user.role === 'cashier') navigate('/cashier/orders')
            else if (user.role === 'kitchen') navigate('/kitchen/orders')
            else navigate('/customer/home')
        } catch (err: any) {
            setError(err.message || "Failed to register")
            if (err.errors) {
                setFieldErrors(err.errors)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="">
            {error && <div className="text-red-500 mb-4 text-sm font-medium">{error}</div>}

            <div className="mb-5">
                <Input
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                {fieldErrors.name && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.name[0]}</span>}
            </div>

            <div className="mb-5">
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {fieldErrors.email && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.email[0]}</span>}
            </div>

            <div className="flex gap-5 mb-5">
                <div className="flex-1">
                    <Input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {fieldErrors.password && <span className="text-xs text-red-500 mt-1 block">{fieldErrors.password[0]}</span>}
                </div>
                <div className="flex-1">
                    <Input
                        name="password_confirmation"
                        type="password"
                        placeholder="Confirm Password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Loading..." : "Submit"}
            </Button>
        </form>
    )
}
