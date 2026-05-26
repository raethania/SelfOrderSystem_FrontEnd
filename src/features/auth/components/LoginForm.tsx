import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import apiClient from "@/services/apiClient"
import { ENDPOINTS } from "@/services/endpoints"
import { useAuthStore } from "@/store/authStore"
import type { AuthResponse } from "@/types/auth.types"
import type { ApiResponse } from "@/types/api.types"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const setAuth = useAuthStore(state => state.setAuth)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.post(ENDPOINTS.auth.login, {
        email,
        password
      }) as ApiResponse<AuthResponse>

      const { user, token } = response.data
      setAuth(user, token)

      if (user.role === 'admin') navigate('/admin/products')
      else if (user.role === 'cashier') navigate('/cashier/table-selection')
      else if (user.role === 'kitchen') navigate('/kitchen/dashboard')
      else navigate('/customer/home')
    } catch (err: any) {
      setError(err.message || "Failed to login. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="">
      {error && <div className="text-red-500 mb-4 text-sm font-medium">{error}</div>}
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-5"
        required
      />
      <Input
        name="password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-5"
        required
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Loading..." : "Submit"}
      </Button>
    </form>
  )
}
