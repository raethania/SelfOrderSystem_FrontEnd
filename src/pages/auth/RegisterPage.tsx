import Header from "@/features/auth/components/Header"
import RegisterForm from "@/features/auth/components/RegisterForm"
import Authlayout from "@/layout/Authlayout"

export default function RegisterPage() {
  return (
    <Authlayout>
      <Header title="Register" body="Already have an account?"/>
      <RegisterForm/>
    </Authlayout>
  )
}
