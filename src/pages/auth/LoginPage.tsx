import Header from "@/features/auth/components/Header"
import LoginForm from "@/features/auth/components/LoginForm"
import Authlayout from "@/layout/Authlayout"

export default function LoginPage() {
  return (
    <Authlayout>
      <Header title="Login" body="Don’t have an account?"/>
      <LoginForm/>
    </Authlayout>
  )
}
